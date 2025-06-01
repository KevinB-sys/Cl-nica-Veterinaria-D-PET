import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../estilos css/carnet.css';

export default function Carnet() {
  const navigate = useNavigate();

  return (
    <div className="carnet-page">
      <h1>Gestión de Carnets de Vacunación</h1>
      <div className="carnet-container">
        {/* Tarjeta para crear nuevo carnet */}
        <div className="carnet-card" onClick={() => navigate('/CrearCarnet')}>
          <img src="https://cdn-icons-png.flaticon.com/128/11809/11809968.png" alt="Listar Carnets" />
          <h3>Crear Nuevo Carnet</h3>
          <p>Registra un nuevo carnet de vacunación.</p>
        </div>

        {/* Tarjeta para listar carnets */}
        <div className="carnet-card" onClick={() => navigate('/ListarCarnet')}>
          <img src="https://cdn-icons-png.flaticon.com/128/3659/3659538.png" alt="Crear Carnet" />
          <h3>Listar Carnets</h3>
          <p>Consulta y administra vacunas a los carnets existentes.</p>
        </div>
        <div className="carnet-card" onClick={() => navigate('/EditarCarnet')}>
          <img src="https://cdn-icons-png.flaticon.com/128/1491/1491106.png" alt="Crear Carnet" />
          <h3>Editar Carnets</h3>
          <p>Modifca la información de carnets existentes.</p>
        </div>
      </div>
    </div>
  );
}
