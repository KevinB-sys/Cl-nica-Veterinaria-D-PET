import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaw, FaDog, FaShapes, FaVenusMars, FaCalendarAlt, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import '../estilos css/editar.css';
import { getAllMascotas } from "../services/obtenermascota";
import { deleteMascota } from "../services/mascotaService";
import Swal from 'sweetalert2';
import { getUsuarioByUsuarioId } from "../services/usuariosService"; // trae el nombre pr usuario_id

export default function ListarCarnet() {
  const [searchTerm, setSearchTerm] = useState('');
  const [carnets, setCarnets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null); // Para mostrar estado de eliminación
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarnets = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllMascotas();

        // Obtener nombre del propietario
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

        setCarnets(dataWithOwners); // Establece el array enriquecido
      } catch (err) {
        console.error('Error al cargar carnets:', err);
        setError(err.message || 'Error desconocido al cargar los carnets.');
      } finally {
        setLoading(false);
      }
    };

    fetchCarnets(); // Llama a la función interna
  }, []);


  // Función para manejar la eliminación
  const handleDelete = async (mascota_id, nombreMascota) => {
    // Confirmación antes de eliminar con SweetAlert2
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el carnet de ${nombreMascota}? Esta acción no se puede deshacer, recuerda eliminar sus vacunaciones antes de eliminar el carnet.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      return;
    }

    setDeleting(mascota_id); // Mostrar estado de carga en el botón específico

    try {
      const deleteResult = await deleteMascota(mascota_id);

      if (deleteResult.state === "error") {
        throw new Error(deleteResult.message);
      }

      // Si la eliminación fue exitosa, actualizar el estado local
      setCarnets(prevCarnets => prevCarnets.filter(carnet => carnet.mascota_id !== mascota_id));

      // Mostrar mensaje de éxito con SweetAlert2
      await Swal.fire({
        title: '¡Eliminado!',
        text: `El carnet de ${nombreMascota} ha sido eliminado exitosamente.`,
        icon: 'success',
        confirmButtonColor: '#3085d6'
      });

    } catch (err) {
      console.error('Error al eliminar carnet:', err);

      // Mostrar mensaje de error con SweetAlert2
      await Swal.fire({
        title: 'Error',
        text: `Error al eliminar el carnet: ${err.message}`,
        icon: 'error',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setDeleting(null); // Quitar estado de carga
    }
  };

  const filteredCarnets = carnets.filter(carnet =>
    carnet.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="list-carnet-container"><p>Cargando carnets...</p></div>;
  }

  if (error) {
    return <div className="list-carnet-container"><p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p></div>;
  }

  return (
    <div className="list-carnet-container">
      <h2 className="list-carnet-title">Edición de Carnets</h2>

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
                <button className="list-carnet-btn list-carnet-edit" onClick={() => navigate(`/Editar/${carnet.mascota_id}`)}>
                  <FaEdit /> Editar
                </button>

                <button
                  className="list-carnet-btn list-carnet-delet"
                  onClick={() => handleDelete(carnet.mascota_id, carnet.nombre)}
                  disabled={deleting === carnet.mascota_id}
                >
                  <FaTrash /> {deleting === carnet.mascota_id ? 'Eliminando...' : 'Eliminar'}
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