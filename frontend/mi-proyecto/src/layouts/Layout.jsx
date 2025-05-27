// src/Layout.jsx (o como hayas llamado tu archivo de Layout)

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTopButton from '../components/Scroll';
import { Outlet } from 'react-router-dom'; // Asegúrate de que es de 'react-router-dom'
import Chatbot from '../components/Chatbot'; // Renombrado de Chatbot a ChatBotAgendar
import Floating from '../components/floating'; // ¡Importa el wrapper flotante!
import '../estilos css/App.css'; // Asegúrate de que esta ruta sea correcta

export default function Layout() {
  return (
    <div className="app-container">
      <Navbar />
      <Outlet />
      <ScrollToTopButton /> {/* Botón de scroll */}

      {/* ¡AQUÍ ESTÁ EL CAMBIO CLAVE! */}
      {/* Envuelve tu ChatBotAgendar (o Chatbot) con FloatingChatbotWrapper */}
      <Floating>
        <Chatbot />
      </Floating>

      <Footer />
    </div>
  );
}