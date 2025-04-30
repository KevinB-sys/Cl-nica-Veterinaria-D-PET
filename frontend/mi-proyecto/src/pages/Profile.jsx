import React from "react";
import "../estilos css/profile.css";

const UserProfile = () => {
  const usuario = {
    nombre: "Perrito Pérez",
    correo: "ana.lopez@email.com",
    telefono: "+593 987 654 321",
    direccion: "Av. Las Palmeras 123, Guayquil",
    rol: "Cliente",
    foto: "https://i.pinimg.com/736x/d3/3c/06/d33c06ed8d607c70de9dc22b8c9b3830.jpg",
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <img className="perfil-foto" src={usuario.foto} alt="Foto de perfil" />
        <h2 className="perfil-nombre">{usuario.nombre}</h2>
        <p className="perfil-rol">{usuario.rol}</p>
        <div className="perfil-info">
          <p><strong>Correo:</strong> {usuario.correo}</p>
          <p><strong>Teléfono:</strong> {usuario.telefono}</p>
          <p><strong>Dirección:</strong> {usuario.direccion}</p>
        </div>
        <div className="perfil-acciones">
          <button className="btn-editar">Editar Perfil</button>
          <button className="btn-cerrar">Cerrar Sesión</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
