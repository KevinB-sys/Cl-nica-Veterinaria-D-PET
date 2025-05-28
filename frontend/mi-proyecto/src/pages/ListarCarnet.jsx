import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaw, FaDog, FaShapes, FaEye, FaEdit, FaVenusMars, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import '../estilos css/listar.css';
import { getAllMascotas, getMascotasByDuenioId } from "../services/obtenermascota"; // Importamos ambas funciones

export default function ListarCarnet() {
  const [searchTerm, setSearchTerm] = useState('');
  const [carnets, setCarnets] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos están cargando
  const [error, setError] = useState(null);   // Estado para almacenar mensajes de error
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarnets = async () => {
      setLoading(true); // Inicia el estado de carga
      setError(null);   // Limpia cualquier error previo

      try {
        const token = localStorage.getItem('token'); // Obtiene el token del localStorage
        let usuario_id = null;
        let rol_id = null; // Variable para almacenar el rol_id

        if (!token) {
          // Si no hay token, el usuario no está autenticado, redirigir al login
          navigate('/login');
          return; // Detener la ejecución
        }

        // --- Decodificación manual del token ---
        try {
          const payloadBase64 = token.split(".")[1];
          const decodedPayload = JSON.parse(atob(payloadBase64));
          usuario_id = decodedPayload.usuario_id;
          rol_id = decodedPayload.rol_id; // Asume que el rol se llama rol_id en el payload
        } catch (decodeError) {
          console.error("Error al decodificar el token:", decodeError);
          throw new Error("Token inválido o corrupto. Por favor, inicie sesión nuevamente.");
        }
        // --- Fin de la decodificación manual ---

        if (!usuario_id || !rol_id) {
          throw new Error("Información de usuario o rol incompleta en el token.");
        }

        let data;
        if (rol_id === 2) { // Si el rol es 2 (Cliente)
          // Cliente solo ve sus propias mascotas
          data = await getMascotasByDuenioId(usuario_id);
        } else if (rol_id === 1 || rol_id === 3) { // Si el rol es 1 (Veterinario) o 3 (Administrador)
          // Veterinarios y administradores ven todas las mascotas
          data = await getAllMascotas();
        } else {
          // Rol no reconocido, mostrar error
          throw new Error('Rol de usuario no reconocido. Acceso denegado.');
        }

        setCarnets(data); // Asigna los datos obtenidos al estado

      } catch (err) {
        console.error('Error al cargar carnets:', err);
        setError(err.message || 'Error desconocido al cargar los carnets.');
        // En caso de error de token o autenticación, redirigir al login
        if (err.message.includes('token') || err.message.includes('autenticación')) {
          navigate('/login');
        }
      } finally {
        setLoading(false); // Finaliza el estado de carga
      }
    };

    fetchCarnets();
  }, [navigate]); // `Maps` se añade a las dependencias para evitar warnings

  // Filtra los carnets mostrados según el término de búsqueda
  const filteredCarnets = carnets.filter(carnet =>
    carnet.nombre.toLowerCase().includes(searchTerm.toLowerCase())
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
        placeholder="Buscar por nombre de mascota..."
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
              </div>

              <div className="list-carnet-actions">
                {/* Asegúrate de que tus rutas de React Router estén configuradas para aceptar el ID de la mascota */}
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