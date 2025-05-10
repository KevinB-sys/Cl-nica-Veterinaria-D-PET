import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Info, Calendar, Syringe, LogIn, User, X, Menu } from "lucide-react";
import "../estilos css/navbar.css";
import Swal from "sweetalert2"; // Importa SweetAlert2

const token = localStorage.getItem("token");
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // <-- NUEVO

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo-container" onClick={() => navigate("/")}>
        <img
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8Hz0UUXxZm21BEiTgWaMMgmjHU0AKmWpwLck_ucBy2J0a2MlNaZbEeQ74sc_2-zxiqEPp3wpx43jHoEqKCWbbuwSXwSv3ihs9R2fSSh5K7-5nWVYtT6gSPG30_9qUoAZeFld2uCRcGiRmh8UD5QUH_jEzOGDncZluQbi6pnmYdjVDZIM0vmHDhetO0xE/s320/logo.png"
          alt="Logo"
          className="logo"
        />
        <span className="logo-text">D'PET</span>
      </div>

      {/* Botón hamburguesa */}
      <button className="hamburger" onClick={toggleMenu}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menú de navegación */}
      <nav className={`nav-container ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="nav">
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`} onClick={toggleMenu}>
            <Home size={16} /> INICIO
          </Link>
          <Link to="/About" className={`nav-link ${location.pathname === "/About" ? "active" : ""}`} onClick={toggleMenu}>
            <Info size={16} /> NOSOTROS
          </Link>
          <Link to="/Services" className={`nav-link ${location.pathname === "/Services" ? "active" : ""}`} onClick={toggleMenu}>
            <Calendar size={16} /> SERVICIOS
          </Link>
          <Link to="/Agendar" className={`nav-link ${location.pathname === "/Agendar" ? "active" : ""}`} onClick={toggleMenu}>
            <Calendar size={16} /> AGENDAR CITA
          </Link>
          <Link to="/ListarCarnet" className={`nav-link ${location.pathname === "/ListarCarnet" ? "active" : ""}`} onClick={toggleMenu}>
            <Syringe size={16} /> CARNETS
          </Link>
          {!token ? (
            <Link
              to="/Login"
              className={`nav-link ${location.pathname === "/Login" ? "active" : ""}`}
              onClick={toggleMenu}
            >
              <LogIn size={16} /> INICIAR SESIÓN
            </Link>
          ) : (
            <Link
              to="/"
              className={`nav-link ${location.pathname === "/login" ? "active" : ""}`}
              onClick={() => {
                localStorage.removeItem("token"); // Elimina el token
                Swal.fire({
                  icon: 'success',
                  title: 'Cierre exitoso',
                  text: 'Has cerrado sesión correctamente',
                  confirmButtonText: 'Aceptar'
                }).then(() => {
                  // Recarga la página después de mostrar la alerta
                  window.location.reload();
                });
              }}
            >
              <LogIn size={16} /> CERRAR SESIÓN
            </Link>
          )}
        </div>
      </nav>

      {/* Icono de usuario */}
      <div className="user-menu">
        <Link to="/profile">
          <User
            size={24}
            className="user-icon"
          />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
