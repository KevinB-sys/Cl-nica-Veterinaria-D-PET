// src/components/FloatingChatbotWrapper/FloatingChatbotWrapper.jsx
import React, { useState } from 'react';

const FloatingChatbotWrapper = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Define tu color principal y el color para el hover
  const primaryColor = '#2c2c6c';
  const hoverColor = '#1f1f4f'; // Un tono un poco más oscuro para el hover

  return (
    <>
      {/* 1. EL BOTÓN FLOTANTE */}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed', // Lo fija en la pantalla
          bottom: '100px',    // Distancia desde abajo
          right: '30px',     // Distancia desde la derecha
          zIndex: 1001,      // Asegura que esté por encima de casi todo
          width: '50px',
          height: '50px',
          borderRadius: '50%', // Lo hace circular
          backgroundColor: primaryColor, // ¡Cambiado aquí al nuevo color!
          color: 'white',
          fontSize: '22px', // Tamaño del icono
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)', // Sombra para que destaque
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.3s ease, transform 0.3s ease', // Suaviza hover y click
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = hoverColor} // ¡Cambiado aquí para el hover!
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryColor} // ¡Cambiado aquí para el hover!
        aria-label={isOpen ? "Cerrar chatbot" : "Abrir chatbot"} // Accesibilidad
      >
        {isOpen ? '✖' : '💬'} {/* Cambia el icono según el estado */}
      </button>

      {/* 2. EL CONTENEDOR DEL CHATBOT QUE APARECE/DESAPARECE */}
      <div className='floating-wrapper'
        style={{
          position: 'fixed', // También fijo en la pantalla
          bottom: isOpen ? '20px' : '-550px', // Animación de aparición/desaparición
          right: '30px',
          zIndex: 1000, // Menor que el botón para que el botón esté encima del chat
          width: '370px', // Ancho del contenedor del chat
          height: '500px', // Altura del contenedor del chat
          backgroundColor: 'white', // El fondo del chat sigue siendo blanco
          borderRadius: '12px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.25)', // Sombra más pronunciada
          overflow: 'hidden', // Oculta cualquier desborde del contenido interno
          transition: 'bottom 0.4s ease-in-out, opacity 0.4s ease-in-out, visibility 0.4s', // Transiciones suaves
          display: 'flex',
          flexDirection: 'column',
          // Oculta completamente cuando no está abierto para mejorar rendimiento y accesibilidad
          visibility: isOpen ? 'visible' : 'hidden',
          opacity: isOpen ? 1 : 0,
        }}
      >
        {children} {/* Aquí es donde se renderizará tu ChatBotAgendar */}
      </div>
    </>
  );
};

export default FloatingChatbotWrapper;