import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../estilos css/Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Importamos los iconos
import Swal from "sweetalert2";
import { loginUser } from "../services/authService";
// import AuthContext from "../state/AuthContext.jsx";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState(""); // Estado para el email
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const navigate = useNavigate(); // Hook para redirigir
  // const {login } = useContext(AuthContext); // Obtener la función de login del contexto
  const [showPassword, setShowPassword] = useState(false);
  // Función para manejar el login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({ email, password }); // Llamar a la función de login
      console.log(data);

      if (data.state !== "success") {
        Swal.fire({
          icon: "error", // Cambié 'faild' por 'error'
          title: "Credenciales incorrectas",
          text: "Intente de nuevo",
        }); // Muestra el error si las credenciales son incorrectas
        return;
      }
      Swal.fire({
        icon: "success", // Ahora muestra un icono de éxito
        title: "¡Inicio de sesión exitoso!",
        text: "Bienvenido, redirigiendo al Inicio...",
        timer: 2000, // El mensaje se cierra automáticamente después de 2 segundos
        showConfirmButton: false, // No muestra el botón de confirmación
      });

      setTimeout(() => {
        navigate("/"); // Redirigir a la página principal
      }, 2000); // Espera 2 segundos antes de redirigir

    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error en el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image">
          <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8Hz0UUXxZm21BEiTgWaMMgmjHU0AKmWpwLck_ucBy2J0a2MlNaZbEeQ74sc_2-zxiqEPp3wpx43jHoEqKCWbbuwSXwSv3ihs9R2fSSh5K7-5nWVYtT6gSPG30_9qUoAZeFld2uCRcGiRmh8UD5QUH_jEzOGDncZluQbi6pnmYdjVDZIM0vmHDhetO0xE/s320/logo.png" alt="Login" />
        </div>
        <div className="login-form">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>
                <FaEnvelope className="input-icon-login" /> Email
              </label>
              <input
                type="text"
                placeholder="Ingrese su email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>
                <FaLock className="input-icon-login" /> Contraseña
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button type="submit" className="login-button">Ingresar</button>
          </form>
          <p className="register-text">
            ¿No tienes una cuenta? <Link to="/Registro">Crear cuenta</Link>
          </p>
          <p className="register-password">
          <Link to="/Recuperacion">¿Olvidó su contraseña</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
