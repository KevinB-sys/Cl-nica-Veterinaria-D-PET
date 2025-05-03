import React, { useState } from "react";
import "../estilos css/profile.css";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaSave,
} from "react-icons/fa";

const UserProfile = () => {
  // Definir las fotos disponibles
  const fotos = [
    "https://i.pinimg.com/736x/d3/3c/06/d33c06ed8d607c70de9dc22b8c9b3830.jpg", // foto 1
    "https://static.vecteezy.com/system/resources/thumbnails/054/472/866/small_2x/cute-golden-puppy-waving-its-paw-happily-png.png", // foto 2
    "https://static.vecteezy.com/system/resources/thumbnails/058/042/348/small_2x/cute-puppy-waving-hello-with-a-friendly-expression-png.png", // foto 3
    "https://parrillagines.es/wp-content/uploads/2022/01/gatitos-tiernos-que-hablan.jpg", // foto 4
    "https://i.pinimg.com/originals/e0/19/17/e0191785c29396e42bccc19c6c3db098.jpg" // foto 5
  ];

  // Función para obtener una foto aleatoria
  const getRandomFoto = () => {
    return fotos[Math.floor(Math.random() * fotos.length)];
  };

  // Estado del usuario con la foto aleatoria
  const [usuario, setUsuario] = useState({
    nombre: "Perrito Pérez",
    correo: "ana.lopez@email.com",
    contraseña: "",
    telefono: "+593 987 654 321",
    whatsapp: "+593 987 654 321",
    direccion: "Av. Las Palmeras 123, Guayaquil",
    rol: "Cliente",
    foto: getRandomFoto(), // Foto aleatoria
  });

  // Manejar el cambio de los campos de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  // Guardar los cambios
  const handleGuardar = () => {
    console.log("Datos guardados:", usuario);
    alert("Cambios guardados exitosamente.");
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        {/* Mostrar foto aleatoria */}
        <img className="perfil-foto" src={usuario.foto} alt="Foto de perfil" />
        
        <div className="perfil-form">
          <label>
            <div className="label">
              Nombre:
            </div>
            <div className="input-icono">
              <FaUser />
              <input
                type="text"
                name="nombre"
                value={usuario.nombre}
                onChange={handleChange}
              />
            </div>
          </label>

          <label>
            <div className="label">
              Correo:
            </div>
            <div className="input-icono">
              <FaEnvelope />
              <input
                type="email"
                name="correo"
                value={usuario.correo}
                onChange={handleChange}
              />
            </div>
          </label>

          <label>
            <div className="label">
              Teléfono:
            </div>
            <div className="input-icono">
              <FaPhone />
              <input
                type="text"
                name="telefono"
                value={usuario.telefono}
                onChange={handleChange}
              />
            </div>
          </label>

          <label>
            <div className="label">
              WhatsApp:
            </div>
            <div className="input-icono">
              <FaWhatsapp />
              <input
                type="text"
                name="whatsapp"
                value={usuario.whatsapp}
                onChange={handleChange}
              />
            </div>
          </label>

          <label>
            <div className="label">
              Dirección:
            </div>
            <div className="input-icono">
              <FaMapMarkerAlt />
              <input
                type="text"
                name="direccion"
                value={usuario.direccion}
                onChange={handleChange}
              />
            </div>
          </label>

          <p className="perfil-rol"><strong>Rol:</strong> {usuario.rol}</p>

          <button className="btn-guardar" onClick={handleGuardar}>
            <FaSave style={{ marginRight: "8px" }} />
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
