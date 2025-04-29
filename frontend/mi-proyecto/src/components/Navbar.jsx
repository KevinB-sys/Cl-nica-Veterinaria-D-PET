import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Info, Calendar, Syringe, LogIn, User, X } from "lucide-react";
import "../estilos css/navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

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

      {/* Navegación */}
      <nav className="nav">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          <Home size={18} /> INICIO
        </Link>
        <Link to="/About" className={location.pathname === "/About" ? "active" : ""}>
          <Info size={18} /> NOSOTROS
        </Link>
        <Link to="/Services" className={location.pathname === "/Services" ? "active" : ""}>
          <Calendar size={18} /> SERVICIOS
        </Link>
        <Link to="/Agendar" className={location.pathname === "/Agendar" ? "active" : ""}>
          <Calendar size={18} /> AGENDAR CITA
        </Link>
        <Link to="/ListarCarnet" className={location.pathname === "/ListarCarnet" ? "active" : ""}>
          <Syringe size={18} /> CARNETS DE VACUNACIÓN
        </Link>
        <Link to="/Login" className={location.pathname === "/Login" ? "active" : ""}>
          <LogIn size={18} /> INICIAR SESIÓN
        </Link>
      </nav>

      {/* Icono de usuario con Link */}
      <div className="user-menu">
        <User 
          size={24} 
          className="user-icon" 
          onClick={() => setIsUserModalOpen(true)} 
        />
      </div>

      {/* Modal flotante de usuario */}
      {isUserModalOpen && (
        <div className="user-modal-overlay" onClick={() => setIsUserModalOpen(false)}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setIsUserModalOpen(false)}>
              <X size={20} />
            </button>
            <h3>Menú de Usuario</h3>
            <Link to="/profile">Ver Perfil</Link>
            <button onClick={() => console.log("Cerrar sesión")}>Cerrar Sesión</button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
