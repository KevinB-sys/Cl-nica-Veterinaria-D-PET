import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../estilos css/Editarcarnet.css';
import { createvacuna, getVacunasByMascota, updateVacuna, deleteVacuna } from "../services/vacunasService";
import Swal from "sweetalert2";

export default function RegistroVacunacionEditable() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [vacunasExistentes, setVacunasExistentes] = useState([]);
  const [registrosNuevos, setRegistrosNuevos] = useState([]);
  const [vacunaEditando, setVacunaEditando] = useState(null);
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

  const formatearFechaParaInput = (fecha) => {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
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

  const handleEditarVacuna = (vacuna) => {
    setVacunaEditando({
      ...vacuna,
      fecha_aplicacion: formatearFechaParaInput(vacuna.fecha_aplicacion),
      proxima_visita: formatearFechaParaInput(vacuna.proxima_visita)
    });
  };

  const handleCambioEdicion = (field, value) => {
    if (field === 'peso') {
      const pesoValue = parseInt(value, 10);
      if (value !== '' && (isNaN(pesoValue) || pesoValue <= 0)) {
        Swal.fire({
          icon: "error",
          title: "Error de entrada",
          text: "El peso debe ser un número positivo.",
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }
      setVacunaEditando(prev => ({ ...prev, [field]: pesoValue || '' }));
    } else if (field === 'proxima_visita') {
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
      setVacunaEditando(prev => ({ ...prev, [field]: value }));
    } else {
      setVacunaEditando(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleGuardarEdicion = async () => {
    if (!vacunaEditando) return;

    // Validaciones
    if (!vacunaEditando.edad || !vacunaEditando.vacuna) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor, completa los campos de 'Edad en años' y 'Vacuna'.",
        timer: 2500,
        showConfirmButton: false
      });
      return;
    }

    if (vacunaEditando.peso === '' || isNaN(vacunaEditando.peso) || parseInt(vacunaEditando.peso) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: "El peso debe ser un número positivo y no puede estar vacío.",
        timer: 2500,
        showConfirmButton: false
      });
      return;
    }

    if (vacunaEditando.proxima_visita && vacunaEditando.proxima_visita < obtenerFechaActual()) {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: "La próxima visita no puede ser una fecha anterior a la actual.",
        timer: 2500,
        showConfirmButton: false
      });
      return;
    }

    try {
      const dataToUpdate = {
        fecha: vacunaEditando.fecha_aplicacion,
        edad: vacunaEditando.edad,
        peso: parseInt(vacunaEditando.peso),
        vacuna: vacunaEditando.vacuna,
        proxVisita: vacunaEditando.proxima_visita,
        mascota_id: parseInt(id)
      };

      const response = await updateVacuna(vacunaEditando.vacunacion_id, dataToUpdate);
      
      if (response.state === "error") {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: response.message,
          timer: 2500,
          showConfirmButton: false
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Vacuna actualizada exitosamente",
        timer: 2500,
        showConfirmButton: false
      });

      setVacunaEditando(null);
      
      // Recargar las vacunas existentes
      const result = await getVacunasByMascota(id);
      if (result.state === "success") {
        setVacunasExistentes(result.data);
      }

    } catch (error) {
      console.error("Error al actualizar vacuna", error);
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "Ocurrió un error al actualizar la vacuna.",
        timer: 2500,
        showConfirmButton: false
      });
    }
  };

  const handleEliminarVacuna = async (vacunacionId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteVacuna(vacunacionId);
        
        if (response.state === "error") {
          Swal.fire({
            icon: "error",
            title: "Error al eliminar",
            text: response.message,
            timer: 2500,
            showConfirmButton: false
          });
          return;
        }

        Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "La vacuna ha sido eliminada exitosamente",
          timer: 2500,
          showConfirmButton: false
        });

        // Recargar las vacunas existentes
        const result = await getVacunasByMascota(id);
        if (result.state === "success") {
          setVacunasExistentes(result.data);
        }

      } catch (error) {
        console.error("Error al eliminar vacuna", error);
        Swal.fire({
          icon: "error",
          title: "Error inesperado",
          text: "Ocurrió un error al eliminar la vacuna.",
          timer: 2500,
          showConfirmButton: false
        });
      }
    }
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
      <h2>Administrar registro de vacunas</h2>
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vacunasExistentes.map((vacuna) => (
              <tr key={vacuna.vacunacion_id}>
                {vacunaEditando && vacunaEditando.vacunacion_id === vacuna.vacunacion_id ? (
                  // Modo edición
                  <>
                    <td>
                      <input
                        type="date"
                        value={vacunaEditando.fecha_aplicacion}
                        onChange={(e) => handleCambioEdicion('fecha_aplicacion', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={vacunaEditando.edad}
                        onChange={(e) => handleCambioEdicion('edad', e.target.value)}
                        placeholder="Ej: 1 año"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={vacunaEditando.peso}
                        onChange={(e) => handleCambioEdicion('peso', e.target.value)}
                        min="1"
                        placeholder="Ej: 15"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={vacunaEditando.vacuna}
                        onChange={(e) => handleCambioEdicion('vacuna', e.target.value)}
                        placeholder="Ej: Rabia"
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={vacunaEditando.proxima_visita}
                        onChange={(e) => handleCambioEdicion('proxima_visita', e.target.value)}
                        min={obtenerFechaActual()}
                      />
                    </td>
                    <td>
                      <button
                        className="btn-accion btn-guardar"
                        onClick={handleGuardarEdicion}
                      >
                        Guardar
                      </button>
                      <br />
                      <br />
                      <button
                        className="btn-accion btn-cancelar"
                        onClick={() => setVacunaEditando(null)}
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  // Modo visualización
                  <>
                    <td>{new Date(vacuna.fecha_aplicacion).toLocaleDateString()}</td>
                    <td>{vacuna.edad}</td>
                    <td>{vacuna.peso}</td>
                    <td>{vacuna.vacuna}</td>
                    <td>{new Date(vacuna.proxima_visita).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-accion btn-editar"
                        onClick={() => handleEditarVacuna(vacuna)}
                        disabled={vacunaEditando !== null}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn-accion btn-eliminar"
                        onClick={() => handleEliminarVacuna(vacuna.vacunacion_id)}
                        disabled={vacunaEditando !== null}
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}