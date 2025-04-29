import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import '../estilos css/about.css';

// Importar las 18 imágenes
import foto1 from '../imagenes/1.jpeg';
import foto2 from '../imagenes/2.jpeg';
import foto3 from '../imagenes/3.jpeg';
import foto4 from '../imagenes/4.jpeg';
import foto5 from '../imagenes/5.jpeg';
import foto6 from '../imagenes/6.jpeg';
import foto7 from '../imagenes/7.jpeg';
import foto8 from '../imagenes/8.jpeg';
import foto9 from '../imagenes/9.jpeg';
import foto10 from '../imagenes/10.jpeg';
import foto11 from '../imagenes/11.jpeg';
import foto12 from '../imagenes/12.jpeg';
import foto13 from '../imagenes/13.jpeg';
import foto14 from '../imagenes/14.jpeg';
import foto15 from '../imagenes/15.jpeg';
import foto16 from '../imagenes/16.jpeg';
import foto17 from '../imagenes/17.jpeg';
import foto18 from '../imagenes/18.jpeg';

const SobreNosotros = () => {
  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '10%',
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="sobre-nosotros-page">
      <div className="sobre-nosotros-container">
        <h1>Sobre Nosotros</h1>
        <div className="carrusel-container">
          <Slider {...settings}>
            <div><img src={foto14} alt="Foto 1" /></div>
            <div><img src={foto2} alt="Foto 2" /></div>
            <div><img src={foto3} alt="Foto 3" /></div>
            <div><img src={foto4} alt="Foto 4" /></div>
            <div><img src={foto5} alt="Foto 5" /></div>
            <div><img src={foto6} alt="Foto 6" /></div>
            <div><img src={foto7} alt="Foto 7" /></div>
            <div><img src={foto8} alt="Foto 8" /></div>
            <div><img src={foto9} alt="Foto 9" /></div>
            <div><img src={foto10} alt="Foto 10" /></div>
            <div><img src={foto11} alt="Foto 11" /></div>
            <div><img src={foto12} alt="Foto 12" /></div>
            <div><img src={foto13} alt="Foto 13" /></div>
            <div><img src={foto1} alt="Foto 14" /></div>
            <div><img src={foto15} alt="Foto 15" /></div>
            <div><img src={foto16} alt="Foto 16" /></div>
            <div><img src={foto17} alt="Foto 17" /></div>
            <div><img src={foto18} alt="Foto 18" /></div>
          </Slider>
        </div>
      </div>

      {/* Sección de Información y Redes Sociales */}
      <div className="social-info-section">
        <div className="info-card">
          <h3><MapPin size={20} /> Contacto</h3>
          <div className="contact-info">
            <p><Phone size={18} /> +593 963 854 380</p>
            <p><Mail size={18} />Dr. Daniel Aldaz</p>
            <p>Av. Dr. Pio Jaramillo Alvarado y Av.25 de Julio frente a CNT</p>
          </div>
        </div>

        <div className="info-card">
          <h3>Horario de Atención</h3>
          <ul className="schedule-list">
            <li>Lunes a Viernes: 8:00 AM - 5:30 PM</li>
            <li>Sábados: 9:00 AM - 12:00 PM</li>
            <li>Emergencias 24/7 via teléfono</li>
          </ul>
        </div>

        <div className="info-card">
          <h3>Nuestras Redes</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook size={24} /> Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram size={24} /> Instagram
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter size={24} /> Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SobreNosotros;