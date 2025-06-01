import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../estilos css/vercalendario.css";
import { obtenerCitas } from "../services/obtenercitaService";
import Swal from "sweetalert2"; // Importamos SweetAlert2

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  const [citas, setCitas] = useState([]);
  const [citasFiltradas, setCitasFiltradas] = useState([]);
  const [diasConCitas, setDiasConCitas] = useState(new Set());

  // Obtener citas al cargar el componente
  useEffect(() => {
    const fetchCitas = async () => {
      const response = await obtenerCitas();
      if (response.state !== "error") {
        setCitas(response);

        // Extraer solo las fechas de las citas y guardarlas en un Set para resaltarlas en el calendario
        const fechasCitas = new Set(
          response.map((cita) => cita.fecha.split("T")[0]) // Tomar solo la parte de la fecha (YYYY-MM-DD)
        );
        setDiasConCitas(fechasCitas);
      } else {
        console.error("Error al obtener citas:", response.message);
      }
    };

    fetchCitas();
  }, []);

  // Filtrar citas según la fecha seleccionada
  useEffect(() => {
    const fechaSeleccionada = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    const citasDelDia = citas.filter((cita) => {
      return cita.fecha.split("T")[0] === fechaSeleccionada;
    });

    setCitasFiltradas(citasDelDia);

    // Si hay citas, mostrar un alert con las citas del día usando SweetAlert2
    if (citasDelDia.length > 0) {
      // Crear un string en formato de lista
      const citasInfo = citasDelDia
        // .map((cita) => `<li>${cita.hora}</li>`) // Utilizamos <li> para cada hora
        .map((cita) => `<li>${cita.hora} - ${cita.observaciones || 'Sin observación'}</li>`)
        .join(""); // Unir los elementos de lista sin saltos de línea

      // Mostrar un alert con las citas del día usando SweetAlert2
      Swal.fire({
        title: `Citas para ${date.toLocaleDateString()}`,
        html: `<ul class="citas-lista">${citasInfo}</ul>`, // Aplicar la clase citas-lista
        icon: "info", // Estilo del alerta
        confirmButtonText: "Cerrar",
      });
    }
  }, [date, citas]);

  // Función para resaltar los días con citas en el calendario
  const tileClassName = ({ date }) => {
    const fecha = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    return diasConCitas.has(fecha) ? "highlight-day" : ""; // Agregar clase si hay citas en ese día
  };

  return (
    <div className="calendar-page">
      <h2>VISUALIZAR CITAS</h2>

      {/* Mensaje estático explicativo sobre el color amarillo */}
      <div className="info-message">
        <p>
          <strong>¡Aviso!</strong> Los días resaltados en color indican que hay citas programadas para ese día.
        </p>
      </div>

      <div className="content-container">
        {/* Imagen a la izquierda */}
        <div className="image-container">
          <img
            src="https://st.depositphotos.com/2398521/2630/i/450/depositphotos_26307249-stock-photo-guilty-dog-on-white.jpg"
            alt="Perro"
          />
        </div>

        {/* Calendario */}
        <div className="calendar-container">
          <Calendar
            onChange={setDate}
            value={date}
            className="custom-calendar"
            tileClassName={tileClassName} // Agregar clases a los días con citas
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
