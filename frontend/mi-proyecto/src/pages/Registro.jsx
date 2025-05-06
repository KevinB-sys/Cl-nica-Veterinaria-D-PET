import React, { useState } from 'react';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaWhatsapp, FaHome } from 'react-icons/fa'; // Importamos los iconos
import '../estilos css/registro.css';
import { registerUser } from '../services/authService';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

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

    // Validar la contraseña antes de enviar
    const { length, uppercase, specialChar } = passwordValidation;
    if (!length || !uppercase || !specialChar) {
      Swal.fire({
        icon: "error",
        title: "Contraseña insegura",
        text: "La contraseña debe tener al menos 6 caracteres, una mayúscula y un carácter especial.",
      });
      return; // no continúa si la contraseña es insegura
    }

    // Validar WhatsApp
    const onlyNumbers = formData.whatsapp.replace(/[^0-9]/g, '');
    const localNumber = onlyNumbers.replace(/^593/, '');

    if (localNumber.length !== 9) {
      Swal.fire({
        icon: "error",
        title: "Número inválido",
        text: "El número de WhatsApp debe tener exactamente 9 dígitos (sin incluir el código de país)",
      });
      return;
    }

    try {
      const data = await registerUser(formData);
      console.log(data);
      if (data.state === "success") {
        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "Usuario creado correctamente",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "¡Correo invalido!",
          text: "El correo ya está registrado, debe ser único",
          timer: 2000,
          showConfirmButton: false,
        });
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
          <PhoneInput
            country={'ec'}
            value={formData.whatsapp}
            onChange={(phone) => {
              const numericPart = phone.replace(/[^0-9]/g, '');
              //const countryCode = phone.startsWith('+') ? phone.split(/[0-9]/)[0] : '';
              const numberOnly = numericPart.replace(/^593/, ''); // quita código de Ecuador para validar 9 dígitos

              if (numberOnly.length <= 9) {
                setFormData({ ...formData, whatsapp: phone });
              }
            }}
            inputProps={{
              name: 'whatsapp',
              required: true,
            }}
            masks={{ ec: '...-...-...' }}
            enableSearch
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