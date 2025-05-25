import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../estilos css/Services.css';

const Servicios = () => {
  const navigate = useNavigate();

  return (
    <div className="services-page">
      <div className="services-container">
        <h1>¿Qué haremos hoy?</h1>
        <div className="services-cards">
          <div className="service-card" onClick={() => navigate('/Agendar')}>
            <img src="https://lobbyfix.com/wp-content/uploads/2020/12/businessman-planning-events-deadlines-agenda_74855-6274.jpg" alt="Consulta Médica" />
            <h3>Agendar cita</h3>
            <p>Agendar y crear citas médicas</p>
          </div>

          <div className="service-card" onClick={() => navigate('/Carnet')}>
            <img src="https://img.freepik.com/vector-premium/veterinario-mascotas-medico-veterinario-clinica-animales-pastillas-perros-icono-plano_194360-333.jpg" alt="Cirugía General" />
            <h3>Carnet de vacunación</h3>
            <p>Crea carnet de vacunación y lista los carnets disponibles</p>
          </div>

          <div className="service-card" onClick={() => navigate('/Calendario')}>
            <img src="https://www.profuturo.mx/content/dam/profuturo/success_agendar_cita.webp" alt="Vacunación" />
            <h3>Visualizar calendario</h3>
            <p>Mantén actualizado tu calendario.</p>
          </div>
          <div className="service-card" onClick={() => navigate('/RegistrarVet')}>
            <img src="https://img.freepik.com/vector-gratis/ilustracion-dibujos-animados-veterinario-dibujado-mano_23-2150738482.jpg" alt="Vacunación" />
            <h3>Registrar Veterinario</h3>
            <p>Crea cuenta para tus veterinarios</p>
          </div>
          <div className="service-card" onClick={() => navigate('/Administrar')}>
            <img src="https://img.freepik.com/vector-premium/concepto-inversion_118813-2769.jpg" alt="Vacunación" />
            <h3>Administrar</h3>
            <p>Cambio de opciones del aplicativo</p>
          </div>
           <div className="service-card" onClick={() => navigate('/Horario')}>
            <img src="https://i.pinimg.com/736x/9e/17/2f/9e172f641958d16570b5600bcd9dd476.jpg" alt="Horario" />
            <h3>Horario</h3>
            <p>Cambia el horario laboral de la veterinaria</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Servicios;
