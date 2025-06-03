import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../estilos css/calendario.css";
import Swal from "sweetalert2";
import { agendarcita, obtenerTelefono } from "../services/agendarService";
import { useNavigate } from "react-router-dom";
import { obtenerCitas } from "../services/obtenercitaService";
import { enviarRecordatorioWpp } from "../services/recordatorioWpp";
import { getWhatsappByUsuarioId, getUsuarioByUsuarioId } from "../services/usuariosService";

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [observacion, setObservacion] = useState("");
  const [citas, setCitas] = useState([]);
  const [horasDisponiblesParaSeleccion, setHorasDisponiblesParaSeleccion] = useState([]);
  const navigate = useNavigate();

  const manejarClick = () => {
    navigate('/citas');
  };

  // Función para enviar recordatorio con delay de 5 minutos (para prueba)
  const enviarRecordatorioConDelay = async (usuario_id, fechaCita, horaCita) => {
    try {
      console.log("Iniciando proceso de recordatorio para usuario:", usuario_id);

      // Validar que tenemos el usuario_id
      if (!usuario_id) {
        console.error("Error: usuario_id es null o undefined");
        return;
      }

      let phoneNumber = null;
      let nombreUsuario = "Usuario";

      // Intentar obtener el número de WhatsApp usando el método principal
      try {
        const whatsappResponse = await getWhatsappByUsuarioId(usuario_id);
        if (whatsappResponse.state !== "error") {
          phoneNumber = whatsappResponse.whatsapp ||
            whatsappResponse.data?.whatsapp ||
            whatsappResponse.telefono ||
            whatsappResponse.data?.telefono;
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.log("Método principal falló, intentando alternativo...");
      }

      // Si no se encontró con el método principal, usar el método alternativo
      if (!phoneNumber || phoneNumber.trim() === '') {
        try {
          const telefonoData = await obtenerTelefono(usuario_id);
          phoneNumber = telefonoData.whatsapp || telefonoData.telefono;
        } catch (altError) {
          console.error("Error en método alternativo:", altError);
        }
      }

      // Obtener el nombre del usuario
      try {
        const usuarioResponse = await getUsuarioByUsuarioId(usuario_id);
        if (usuarioResponse.state !== "error") {
          nombreUsuario = usuarioResponse.nombre ||
            usuarioResponse.data?.nombre ||
            "Usuario";
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.log("No se pudo obtener el nombre del usuario, usando 'Usuario' por defecto");
      }

      // Validar que finalmente tenemos el número
      if (!phoneNumber || phoneNumber.trim() === '') {
        console.error("No se pudo obtener el número de WhatsApp por ningún método");
        return;
      }

      // Crear el mensaje de recordatorio
      const mensaje = `Hola ${nombreUsuario}, te recordamos que tienes una cita agendada el ${fechaCita} a las ${horaCita}. ¡Te esperamos! 🐾`;

      console.log("Recordatorio programado para:", {
        numero: phoneNumber,
        usuario: nombreUsuario,
        envioEn: "30 segundos"
      });

      // Programar el envío del recordatorio para 30 segundos después (para prueba)
      setTimeout(async () => {
        try {
          console.log("Enviando recordatorio por WhatsApp...");
          const recordatorioResponse = await enviarRecordatorioWpp(phoneNumber, mensaje);

          if (recordatorioResponse.state === "error") {
            console.error("Error al enviar recordatorio:", recordatorioResponse.message);
          } else {
            console.log("✅ Recordatorio enviado exitosamente");
          }
        } catch (error) {
          console.error("Error en el envío del recordatorio:", error);
        }
      }, 30 * 1000); // 30 segundos en milisegundos  (24 * 60 * 60 * 1000 para 24 horas)
    } catch (error) {
      console.error("Error general en enviarRecordatorioConDelay:", error);
    }
  };

  useEffect(() => {
    const fetchCitas = async () => {
      const response = await obtenerCitas();
      if (response.state !== "error") {
        setCitas(response);
      } else {
        console.error("Error al obtener citas:", response.message);
      }
    };
    fetchCitas();
  }, []);

  useEffect(() => {
    actualizarHorasDisponibles(date);
  }, [date, citas]);

  const actualizarHorasDisponibles = (fechaSeleccionada) => {
    const ALL_POSSIBLE_HOURS = [
      "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
      "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    ];

    // Ajustamos la fecha seleccionada a las 00:00:00 para comparación solo por día
    const selectedDateAtMidnight = new Date(fechaSeleccionada);
    selectedDateAtMidnight.setHours(0, 0, 0, 0);

    const now = new Date(); // Hora actual precisa
    const todayAtMidnight = new Date(now);
    todayAtMidnight.setHours(0, 0, 0, 0);

    // Helper para convertir AM/PM a 24h y obtener un objeto Date para comparación
    const parseTimeToDate = (timeStr, baseDate) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (modifier === 'PM' && hours < 12) {
        hours += 12;
      } else if (modifier === 'AM' && hours === 12) { // 12 AM (medianoche)
        hours = 0;
      }

      const d = new Date(baseDate); // Usar la baseDate para mantener el día, mes, año
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    const fechaStringISO = new Date(fechaSeleccionada.getTime() - fechaSeleccionada.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    const horasOcupadas = citas
      .filter((cita) => cita.fecha.split("T")[0] === fechaStringISO)
      .map((cita) => cita.hora);

    // FILTRADO INICIAL: Solo pasamos las horas que no están ocupadas ni en el pasado
    let horasFiltradas = ALL_POSSIBLE_HOURS.filter(hora => {
      const isOccupied = horasOcupadas.includes(hora);
      let isPast = false;

      if (selectedDateAtMidnight.getTime() === todayAtMidnight.getTime()) {
        const horaCitaCompleta = parseTimeToDate(hora, now);
        isPast = horaCitaCompleta.getTime() <= now.getTime();
      }

      return !isOccupied && !isPast; // Solo se incluyen las que NO están ocupadas y NO han pasado
    });

    setHorasDisponiblesParaSeleccion(horasFiltradas); // Guardamos solo las horas realmente seleccionables

    // Ajusta la hora seleccionada si la actual ya no está disponible
    if (!horasFiltradas.includes(time)) {
      setTime(horasFiltradas.length > 0 ? horasFiltradas[0] : "");
    }
  };

  const handleAgendarCita = async () => {
    if (!time) {
      Swal.fire({ icon: "error", title: "Error", text: "Debe seleccionar una hora." });
      return;
    }

    // Validación FINAL justo antes de agendar (clave para la robustez)
    const now = new Date();
    const selectedDateTime = new Date(date);
    const [selectedHour, selectedMinute] = time.split(':').map(Number);
    let finalHour = selectedHour;
    let finalMinute = selectedMinute;
    const modifier = time.includes('PM') ? 'PM' : 'AM';

    if (modifier === 'PM' && finalHour < 12) {
      finalHour += 12;
    } else if (modifier === 'AM' && finalHour === 12) {
      finalHour = 0;
    }
    selectedDateTime.setHours(finalHour, finalMinute, 0, 0);

    // Re-chequear si la hora ya pasó (hora o fecha)
    if (selectedDateTime.getTime() <= now.getTime()) {
      Swal.fire({
        icon: "error",
        title: "Hora no válida",
        text: "No puedes agendar citas para una hora que ya ha pasado. Por favor, selecciona una hora futura.",
      });
      return;
    }

    // Re-chequear si la hora está ocupada (consultando la lista de citas actual)
    const fechaStringISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    const isHoraOcupada = citas.some(cita => cita.fecha.split("T")[0] === fechaStringISO && cita.hora === time);
    if (isHoraOcupada) {
      Swal.fire({
        icon: "error",
        title: "Hora Ocupada",
        text: "Esa hora ya está reservada para otra cita. Por favor, elige otro horario.",
      });
      return;
    }

    const fechaFormateada = date.toLocaleDateString();
    const textoConfirmacion = `¿Desea agendar esta cita el día ${fechaFormateada} a las ${time}?`;

    const confirmResult = await Swal.fire({
      title: "¿Está seguro?",
      text: textoConfirmacion,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, agendar",
      cancelButtonText: "No, cancelar",
    });

    if (!confirmResult.isConfirmed) return;

    // Obtener el usuario_id desde el token
    const token = localStorage.getItem("token");
    let usuario_id = null;

    if (token) {
      try {
        const payloadBase64 = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        usuario_id = decodedPayload.usuario_id;
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }

    const citaData = {
      fecha: date.toISOString().split("T")[0],
      hora: time,
      observaciones: observacion,
      usuario_id: usuario_id
    };

    // Para sacar en una variable el numero de telefono del usuario (código original comentado)
    // const telefonoData = await obtenerTelefono(usuario_id);
    // console.log("Número de teléfono del usuario:", telefonoData.whatsapp || telefonoData.telefono);

    try {
      const data = await agendarcita(citaData);

      if (data.message === "Cita agendada con exito") {
        // Formatear la fecha para el mensaje del recordatorio
        const fechaFormateadaParaRecordatorio = date.toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Enviar recordatorio con delay de 5 minutos
        if (usuario_id) {
          enviarRecordatorioConDelay(usuario_id, fechaFormateadaParaRecordatorio, time);
        }

        Swal.fire({
          icon: "success",
          title: "¡Agenda exitoso!",
          text: "Cita agendada correctamente. Recibirás un recordatorio por WhatsApp en 5 minutos.",
          timer: 3000,
          showConfirmButton: false
        }).then(() => navigate("/"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Ocurrió un problema al agendar la cita."
        });
      }
    } catch (error) {
      console.error("Error al agendar cita:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un problema al agendar la cita. Inténtalo nuevamente."
      });
    }
  };

  return (
    <div className="calendar-page">
      <h2>Agendar Cita</h2>
      <div className="content-container">
        <div className="image-container">
          <img src="https://st.depositphotos.com/2398521/2630/i/450/depositphotos_26307249-stock-photo-guilty-dog-on-white.jpg" alt="Mascota" />
        </div>
        <div className="calendar-container">
          <Calendar
            onChange={setDate}
            value={date}
            className="custom-calendar"
            tileClassName={({ date }) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (date < today) {
                return "past-date";
              }
              return null;
            }}
          />
          <div className="time-selector">
            <label>Horas disponibles:</label>
            {horasDisponiblesParaSeleccion.length > 0 ? (
              <div className="time-buttons">
                {horasDisponiblesParaSeleccion.map((hora) => (
                  <button
                    key={hora}
                    className={`time-btn ${time === hora ? "selected" : ""}`}
                    onClick={() => setTime(hora)}
                  >
                    {hora}
                  </button>
                ))}
              </div>
            ) : (
              <p className="no-disponible">No hay horarios disponibles para este día.</p>
            )}
          </div>
          <div className="observation-input">
            <label htmlFor="observacion">Observaciones:</label>
            <input
              type="text"
              id="observacion"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Ej: Atención general, Peluquería, Vacunación"
            />
          </div>
          <p className="selected-date">Fecha seleccionada: <span>{date.toLocaleDateString()}</span></p>
          <p className="selected-time">Hora seleccionada: <span>{time || "No seleccionada"}</span></p>
          <button className="schedule-btn" onClick={handleAgendarCita} disabled={!time}>Agendar</button>
          <br />
          <button className="schedule-btn" onClick={manejarClick}>Administrar Mis Citas</button>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;