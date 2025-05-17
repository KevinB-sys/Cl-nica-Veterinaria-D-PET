import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "../estilos css/reset.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleNewPasswordChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { length, uppercase, specialChar } = passwordValidation;
    if (!length || !uppercase || !specialChar) {
      Swal.fire({
        icon: "error",
        title: "Contraseña insegura",
        text: "La contraseña debe tener al menos 6 caracteres, una mayúscula y un carácter especial.",
        confirmButtonColor: '#2c2c6c'
      });
      return; // No continúa si la contraseña es insegura
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        confirmButtonColor: '#2c2c6c'
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada',
          text: 'Tu contraseña se ha restablecido correctamente.',
          confirmButtonColor: '#2c2c6c'
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.error || 'Error al restablecer la contraseña.',
          confirmButtonColor: '#2c2c6c'
        });
      }

    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor.',
        confirmButtonColor: '#2c2c6c'
      });
    }
  };

  return (
    <div className="reset_container">
      <div className="reset_title">
        <h2>Restablecer contraseña</h2>
        <p>Ingresa tu nueva contraseña</p>
      </div>

      <form className="reset_form" onSubmit={handleSubmit}>
        <div className="reset_group">
          <label htmlFor="newPassword">Nueva contraseña</label>
          <div className="password-wrapper">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
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

        <div className="reset_group">
          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button type="submit" className="reset_button">
          Restablecer contraseña
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;