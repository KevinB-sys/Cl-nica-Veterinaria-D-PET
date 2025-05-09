import React from 'react';
import { useNavigate } from "react-router-dom";
import '../estilos css/App.css';
import { FaPhone, FaWhatsapp } from "react-icons/fa";

const HomeContent = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("Login"); // Cambia "/contacto" por la ruta correcta
  };
  // const handleAppClick = () => {
  //   const phoneNumber = "593980498038"; // Número en formato internacional sin "+"
  //   const message = "Hola, me gustaria agendar una cita en la vetrinaria.";
  //   const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
  //   window.open(url, "_blank");
  // };
  const handleAppClick = () => {
    const phoneNumber = "593980498038";
    const message = "Hola, me gustaria agendar una cita en la vetrinaria.";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      // Abre la app de WhatsApp en móvil
      window.location.href = url;
    } else {
      // Abre WhatsApp Web en PC
      window.open(url, "_blank");
    }
  };

  return (
    <main className="main-content">
      <section className="hero-section">
        <h1 className='titulogen'>BIENVENIDO A D'PET</h1>
        <p>Porque la salud de los que amas está en buenas manos</p>
        <button className="cta-btn" onClick={handleContactClick}>
          <FaPhone /> Contáctanos
        </button>
        <button className="app-btn" onClick={handleAppClick}>
          <FaWhatsapp /> WhatsApp
        </button>
      </section>
      <h1 className="servicios-titulo">SERVICIOS DISPONIBLES</h1>
      <section className="info-section">
        <div className="info-card">
          <img src="https://www.unite.ai/wp-content/uploads/2024/12/alex_mc9997_Isometric_digital_art_a_modern_veterinary_examina_5521da79-66c7-4ea9-9bd5-9d2f0d624acc_3.png" alt="Consulta Médica" />
          <h2>Consultas Médicas</h2>
          <p>Brindamos atención médica de calidad para tu mascota.</p>
        </div>
        <div className="info-card">
          <img src="https://media.istockphoto.com/id/1450190077/es/vector/concepto-de-hospital-veterinario.jpg?s=612x612&w=0&k=20&c=hcudjYIsZAe0mOx-GSwJCyVNolnfgxxzlkCsrJ58Zd0=" alt="Info 2" />
          <h2>Cirugías Generales</h2>
          <p>Realizamos cirugías de emergencia con la mejor tecnología.</p>
        </div>
        <div className="info-card">
          <img src="https://static.vecteezy.com/system/resources/previews/008/377/215/non_2x/a-groomer-bathing-a-dog-free-vector.jpg" alt="Info 3" />
          <h2>Peluquería</h2>
          <p>El mejor cuidado y estética para tu mascota.</p>
        </div>
        <div className="info-card">
          <img src="https://img.freepik.com/vector-premium/concepto-vacunacion-mascotas-medico-veterinario-haciendo-inyeccion-vacuna-perro-clinica-veterinaria_313242-307.jpg" alt="Vacunación" />
          <h2>Vacunaciones</h2>
          <p>Vacunamos a tu mascota para mantenerla saludable.</p>
        </div>
        <div className="info-card">
            <img src="https://media.istockphoto.com/id/946812044/es/vector/perro-tomando-un-ba%C3%B1o.jpg?s=612x612&w=0&k=20&c=ikqptsg_bdpoCnfEpoe8fgKG79xlp4hndiUFCDQDV9w=" alt="Baños Médicos" />
            <h2>Baños Médicos</h2>
            <p>Ofrecemos baños con productos especializados.</p>
        </div>
        <div className="info-card">
          <img src="https://img.freepik.com/vector-premium/medico-vector-esta-inyectando-perro_995281-43318.jpg?semt=ais_hybrid" alt="Desparacitación" />
          <h2>Desparacitación</h2>
          <p>Eliminamos parásitos para el bienestar de tu mascota.</p>
        </div>
      </section>
      <h3 className='pieinfo'>Atención personalizada sin necesidad de salir de casa</h3>
    </main>
  );
};

export default HomeContent;
