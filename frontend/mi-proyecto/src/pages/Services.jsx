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
        </div>
      </div>
    </div>
  );
};

export default Servicios;
