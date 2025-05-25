import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import '../estilos css/horario.css';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// URL de ejemplo para la imagen de veterinaria
const VETERINARIA_BG_URL = 'https://st2.depositphotos.com/1177973/5394/i/450/depositphotos_53949945-stock-photo-collage-of-cute-pets-isolated.jpg';

const Horario = () => {
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const horasDisponibles = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const navigate = useNavigate(); // Inicializamos navigate

  const handleSeleccionarHora = (hora) => {
    if (!horaInicio) {
      setHoraInicio(hora);
    } else if (!horaFin && horasDisponibles.indexOf(hora) > horasDisponibles.indexOf(horaInicio)) {
      setHoraFin(hora);
    } else {
      setHoraInicio(hora);
      setHoraFin("");
    }
  };

  const handleSubmit = () => {
    if (horaInicio && horaFin) {
      Swal.fire({
        title: '¡Cita Confirmada!',
        text: `Tu horario de atención veterinaria es de ${horaInicio} a ${horaFin}. ¡Gracias por confiar en nosotros!`,
        icon: 'success',
        confirmButtonText: '¡Excelente!',
        confirmButtonColor: '#2c2c6c' // Tu color principal
      }).then((result) => {
        if (result.isConfirmed) {
          console.log('Horario de cita confirmado:', `${horaInicio} - ${horaFin}`);
          // Lógica para enviar el horario al backend
          navigate('/'); // Redirige a la página principal
        }
      });
    } else {
      Swal.fire({
        title: '¡Algo falta!',
        text: 'Por favor, selecciona tanto la hora de inicio como la hora de fin para tu cita.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#2c2c6c' // Tu color principal
      });
    }
  };

  const handleCancel = () => {
    navigate('/'); // Redirige a la página principal al cancelar
  };

  const getClassForHoraButton = (hora) => {
    let classes = 'hora-btn';
    const index = horasDisponibles.indexOf(hora);
    const startIndex = horaInicio ? horasDisponibles.indexOf(horaInicio) : -1;
    const endIndex = horaFin ? horasDisponibles.indexOf(horaFin) : -1;

    if (hora === horaInicio) {
      classes += ' inicio-seleccionado';
    }
    if (hora === horaFin) {
      classes += ' fin-seleccionado';
    }

    if (horaInicio && !horaFin && index > startIndex) {
      classes += ' rango-posible';
    }
    if (horaInicio && horaFin && index >= startIndex && index <= endIndex) {
      if (hora !== horaInicio && hora !== horaFin) {
        classes += ' en-rango-seleccionado';
      }
    }

    const isOutsideSelectedRange = horaFin && !(index >= startIndex && index <= endIndex);
    if (isOutsideSelectedRange && hora !== horaInicio && hora !== horaFin) {
        classes += ' disabled';
    }

    return classes;
  };

  return (
    <div className="horario-container-veterinaria">
      <div className="horario-imagen-fondo" style={{ backgroundImage: `url(${VETERINARIA_BG_URL})` }}>
      </div>

      <div className="horario-body">
        <h2 className="horario-titulo">¡Programa tu horario laboral!</h2>
        <p className="horario-subtitulo">Selecciona el intervalo de atención de 8 AM a 6 PM</p>

        <div className="horas-grid">
          {horasDisponibles.map((hora) => (
            <button
              key={hora}
              className={getClassForHoraButton(hora)}
              onClick={() => handleSeleccionarHora(hora)}
              disabled={horaFin && !((horasDisponibles.indexOf(hora) >= horasDisponibles.indexOf(horaInicio)) && (horasDisponibles.indexOf(hora) <= horasDisponibles.indexOf(horaFin))) && hora !== horaInicio}
            >
              {hora}
            </button>
          ))}
        </div>

        <div className="seleccion-actual">
          {horaInicio && horaFin ? (
            <p>Horario Seleccionado: <strong>{horaInicio} - {horaFin}</strong></p>
          ) : horaInicio ? (
            <p>Hora de Inicio: <strong>{horaInicio}</strong>. Ahora selecciona la hora de fin.</p>
          ) : (
            <p>Selecciona tu hora de inicio.</p>
          )}
        </div>

        <div className="horario-acciones">
          <button
            className="guardar-btn"
            onClick={handleSubmit}
            disabled={!horaInicio || !horaFin}
          >
            Confirmar Horario
          </button>
          <button
            className="cancelar-btn"
            onClick={handleCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Horario;