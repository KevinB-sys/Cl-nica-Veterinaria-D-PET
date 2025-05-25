import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../estilos css/calendario.css";
import Swal from "sweetalert2";
import { agendarcita } from "../services/agendarService";
import { useNavigate } from "react-router-dom";
import { obtenerCitas } from "../services/obtenercitaService";

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [observacion, setObservacion] = useState("");
  const [citas, setCitas] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const navigate = useNavigate();

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
    const fechaString = new Date(fechaSeleccionada.getTime() - fechaSeleccionada.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
    const horas = [
      "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
      "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    ];

    const horasOcupadas = citas
      .filter((cita) => cita.fecha.split("T")[0] === fechaString)
      .map((cita) => cita.hora);

    const disponibles = horas.filter((hora) => !horasOcupadas.includes(hora));

    setHorasDisponibles(disponibles);

    if (disponibles.length > 0) {
      setTime(disponibles[0]);
    } else {
      setTime("");
    }
  };

  const handleAgendarCita = async () => {
    if (!time) {
      Swal.fire({ icon: "error", title: "Error", text: "Debe seleccionar una hora." });
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

    const data = await agendarcita(citaData);

    if (data.message === "Cita agendada con exito") {
      Swal.fire({ icon: "success", title: "¡Agenda exitoso!", text: "Cita agendada correctamente", timer: 2000, showConfirmButton: false })
        .then(() => navigate("/"));
    } else {
      Swal.fire({ icon: "error", title: "Error", text: data.message || "Ocurrió un problema al agendar la cita." });
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
            {horasDisponibles.length > 0 ? (
              <div className="time-buttons">
                {horasDisponibles.map((hora) => (
                  <button key={hora} className={`time-btn ${time === hora ? "selected" : ""}`} onClick={() => setTime(hora)}>
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
          <button className="schedule-btn">Administrar Mis Citas</button>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
