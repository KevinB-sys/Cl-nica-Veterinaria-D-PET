import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Info, Calendar, Syringe, LogIn, User, X } from "lucide-react";
import "../estilos css/navbar.css";
import ReactModal from "react-modal";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  return (
    <header className="header">
      {/* Logo - izquierda */}
      <div className="logo-container" onClick={() => navigate("/")}>
        <img
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8Hz0UUXxZm21BEiTgWaMMgmjHU0AKmWpwLck_ucBy2J0a2MlNaZbEeQ74sc_2-zxiqEPp3wpx43jHoEqKCWbbuwSXwSv3ihs9R2fSSh5K7-5nWVYtT6gSPG30_9qUoAZeFld2uCRcGiRmh8UD5QUH_jEzOGDncZluQbi6pnmYdjVDZIM0vmHDhetO0xE/s320/logo.png"
          alt="Logo"
          className="logo"
        />
        <span className="logo-text">D'PET</span>
      </div>

      {/* Navegación - centro */}
      <nav className="nav-container">
        <div className="nav">
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
            <Home size={16} /> INICIO
          </Link>
          <Link to="/About" className={`nav-link ${location.pathname === "/About" ? "active" : ""}`}>
            <Info size={16} /> NOSOTROS
          </Link>
          <Link to="/Services" className={`nav-link ${location.pathname === "/Services" ? "active" : ""}`}>
            <Calendar size={16} /> SERVICIOS
          </Link>
          <Link to="/Agendar" className={`nav-link ${location.pathname === "/Agendar" ? "active" : ""}`}>
            <Calendar size={16} /> AGENDAR CITA
          </Link>
          <Link to="/ListarCarnet" className={`nav-link ${location.pathname === "/ListarCarnet" ? "active" : ""}`}>
            <Syringe size={16} /> CARNETS
          </Link>
          <Link to="/Login" className={`nav-link ${location.pathname === "/Login" ? "active" : ""}`}>
            <LogIn size={16} /> INICIAR SESIÓN
          </Link>
        </div>
      </nav>

      {/* Icono de usuario - derecha */}
      <div className="user-menu">
        <User 
          size={24} 
          className="user-icon" 
          onClick={() => setIsUserModalOpen(true)} 
        />
      </div>
      
      {/* Modal del usuario */}
      <ReactModal
        isOpen={isUserModalOpen}
        onRequestClose={() => setIsUserModalOpen(false)}
        className="custom-modal-top-right"
        overlayClassName="custom-overlay-transparent"
        shouldCloseOnOverlayClick={true}
        ariaHideApp={false}
      >
        <button className="close-btn" onClick={() => setIsUserModalOpen(false)}>
          <X size={20} />
        </button>
        <h3>Menú de Usuario</h3>
        <div className="button-row">
          <Link to="/profile" className="modal-button">Ver Perfil</Link>
          <button className="modal-button" onClick={() => console.log("Cerrar sesión")}>Cerrar Sesión</button>
        </div>
      </ReactModal>
    </header>
  );
};

export default Navbar;