import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../vercarnet.css';

const registros = [
  { id: 1, fecha: '2023-10-05', edad: '2 años', peso: '15kg', vacuna: 'Rabia', proxVisita: '2024-10-05', sello: 'Firma1' },
  { id: 2, fecha: '2023-11-10', edad: '3 años', peso: '20kg', vacuna: 'Parvovirus', proxVisita: '2024-11-10', sello: 'Firma2' },
  { id: 3, fecha: '2023-12-15', edad: '4 año', peso: '10kg', vacuna: 'Moquillo', proxVisita: '2024-12-15', sello: 'Firma3' }
];

export default function RegistroVacunacion() {
  const navigate = useNavigate();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="registro-vacunacion-container">
      <h2>Registro de Vacunación</h2>

      <table className="registro-vacunacion-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Edad</th>
            <th>Peso</th>
            <th>Vacuna</th>
            <th>Próxima Visita</th>
            <th>Sello (firma)</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <tr key={registro.id}>
              <td>{registro.fecha}</td>
              <td>{registro.edad}</td>
              <td>{registro.peso}</td>
              <td>{registro.vacuna}</td>
              <td>{registro.proxVisita}</td>
              <td>{registro.sello}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="registro-buttons">
        <button className="btn-retroceder" onClick={() => navigate(-1)}>⬅ Volver</button>
        <button className="btn-imprimir" onClick={handlePrint}>🖨️ Imprimir</button>
      </div>
    </div>
  );
}
