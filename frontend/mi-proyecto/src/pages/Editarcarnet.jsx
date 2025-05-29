import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../estilos css/Editarcarnet.css';
// Para guardar vacunas 
import { createvacuna } from "../services/vacunasService";

export default function RegistroVacunacionEditable() {
  const navigate = useNavigate();

  // Estado para los registros de vacunación
  const [registros, setRegistros] = useState([
    { id: 1, fecha: '2023-10-05', edad: '1 años', peso: '15', vacuna: 'Rabia', proxVisita: '2024-10-05' },
    { id: 2, fecha: '2023-11-10', edad: '2 años', peso: '20', vacuna: 'Parvovirus', proxVisita: '2024-11-10' },
    { id: 3, fecha: '2023-12-15', edad: '1 años', peso: '10', vacuna: 'Moquillo', proxVisita: '2024-12-15' }
  ]);

  // Función para agregar una nueva fila al registro
  // const handleAgregarFila = () => {
  //   setRegistros([...registros, { id: Date.now(), fecha: '', edad: '', peso: '', vacuna: '', proxVisita: '', sello: '' }]);
  // };

  // Función para manejar los cambios en los campos del registro
  const handleChange = (index, field, value) => {
    const nuevosRegistros = [...registros];
    nuevosRegistros[index][field] = value;
    setRegistros(nuevosRegistros);
  };

  // Función para manejar el guardar
  const handleGuardar = async () => {
    // Para cada registro, llamamos a la API para guardarlo
    try {
      for (const registro of registros) {
        const response = await createvacuna(registro);
        if (response.state === "error") {
          alert(`Error al guardar el registro: ${response.message}`);
        } else {
          alert("Registro guardado exitosamente");
        }
      }
      // Redirigir o realizar otras acciones después de guardar
      navigate('/ListarCarnet'); // Cambia la ruta de acuerdo a tu necesidad
    } catch (error) {
      console.error("Error al guardar registros", error);
      alert("Ocurrió un error al guardar los registros.");
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
              <td><input type="date" value={registro.fecha} onChange={(e) => handleChange(index, 'fecha', e.target.value)} /></td>
              <td><input type="text" value={registro.edad} onChange={(e) => handleChange(index, 'edad', e.target.value)} /></td>
              <td><input type="text" value={registro.peso} onChange={(e) => handleChange(index, 'peso', e.target.value)} /></td>
              <td><input type="text" value={registro.vacuna} onChange={(e) => handleChange(index, 'vacuna', e.target.value)} /></td>
              <td><input type="date" value={registro.proxVisita} onChange={(e) => handleChange(index, 'proxVisita', e.target.value)} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="registro-buttons">
        <button className="btn-retroceder" onClick={() => navigate(-1)}>⬅ Volver</button>
        <button className="btn-geditar" onClick={handleGuardar}>💾 Guardar</button>
      </div>
    </div>
  );
}
