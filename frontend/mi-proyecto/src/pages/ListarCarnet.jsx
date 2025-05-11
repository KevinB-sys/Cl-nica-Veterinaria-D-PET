import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaw, FaDog, FaShapes, FaEye, FaEdit, FaVenusMars, FaCalendarAlt, FaPlus, FaAd } from 'react-icons/fa';
import '../estilos css/listar.css';
import { getMascotas } from "../services/obtenermascota";

export default function ListarCarnet() {
  const [searchTerm, setSearchTerm] = useState('');
  const [carnets, setCarnets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMascotas = async () => {
      const data = await getMascotas();
      if (data.state !== "error") {
        setCarnets(data);
      }
    };
    fetchMascotas();
  }, []);

  const filteredCarnets = carnets.filter(carnet =>
    carnet.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="list-carnet-container">
      <h2 className="list-carnet-title">Listado de Carnets</h2>

      <input
        type="text"
        placeholder="Buscar por nombre de mascota..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="list-carnet-search"
      />

      <div className="list-carnet-grid">
        <div className="list-carnet-card add-card" onClick={() => navigate('/Crearcarnet')}>
          <FaPlus className="add-icon" />
          <p>Añadir Carnet</p>
        </div>
        {filteredCarnets.length > 0 ? (
          filteredCarnets.map((carnet) => (
            <div key={carnet.id} className="list-carnet-card">
              <div className="list-carnet-header">
                <FaPaw className="list-carnet-icont" /> FICHA DE SALUD
              </div>
              <img 
                src={carnet.imagen || 'https://www.experta.com.ar/blogg/wp-content/uploads/sites/2/2019/01/mascotas.jpg'} 
                alt={`Imagen de ${carnet.nombre}`} 
                className="list-carnet-img"
              />
              <div>
                <p className="list-carnet-info"><FaPaw className="list-carnet-icon" /> <strong>Mascota:</strong> {carnet.nombre}</p>
                <p className="list-carnet-info"><FaDog className="list-carnet-icon" /> <strong>Raza:</strong> {carnet.raza}</p>
                <p className="list-carnet-info"><FaShapes className="list-carnet-icon" /> <strong>Especie:</strong> {carnet.especie}</p>
                <p className="list-carnet-info"><FaVenusMars className="list-carnet-icon" /> <strong>Sexo:</strong> {carnet.sexo}</p>
                <p className="list-carnet-info"><FaCalendarAlt className="list-carnet-icon" /> <strong>Fecha Nacimiento:</strong> {new Date(carnet.fecha_nacimiento).toISOString().split('T')[0]}</p>
              </div>

              <div className="list-carnet-actions">
                <button className="list-carnet-btn list-carnet-view" onClick={() => navigate(`/Vercarnet`)}>
                  <FaEye /> Ver
                </button>
                <button className="list-carnet-btn list-carnet-edit" onClick={() => navigate(`/Editarcarnet`)}>
                  <FaEdit /> Editar
                </button>
                <button className="list-carnet-btn list-carnet-add" onClick={() => navigate(`/Addcarnet`)}>
                  <FaPlus /> Añadir
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="list-carnet-no-results">No se encontraron carnets.</p>
        )}
      </div>
    </div>
  );
}
