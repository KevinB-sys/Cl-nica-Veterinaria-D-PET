import React, { useState } from 'react';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaWhatsapp, FaHome } from 'react-icons/fa'; // Importamos los iconos
import '../estilos css/registro.css';
import { registerUser } from '../services/authService';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    whatsapp: '',
    direccion: ''
  });


  const navigate = useNavigate();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      validatePassword(value);
    }
  };
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
  });
  const validatePassword = (password) => {
    const length = password.length >= 6;
    const uppercase = /[A-Z]/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordValidation({ length, uppercase, specialChar });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await registerUser(formData);
      console.log(data);
      if (data.state === "success") {
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "Usuario creado correctamente",
          timer: 2000, // El mensaje se cierra automáticamente después de 2 segundos
          showConfirmButton: false, // No muestra el botón de confirmación
        });
        navigate("/login"); // Redirigir al login después del registro
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert("Hubo un error al registrar el usuario");
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <div className='logo-register'>
        <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjW_u11YZ1rXI7Qoaz4qq9MrEYztERVAjjsxD60s2BYlvRu91RMazKQy2A1e9MhSHzCm39srvSnoR4e3FErUNkXJiEN9vLfG40BC6wuXIBjxkNYUX9MS6qD_X8A2d6PYuUPkF5q7pDw-cwtrhtPVIawnSeaFr3xS6mkcEz_3iAlWzX79SBQa3jznjNkQR4/s320/veterinaria%20logo%20y%20letras%20%20png%20(1).png" alt="Logo" />
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <FaUser className="input-icon" /> Nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <FaEnvelope className="input-icon" /> Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <FaLock className="input-icon" /> Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <ul className="password-checklist">
            <li className={passwordValidation.length ? "valid" : "invalid"}>
              Mínimo 6 caracteres
            </li>
            <li className={passwordValidation.uppercase ? "valid" : "invalid"}>
              Al menos una letra mayúscula
            </li>
            <li className={passwordValidation.specialChar ? "valid" : "invalid"}>
              Al menos un carácter especial (!@#$%)
            </li>
          </ul>
        </div>
        <div className="form-group">
          <label>
            <FaPhone className="input-icon" /> Teléfono Casa
          </label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>
            <FaWhatsapp className="input-icon" /> Whatsapp
          </label>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>
            <FaHome className="input-icon" /> Dirección
          </label>
          <input
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="registro-btn">Crear Cuenta</button>
      </form>
    </div>
  );
};

export default RegisterForm;