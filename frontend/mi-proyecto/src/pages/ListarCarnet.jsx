import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaw, FaDog, FaShapes, FaEye, FaEdit, FaVenusMars, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import '../estilos css/listar.css';
import { getAllMascotas, getMascotasByDuenioId } from "../services/obtenermascota"; // 
import { getUsuarioByUsuarioId } from "../services/usuariosService"; // trae el nombre pr usuario_id

export default function ListarCarnet() {
  const [searchTerm, setSearchTerm] = useState('');
  const [carnets, setCarnets] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando
  const [error, setError] = useState(null);   // Estado para almacenar mensajes de error
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarnets = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        let usuario_id = null;
        let rol_id = null;

        if (!token) {
          navigate('/login');
          return;
        }

        try {
          const payloadBase64 = token.split(".")[1];
          const decodedPayload = JSON.parse(atob(payloadBase64));
          usuario_id = decodedPayload.usuario_id;
          rol_id = decodedPayload.rol_id;
          // eslint-disable-next-line no-unused-vars
        } catch (decodeError) {
          throw new Error("Token inválido. Inicie sesión nuevamente.");
        }

        if (!usuario_id || !rol_id) {
          throw new Error("Información de usuario incompleta.");
        }

        let data;
        if (rol_id === 2) {
          data = await getMascotasByDuenioId(usuario_id);
        } else if (rol_id === 1 || rol_id === 3) {
          data = await getAllMascotas();
        } else {
          throw new Error('Rol no reconocido.');
        }

        // --- Obtener nombres de los propietarios ---
        const dataWithOwners = await Promise.all(
          data.map(async (mascota) => {
            try {
              const propietario = await getUsuarioByUsuarioId(mascota.duenio_id);
              return {
                ...mascota,
                nombre_propietario: propietario.nombre || 'Desconocido'
              };
            } catch (e) {
              console.error(`Error obteniendo nombre de propietario para ID ${mascota.duenio_id}:`, e);
              return {
                ...mascota,
                nombre_propietario: 'Desconocido'
              };
            }
          })
        );

        setCarnets(dataWithOwners);
      } catch (err) {
        setError(err.message || 'Error al cargar los carnets.');
        if (err.message.includes('token')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCarnets();
  }, [navigate]);

  // Filtra los carnets mostrados según el término de búsqueda
  const filteredCarnets = carnets.filter(carnet =>
    carnet.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carnet.nombre_propietario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Renderizado Condicional ---
  if (loading) {
    return (
      <div className="list-carnet-container">
        <p>Cargando carnets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-carnet-container">
        <p style={{ color: 'red', textAlign: 'center', fontSize: '1.2em' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="list-carnet-container">
      <h2 className="list-carnet-title">Listado de Carnets</h2>

      <input
        type="text"
        placeholder="Buscar por nombre de mascota o propietario ...."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="list-carnet-search"
      />

      <div className="list-carnet-grid">
        {/* Botón para añadir carnet, siempre visible */}
        <div className="list-carnet-card add-card" onClick={() => navigate('/Crearcarnet')}>
          <FaPlus className="add-icon" />
          <p>Añadir Carnet</p>
        </div>

        {/* Mostrar los carnets filtrados o un mensaje si no hay */}
        {filteredCarnets.length > 0 ? (
          filteredCarnets.map((carnet) => (
            <div key={carnet.mascota_id} className="list-carnet-card">
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
                <p className="list-carnet-info"><FaDog className="list-carnet-icon" /> <strong>Raza:</strong> {carnet.raza || 'N/A'}</p>
                <p className="list-carnet-info"><FaShapes className="list-carnet-icon" /> <strong>Especie:</strong> {carnet.especie}</p>
                <p className="list-carnet-info"><FaVenusMars className="list-carnet-icon" /> <strong>Sexo:</strong> {carnet.sexo}</p>
                <p className="list-carnet-info"><FaCalendarAlt className="list-carnet-icon" /> <strong>Fecha Nacimiento:</strong> {carnet.fecha_nacimiento ? new Date(carnet.fecha_nacimiento).toISOString().split('T')[0] : 'N/A'}</p>
                <p className="list-carnet-info"><FaVenusMars className="list-carnet-icon" /> <strong>Propietario:</strong> {carnet.nombre_propietario}</p>

              </div>

              <div className="list-carnet-actions">
                {/* Asegúrate de que tus rutas de React Router estén configuradas para aceptar el ID de la mascota */}
                <button className="list-carnet-btn list-carnet-view" onClick={() => navigate(`/Vercarnet/${carnet.mascota_id}`)}>
                  <FaEye /> Ver vacunas
                </button>
                {/* <button className="list-carnet-btn list-carnet-edit" onClick={() => navigate(`/Editarcarnet`)}>
                  <FaEdit /> Editar
                </button> */}
                <button className="list-carnet-btn list-carnet-add" onClick={() => navigate(`/Addcarnet/${carnet.mascota_id}`)}>
                  <FaPlus /> Administrar vacunas
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