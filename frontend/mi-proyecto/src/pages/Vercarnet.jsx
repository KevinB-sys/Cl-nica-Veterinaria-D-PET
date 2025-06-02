import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../estilos css/vercarnet.css';

// Importar imágenes de la veterinaria y el icono de la vacuna
import logoVeterinaria from '../imagenes/logo.png';
import iconoVacuna from '../imagenes/vacuna.png';

// Importa las funciones para obtener datos
import { getVacunasByMascota } from '../services/vacunasService';
import { getMascotaById } from '../services/obtenermascota'; // Asegúrate de que la ruta sea correcta
import Swal from 'sweetalert2';
import { getUsuarioByUsuarioId } from '../services/usuariosService'; // trae el nombre del propeitario por usuario_id

export default function RegistroVacunacion() {

  const formatearFechaParaVisualizacion = (fecha) => {
    if (!fecha) return '';

    // Crear la fecha como fecha local en lugar de UTC
    const fechaString = fecha.split('T')[0]; // Obtener solo la parte de la fecha
    const [year, month, day] = fechaString.split('-');
    const date = new Date(year, month - 1, day); // Los meses en JS van de 0-11

    return date.toLocaleDateString();
  };

  // Función específica para formato corto (dd/mm/yy)
  const formatearFechaCorta = (fecha) => {
    if (!fecha) return '';

    const fechaString = fecha.split('T')[0];
    const [year, month, day] = fechaString.split('-');
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  const navigate = useNavigate();
  const { id } = useParams();

  // Estados para manejar los datos, carga y errores
  const [vacunas, setVacunas] = useState([]);
  const [mascota, setMascota] = useState(null);
  const [propietario, setPropietario] = useState(null); // Nuevo estado para el propietario
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para cargar las vacunas y datos de la mascota
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
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

      // CONVERSIÓN A ENTERO - SOLUCIÓN AL ERROR DE PRISMA
      const mascotaId = parseInt(id, 10);
      if (isNaN(mascotaId)) {
        setError("El ID de la mascota no es válido.");
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'ID inválido',
          text: 'El ID de la mascota debe ser un número válido.',
          confirmButtonText: 'Cerrar'
        });
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Cargar datos de la mascota y vacunas en paralelo
        const [vacunasResult, mascotaData] = await Promise.all([
          getVacunasByMascota(mascotaId),
          getMascotaById(mascotaId)
        ]);

        if (vacunasResult.state === "success") {
          setVacunas(vacunasResult.data);
        } else {
          throw new Error(vacunasResult.message || 'Error al cargar las vacunas');
        }

        setMascota(mascotaData);

        // Obtener el nombre del propietario si existe usuario_id
        if (mascotaData && mascotaData.duenio_id) {
          try {
            // const propietarioData = await getUsuarioByUsuarioId(mascotaData.usuario_id);
            const propietarioData = await getUsuarioByUsuarioId(mascotaData.duenio_id);
            setPropietario(propietarioData);
          } catch (propietarioError) {
            console.error('Error al obtener datos del propietario:', propietarioError);
            // No lanzamos error aquí, solo mostramos N/A en el propietario
          }
        }

      } catch (err) {
        console.error('Error completo:', err);
        setError(err.message);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar',
          text: err.message || 'Ocurrió un error desconocido al cargar los datos.',
          confirmButtonText: 'Cerrar'
        });
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  // Función para obtener el nombre del propietario
  const obtenerNombrePropietario = () => {
    if (propietario && propietario.nombre) {
      return propietario.nombre;
    }
    if (mascota?.propietario_nombre) {
      return mascota.propietario_nombre;
    }
    if (mascota?.propietario) {
      return mascota.propietario;
    }
    return 'N/A';
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
      {/* Contenido visible en pantalla */}
      <div className="screen-content">
        <br />
        <br />
        <h2>CARNET DE VACUNACIÓN DE {mascota?.nombre || `Mascota ID: ${id}`}</h2>

        {vacunas.length === 0 ? (
          <p>No hay vacunas registradas para esta mascota.</p>
        ) : (
          <table className="registro-vacunacion-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Edad</th>
                <th>Peso (kg)</th>
                <th>Vacuna <img src={iconoVacuna} alt="Vacuna" className="icono-header" /></th>
                <th>Próxima Visita</th>
              </tr>
            </thead>
            <tbody>
              {vacunas.map((vacuna) => (
                <tr key={vacuna.vacunacion_id}>
                  <td>{formatearFechaParaVisualizacion(vacuna.fecha_aplicacion)}</td>
                  <td>{vacuna.edad}</td>
                  <td>{vacuna.peso}</td>
                  <td>{vacuna.vacuna}</td>
                  <td>{formatearFechaParaVisualizacion(vacuna.proxima_visita)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="registro-buttons">
          <button className="btn-retroceder" onClick={() => navigate(-1)}>⬅ Volver</button>
          <button className="btn-imprimir" onClick={handlePrint}>🖨️ Imprimir</button>
        </div>
      </div>

      {/* Contenido específico para impresión - CARNET DOBLABLE */}
      <div className="print-content">
        {/* PORTADA - Primera mitad de la hoja A4 */}
        <div className="print-page-half portada">
          <div className="portada-header">
            <img src={logoVeterinaria} alt="Logo Veterinaria" className="logo-portada" />
            <h1>CARNET DE VACUNACIÓN</h1>
          </div>

          <div className="mascota-info">
            <div className="info-row">
              <strong>Nombre:</strong> <span>{mascota?.nombre || 'N/A'}</span>
            </div>
            <div className="info-row">
              <strong>Especie:</strong> <span>{mascota?.especie || 'N/A'}</span>
            </div>
            <div className="info-row">
              <strong>Raza:</strong> <span>{mascota?.raza || 'N/A'}</span>
            </div>
            <div className="info-row">
              <strong>Fecha de Nacimiento:</strong>
              <span>{mascota?.fecha_nacimiento ? formatearFechaParaVisualizacion(mascota.fecha_nacimiento) : 'N/A'}</span>
            </div>
            <div className="info-row">
              <strong>Sexo:</strong>
              <span>{mascota?.sexo || 'N/A'}</span>
            </div>
            <div className="info-row">
              <strong>Propietario:</strong> 
              <span>{obtenerNombrePropietario()}</span>
            </div>
          </div>

          <div className="portada-footer">
            <p>Este carnet certifica el estado de vacunación de la mascota</p>
            <p><em>Manténgalo en lugar seguro</em></p>
          </div>
        </div>

        {/* HISTORIAL - Segunda mitad de la hoja A4 */}
        <div className="print-page-half historial">
          <div className="historial-header">
            <h2>HISTORIAL DE VACUNACIÓN</h2>
            <img src={iconoVacuna} alt="Vacuna" className="icono-historial" />
          </div>

          {vacunas.length === 0 ? (
            <p className="no-vacunas">No hay vacunas registradas para esta mascota.</p>
          ) : (
            <table className="historial-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Edad</th>
                  <th>Peso (kg)</th>
                  <th>Vacuna</th>
                  <th>Próxima</th>
                </tr>
              </thead>
              <tbody>
                {vacunas.map((vacuna) => (
                  <tr key={vacuna.vacunacion_id}>
                    <td>{formatearFechaCorta(vacuna.fecha_aplicacion)}</td>
                    <td>{vacuna.edad}</td>
                    <td>{vacuna.peso}</td>
                    <td>{vacuna.vacuna}</td>
                    <td>{formatearFechaCorta(vacuna.proxima_visita)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="historial-footer">
            <p><small>Fecha de emisión: {new Date().toLocaleDateString()}</small></p>
          </div>
        </div>
      </div>
    </div>
  );
}