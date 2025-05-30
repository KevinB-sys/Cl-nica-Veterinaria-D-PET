import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../estilos css/Editarcarnet.css';
import { createvacuna, getVacunasByMascota } from "../services/vacunasService";
import Swal from "sweetalert2";

export default function RegistroVacunacionEditable() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [vacunasExistentes, setVacunasExistentes] = useState([]);
  const [registrosNuevos, setRegistrosNuevos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVacunasExistentes = async () => {
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

      setLoading(true);
      setError(null);

      const result = await getVacunasByMascota(id);

      if (result.state === "success") {
        setVacunasExistentes(result.data);
      } else {
        setError(result.message);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar',
          text: result.message || 'Ocurrió un error desconocido al cargar las vacunas existentes.',
          confirmButtonText: 'Cerrar'
        });
      }
      setLoading(false);
    };

    fetchVacunasExistentes();
  }, [id]);

  const obtenerFechaActual = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  const handleAgregarFila = () => {
    setRegistrosNuevos([
      ...registrosNuevos,
      { id: Date.now(), fecha: obtenerFechaActual(), edad: '', peso: '', vacuna: '', proxVisita: '' }
    ]);
  };

  const handleChange = (index, field, value) => {
    const updatedRegistrosNuevos = [...registrosNuevos];

    if (field === 'peso') {
      const pesoValue = parseInt(value, 10);
      if (isNaN(pesoValue) || pesoValue <= 0) {
        Swal.fire({
          icon: "error",
          title: "Error de entrada",
          text: "El peso debe ser un número positivo.",
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }
      updatedRegistrosNuevos[index][field] = pesoValue;
    } else if (field === 'proxVisita') {
      const fechaActual = obtenerFechaActual();
      if (value && value < fechaActual) {
        Swal.fire({
          icon: "error",
          title: "Error de fecha",
          text: "La próxima visita no puede ser una fecha anterior a la actual.",
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }
      updatedRegistrosNuevos[index][field] = value;
    } else {
      updatedRegistrosNuevos[index][field] = value;
    }
    setRegistrosNuevos(updatedRegistrosNuevos);
  };

  const handleGuardar = async () => {
    if (registrosNuevos.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Sin cambios",
        text: "No hay nuevos registros para guardar.",
        timer: 2500,
        showConfirmButton: false
      });
      return;
    }

    if (!id || isNaN(parseInt(id))) {
      Swal.fire({
        icon: "error",
        title: "Error de Mascota ID",
        text: "No se pudo obtener un ID de mascota válido de la URL. Por favor, recarga la página o revisa la URL.",
        timer: 3500,
        showConfirmButton: false
      });
      return;
    }

    try {
      for (const registro of registrosNuevos) {
        if (registro.peso === '' || isNaN(registro.peso) || parseInt(registro.peso) <= 0) {
          Swal.fire({
            icon: "error",
            title: "Error de validación",
            text: "El peso debe ser un número positivo y no puede estar vacío.",
            timer: 2500,
            showConfirmButton: false
          });
          return;
        }
        if (registro.proxVisita && registro.proxVisita < obtenerFechaActual()) {
          Swal.fire({
            icon: "error",
            title: "Error de validación",
            text: "La próxima visita no puede ser una fecha anterior a la actual.",
            timer: 2500,
            showConfirmButton: false
          });
          return;
        }
        if (!registro.edad || !registro.vacuna) {
          Swal.fire({
            icon: "error",
            title: "Campos incompletos",
            text: "Por favor, completa los campos de 'Edad en años' y 'Vacuna'.",
            timer: 2500,
            showConfirmButton: false
          });
          return;
        }

        const dataToSend = {
          ...registro,
          mascota_id: parseInt(id)
        };
        const response = await createvacuna(dataToSend);
        if (response.state === "error") {
          Swal.fire({
            icon: "error",
            title: "Error al guardar",
            text: response.message,
            timer: 2500,
            showConfirmButton: false
          });
          return;
        }
      }

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Registros guardados exitosamente",
        timer: 2500,
        showConfirmButton: false
      });

      setRegistrosNuevos([]);
      const result = await getVacunasByMascota(id);
      if (result.state === "success") {
        setVacunasExistentes(result.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al recargar',
          text: 'Se guardaron las vacunas, pero hubo un error al recargar la lista: ' + result.message,
          confirmButtonText: 'Cerrar'
        });
      }

    } catch (error) {
      console.error("Error al guardar registros", error);
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "Ocurrió un error al guardar los registros.",
        timer: 2500,
        showConfirmButton: false
      });
    }
  };

  if (loading) {
    return (
      <div className="registro-vacunacion-container">
        <p>Cargando carnet de vacunación...</p>
      </div>
    );
  }

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
      <h2>Carnet de Vacunación de Mascota ID: {id}</h2>

      <h3>Vacunas Existentes</h3>
      {vacunasExistentes.length === 0 ? (
        <p>No hay vacunas registradas para esta mascota. Puedes añadir una nueva.</p>
      ) : (
        <table className="registro-vacunacion-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Edad</th>
              <th>Peso (Kg)</th>
              <th>Vacuna</th>
              <th>Próxima Visita</th>
              <th>Acciones</th> {/* Nueva columna para acciones */}
            </tr>
          </thead>
          <tbody>
            {vacunasExistentes.map((vacuna) => (
              <tr key={vacuna.vacunacion_id}>
                <td>{new Date(vacuna.fecha_aplicacion).toLocaleDateString()}</td>
                <td>{vacuna.edad}</td>
                <td>{vacuna.peso}</td>
                <td>{vacuna.vacuna}</td>
                <td>{new Date(vacuna.proxima_visita).toLocaleDateString()}</td>
                <td>
                  {/* Botones de acción (funcionalidad a implementar más adelante) */}
                  <button
                    className="btn-accion btn-editar"
                    onClick={() => {
                      // Puedes agregar un Swal aquí para indicar que la función está en desarrollo
                      Swal.fire({
                        icon: 'info',
                        title: 'En desarrollo',
                        text: 'La funcionalidad de editar se implementará más adelante.',
                        timer: 1500,
                        showConfirmButton: false
                      });
                      console.log('Editar vacuna:', vacuna.vacunacion_id);
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn-accion btn-eliminar"
                    onClick={() => {
                      // Puedes agregar un Swal aquí para indicar que la función está en desarrollo
                      Swal.fire({
                        icon: 'info',
                        title: 'En desarrollo',
                        text: 'La funcionalidad de eliminar se implementará más adelante.',
                        timer: 1500,
                        showConfirmButton: false
                      });
                      console.log('Eliminar vacuna:', vacuna.vacunacion_id);
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Añadir Nuevas Vacunas</h3>
      <table className="registro-vacunacion-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Edad en años</th>
            <th>Peso (Kg)</th>
            <th>Vacuna</th>
            <th>Próxima Visita</th>
          </tr>
        </thead>
        <tbody>
          {registrosNuevos.map((registro, index) => (
            <tr key={registro.id}>
              <td>
                <input
                  type="date"
                  value={registro.fecha}
                  readOnly
                  onChange={(e) => handleChange(index, 'fecha', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={registro.edad}
                  onChange={(e) => handleChange(index, 'edad', e.target.value)}
                  placeholder="Ej: 1 año"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={registro.peso}
                  onChange={(e) => handleChange(index, 'peso', e.target.value)}
                  min="1"
                  placeholder="Ej: 15"
                />
              </td>
              <td>
                <input
                  type="text"
                  value={registro.vacuna}
                  onChange={(e) => handleChange(index, 'vacuna', e.target.value)}
                  placeholder="Ej: Rabia"
                />
              </td>
              <td>
                <input
                  type="date"
                  value={registro.proxVisita}
                  onChange={(e) => handleChange(index, 'proxVisita', e.target.value)}
                  min={obtenerFechaActual()}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="registro-buttons">
        <button className="btn-retroceder" onClick={() => navigate(-1)}>⬅ Volver</button>
        <button className="btn-agregar" onClick={handleAgregarFila}>➕ Añadir</button>
        <button className="btn-geditar" onClick={handleGuardar}>💾 Guardar</button>
      </div>
    </div>
  );
}