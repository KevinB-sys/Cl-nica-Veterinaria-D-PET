import React, { useState, useEffect } from 'react'; // Importa useState y useEffect
import { useNavigate, useParams } from 'react-router-dom'; // Importa useParams
import '../estilos css/vercarnet.css'; // Asegúrate de que esta ruta sea correcta

// Importar imágenes de la veterinaria y el icono de la vacuna
import logoVeterinaria from '../imagenes/logo.png';
import iconoVacuna from '../imagenes/vacuna.png';

// Importa la función para obtener vacunas por mascota del servicio
import { getVacunasByMascota } from '../services/vacunasService';
import Swal from 'sweetalert2'; // Para alertas bonitas

export default function RegistroVacunacion() {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtén el ID de la mascota de la URL

  // Estados para manejar los datos, carga y errores
  const [vacunas, setVacunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para cargar las vacunas cuando el componente se monta o el ID cambia
  useEffect(() => {
    const fetchVacunas = async () => {
      if (!id) {
        // Si no hay ID en la URL, maneja el error
        setError("No se encontró el ID de la mascota en la URL.");
        setLoading(false);
        Swal.fire({
          icon: 'warning',
          title: 'ID no encontrado',
          text: 'No se pudo cargar el carnet porque falta el ID de la mascota. Asegúrate de que la URL sea correcta.',
          confirmButtonText: 'Cerrar'
        });
        return;
      }

      setLoading(true); // Indica que la carga ha iniciado
      setError(null); // Resetea cualquier error previo

      const result = await getVacunasByMascota(id); // Llama al servicio del frontend

      if (result.state === "success") {
        setVacunas(result.data); // Guarda los datos de las vacunas
      } else {
        setError(result.message); // Guarda el mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar',
          text: result.message || 'Ocurrió un error desconocido al cargar las vacunas.',
          confirmButtonText: 'Cerrar'
        });
      }
      setLoading(false); // Indica que la carga ha terminado
    };

    fetchVacunas(); // Ejecuta la función de carga
  }, [id]); // Dependencia del useEffect: se ejecuta cuando el ID cambia

  const handlePrint = () => {
    window.print();
  };

  // Muestra un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="registro-vacunacion-container">
        <p>Cargando carnet de vacunación...</p>
      </div>
    );
  }

  // Muestra un mensaje de error si algo salió mal
  if (error) {
    return (
      <div className="registro-vacunacion-container">
        <p className="error-message">Error al cargar el carnet: {error}</p>
        <button className="btn-retroceder" onClick={() => navigate(-1)}>⬅ Volver</button>
      </div>
    );
  }

  return (
    <div className="registro-vacunacion-container">
      <br />
      <br />
      {/* Este h2 se ocultará al imprimir */}
      <h2>Carnet de Vacunación de Mascota ID: {id}</h2>

      {/* Este es el encabezado que se mostrará solo al imprimir */}
      <div className="print-header">
        <img src={logoVeterinaria} alt="Logo Veterinaria" className="logo-print" />
        <h1>Carnet de Vacunación de Mascota</h1> {/* Título más específico para la impresión */}
      </div>

      {vacunas.length === 0 ? (
        <p>No hay vacunas registradas para esta mascota.</p>
      ) : (
        <table className="registro-vacunacion-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Edad</th>
              <th>Peso</th>
              <th>Vacuna <img src={iconoVacuna} alt="Vacuna" className="icono-header" /></th>
              <th>Próxima Visita</th>
            </tr>
          </thead>
          <tbody>
            {vacunas.map((vacuna) => (
              <tr key={vacuna.vacunacion_id}> {/* Usa vacunacion_id como key única */}
                <td>{new Date(vacuna.fecha_aplicacion).toLocaleDateString()}</td>
                <td>{vacuna.edad}</td>
                <td>{vacuna.peso}</td> {/* Asegúrate de que el backend devuelva el peso en un formato adecuado */}
                <td>{vacuna.vacuna}</td>
                <td>{new Date(vacuna.proxima_visita).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Estos botones se ocultarán al imprimir */}
      <div className="registro-buttons">
        <button className="btn-retroceder" onClick={() => navigate(-1)}>⬅ Volver</button>
        <button className="btn-imprimir" onClick={handlePrint}>🖨️ Imprimir</button>
      </div>
    </div>
  );
}