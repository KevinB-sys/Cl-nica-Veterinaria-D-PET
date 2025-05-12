import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Info, Calendar, Syringe, LogIn, User, X, Menu } from "lucide-react";
import "../estilos css/navbar.css";
import Swal from "sweetalert2";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");


  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Función para manejar accesos restringidos
  const handleProtectedRoute = (e, path) => {
    if (!token) {
      e.preventDefault();
      Swal.fire({
        icon: 'warning',
        title: 'Acceso restringido',
        text: 'Por favor, inicie sesión para acceder a esta sección o contactanos por Whatsapp para más información.',
        confirmButtonText: 'Aceptar'
      });
    } else {
      toggleMenu();
      navigate(path);
    }
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

          <Link
            to="/Services"
            className={`nav-link ${location.pathname === "/Services" ? "active" : ""}`}
            onClick={(e) => handleProtectedRoute(e, "/Services")}
          >
            <Calendar size={16} /> SERVICIOS
          </Link>

          {/* Protegido: Agendar */}
          <Link
            to="/Agendar"
            className={`nav-link ${location.pathname === "/Agendar" ? "active" : ""}`}
            onClick={(e) => handleProtectedRoute(e, "/Agendar")}
          >
            <Calendar size={16} /> AGENDAR CITA
          </Link>

          {/* Protegido: Carnets */}
          <Link
            to="/ListarCarnet"
            className={`nav-link ${location.pathname === "/ListarCarnet" ? "active" : ""}`}
            onClick={(e) => handleProtectedRoute(e, "/ListarCarnet")}
          >
            <Syringe size={16} /> CARNETS
          </Link>

          {/* Autenticación */}
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
              className="nav-link"
              onClick={() => {
                
                Swal.fire({
                  title: '¿Desea cerrar sesión?',
                  text: 'No podrá acceder a todas las funciones de la aplicación',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Sí, cerrar sesión',
                  cancelButtonText: 'Cancelar'
                }).then((result) => {
                  if (result.isConfirmed) {
                    localStorage.removeItem("token"); // Elimina el token
                    Swal.fire({
                      icon: 'success',
                      title: 'Cierre exitoso',
                      text: 'Has cerrado sesión correctamente',
                      confirmButtonText: 'Aceptar'
                    }).then(() => {
                      window.location.reload();
                    });
                  }
                });;
              }}
            >
              <LogIn size={16} /> CERRAR SESIÓN
            </Link>
          )}
        </div>
      </nav>

      {/* Icono de usuario (acceso libre o protegido según tu lógica) */}
      <div className="user-menu">
        <Link to={token ? "/profile" : "#"} onClick={(e) => {
          if (!token) {
            e.preventDefault();
            Swal.fire({
              icon: 'info',
              title: 'Inicia sesión primero',
              text: 'Para acceder a tu perfil necesitas iniciar sesión',
            });
          }
        }}>
          <User size={24} className="user-icon" />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
