import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../estilos css/Editarcarnet.css';
import { createvacuna } from "../services/vacunasService";
import Swal from "sweetalert2"; // Asegúrate de que esto esté importado

export default function RegistroVacunacionEditable() {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtén el ID de la URL

  // Estado inicial de registros existentes
  const registrosIniciales = [
    // { id: 1, fecha: '2023-10-05', edad: '1 años', peso: '15', vacuna: 'Rabia', proxVisita: '2024-10-05' },
    // { id: 2, fecha: '2023-11-10', edad: '2 años', peso: '20', vacuna: 'Parvovirus', proxVisita: '2024-11-10' },
    // { id: 3, fecha: '2023-12-15', edad: '1 años', peso: '10', vacuna: 'Moquillo', proxVisita: '2024-12-15' }
  ];

  const [registros, setRegistros] = useState(registrosIniciales);

  // --- MODIFICACIÓN AQUÍ ---
  useEffect(() => {
    if (id) {
      console.log("ID de la mascota desde la URL:", id);

      // Muestra un SweetAlert2 con el ID de la mascota
      Swal.fire({
        icon: "info",
        title: "Carnet de Vacunación",
        text: `Estás editando o creando el carnet de vacunación para la Mascota ID: ${id}`,
        confirmButtonText: "Entendido",
        timer: 3500, // Se cierra automáticamente después de 3.5 segundos
        timerProgressBar: true,
      });

      // Aquí podrías cargar datos de vacunación existentes para esa mascota si fuera necesario
    } else {
      // Si el ID no se encuentra en la URL, puedes mostrar una advertencia
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "No se encontró un ID de mascota en la URL. Asegúrate de que la ruta esté bien definida.",
        confirmButtonText: "Cerrar",
      });
      console.error("No se pudo obtener el ID de la mascota de la URL.");
    }
  }, [id]); // El efecto se ejecuta cuando 'id' cambia

  // --- FIN DE LA MODIFICACIÓN ---

  // Función para obtener la fecha actual en formato YYYY-MM-DD
  const obtenerFechaActual = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };

  // Función para agregar una nueva fila al registro
  const handleAgregarFila = () => {
    setRegistros([
      ...registros,
      { id: Date.now(), fecha: obtenerFechaActual(), edad: '', peso: '', vacuna: '', proxVisita: '' }
    ]);
  };

  // Función para manejar los cambios en los campos del registro
  const handleChange = (index, field, value) => {
    const nuevosRegistros = [...registros];
    nuevosRegistros[index][field] = value;
    setRegistros(nuevosRegistros);
  };

  // Función para manejar el guardar solo de las nuevas filas
  const handleGuardar = async () => {
    try {
      // Filtrar solo las filas nuevas (que no están en registrosIniciales)
      const registrosNuevos = registros.filter(registro =>
        !registrosIniciales.some(reg => reg.id === registro.id)
      );

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

      // Añade una verificación antes de iterar
      if (!id || isNaN(parseInt(id))) {
          Swal.fire({
              icon: "error",
              title: "Error de Mascota ID",
              text: "No se pudo obtener un ID de mascota válido de la URL. Por favor, recarga la página o revisa la URL.",
              timer: 3500,
              showConfirmButton: false
          });
          return; // Detener la ejecución si el ID es inválido
      }

      for (const registro of registrosNuevos) {
        // Asegúrate de enviar el mascota_id con cada registro
        const dataToSend = {
          ...registro,
          mascota_id: parseInt(id) // Convertir el ID a entero
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
        } else {
          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: "Registro guardado exitosamente",
            timer: 2500,
            showConfirmButton: false
          });
        }
      }

      navigate('/ListarCarnet'); // Redirigir después de guardar

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

  return (
    <div className="registro-vacunacion-container">
      <h2>Registro de Vacunación</h2>

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
          {registros.map((registro, index) => (
            <tr key={registro.id}>
              <td>
                <input
                  type="date"
                  value={registro.fecha}
                  readOnly={registrosIniciales.some(reg => reg.id === registro.id)}
                  onChange={(e) => handleChange(index, 'fecha', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={registro.edad}
                  onChange={(e) => handleChange(index, 'edad', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={registro.peso}
                  onChange={(e) => handleChange(index, 'peso', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={registro.vacuna}
                  onChange={(e) => handleChange(index, 'vacuna', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="date"
                  value={registro.proxVisita}
                  onChange={(e) => handleChange(index, 'proxVisita', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="registro-buttons">
        <button className="btn-retroceder" onClick={() => navigate(-1)}>⬅ Volver</button>
        <button className="btn-agregar" onClick={handleAgregarFila}>➕ Agregar Fila</button>
        <button className="btn-geditar" onClick={handleGuardar}>💾 Guardar</button>
      </div>
    </div>
  );
}