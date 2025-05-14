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
  //Para validar un couldant 
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(30); // en segundos
  // Función para manejar el login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) {
      Swal.fire({
        icon: "warning",
        title: "Demasiados intentos",
        text: `Espere ${lockTime} segundos para volver a intentar.`,
      });
      return;
    }

    try {
      const data = await loginUser({ email, password });

      if (data.state !== "success") {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= 4) {
          setIsLocked(true);
          Swal.fire({
            icon: "error",
            title: "Demasiados intentos fallidos",
            text: `Espere ${lockTime} segundos para intentar de nuevo.`,
          });

          // Temporizador para desbloquear
          let remaining = lockTime;
          const interval = setInterval(() => {
            remaining--;
            setLockTime(remaining);

            if (remaining <= 0) {
              clearInterval(interval);
              setIsLocked(false);
              setLoginAttempts(0);
              setLockTime(30); // reiniciar tiempo de espera
            }
          }, 1000);

          return;
        }

        Swal.fire({
          icon: "error",
          title: "Credenciales incorrectas",
          text: `Intento ${newAttempts} de 4`,
        });

        return;
      }

      // Login exitoso
      localStorage.setItem("token", data.token);
      Swal.fire({
        icon: "success",
        title: "¡Inicio de sesión exitoso!",
        text: "Bienvenido, redirigiendo al Inicio...",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 2000);

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
            <Link to="/Recuperacion">¿Olvidó su contraseña?</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
