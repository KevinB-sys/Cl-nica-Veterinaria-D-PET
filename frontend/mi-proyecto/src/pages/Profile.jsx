import React, { useState, useEffect } from "react";
import "../estilos css/profile.css";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaSave,
} from "react-icons/fa";
import { getUsuarioById, updateUsuario } from "../services/obdatosusuario"; // Importa tus funciones de la API
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const UserProfile = () => {
  // Definir las fotos disponibles
  const fotos = [
    "https://i.pinimg.com/736x/d3/3c/06/d33c06ed8d607c70de9dc22b8c9b3830.jpg", // foto 1
    "https://static.vecteezy.com/system/resources/thumbnails/054/472/866/small_2x/cute-golden-puppy-waving-its-paw-happily-png.png", // foto 2
    "https://static.vecteezy.com/system/resources/thumbnails/058/042/348/small_2x/cute-puppy-waving-hello-with-a-friendly-expression-png.png", // foto 3
    "https://parrillagines.es/wp-content/uploads/2022/01/gatitos-tiernos-que-hablan.jpg", // foto 4
    "https://i.pinimg.com/originals/e0/19/17/e0191785c29396e42bccc19c6c3db098.jpg" // foto 5
  ];

  // Función para obtener una foto aleatoria
  const getRandomFoto = () => {
    return fotos[Math.floor(Math.random() * fotos.length)];
  };

  const [usuario, setUsuario] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    telefono: "",
    whatsapp: "",
    direccion: "",
    rol: "",
  });
  const [fotoPerfil] = useState(getRandomFoto()); // Estado separado para la foto aleatoria
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para almacenar el ID del usuario desde el token
  const [userIdFromToken, setUserIdFromToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserIdFromToken(decodedToken.usuario_id);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setError("Error al obtener la información del usuario.");
        setLoading(false);
      }
    } else {
      setError("No se encontró el token de autenticación.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userIdFromToken) {
        setLoading(true);
        setError(null);
        const userData = await getUsuarioById(userIdFromToken);
        if (userData && !userData.state) {
          setUsuario(userData);
        } else if (userData?.message) {
          setError(userData.message);
        } else {
          setError("Error al cargar los datos del usuario.");
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userIdFromToken]); // Dependencia en userIdFromToken para que se ejecute cuando se obtenga el ID del token

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefono') {
      const onlyNums = value.replace(/[^0-9]/g, '');
      if (value !== onlyNums) {
        Swal.fire({
          icon: 'warning',
          title: 'Solo números',
          text: 'Por favor, ingresa solo números en el campo de teléfono.',
        });
      }
      setUsuario({ ...usuario, [name]: onlyNums });
    } else {
      setUsuario({ ...usuario, [name]: value });
    }
  };

  const handleGuardar = async () => {
    // Validar WhatsApp primero
    const onlyNumbers = usuario.whatsapp.replace(/[^0-9]/g, '');
    const localNumber = onlyNumbers.replace(/^593/, '');

    if (localNumber.length !== 9) {
      Swal.fire({
        icon: "error",
        title: "Número inválido",
        text: "El número de WhatsApp debe tener exactamente 9 dígitos (sin incluir el código de país)",
      });
      return; // Detiene la ejecución si el número es inválido
    }

    // Si el número es válido, lanza la confirmación de guardar
    Swal.fire({
      title: '¿Estás seguro de guardar los cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (userIdFromToken) {
          try {
            const response = await updateUsuario(userIdFromToken, usuario);
            if (response && !response.state) {
              console.log("Usuario actualizado:", response);
              Swal.fire(
                '¡Guardado!',
                'Tus datos han sido guardados correctamente.',
                'success'
              );
            } else if (response?.message) {
              setError(response.message);
              Swal.fire(
                'Error',
                response.message,
                'error'
              );
            } else {
              setError("Error al guardar los cambios.");
              Swal.fire(
                'Error',
                'Hubo un problema al guardar los cambios.',
                'error'
              );
            }
          } catch {
            setError("No se encontró el ID del usuario para guardar.");
            Swal.fire(
              'Error',
              'No se pudo guardar la información.',
              'error'
            );
          }
        }
      }
    });
  };

  const handleCancelar = () => {
    navigate('/');
  };

  if (loading) {
    return <p>Cargando datos del usuario...</p>;
  }

  if (error) {
    return <p>Error al cargar los datos del usuario: {error}</p>;
  }

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div>
          <h2>Perfil de Usuario</h2>
        </div>
        <img className="perfil-foto" src={fotoPerfil} alt="Foto de perfil" />
        <div className="perfil-form">
          <label>
            <div className="label">Nombre:</div>
            <div className="input-icono">
              <FaUser />
              <input
                type="text"
                name="nombre"
                value={usuario.nombre}
                onChange={handleChange}
              />
            </div>
          </label>

          <label>
            <div className="label">Correo:</div>
            <div className="input-icono-correo">
              <FaEnvelope />
              <input
                type="email"
                name="correo"
                value={usuario.email}
                onChange={handleChange}
                readOnly // Opcional: si no quieres que el correo se edite
              />
            </div>
          </label>

          <label>
            <div className="label">Teléfono:</div>
            <div className="input-icono">
              <FaPhone />
              <input
                type="text"
                name="telefono"
                value={usuario.telefono}
                onChange={handleChange}
              />
            </div>
          </label>

          <label>
            <div className="label">WhatsApp:</div>
            <div className="input-icono-ws">
              <FaWhatsapp className="input-icon" /> {/* El icono debe ser un componente JSX */}
              <PhoneInput
                country={'ec'}
                value={usuario.whatsapp}
                onChange={(phone) => {
                  const numericPart = phone.replace(/[^0-9]/g, '');
                  const numberOnly = numericPart.replace(/^593/, '');
                  if (numberOnly.length <= 9) {
                    setUsuario({ ...usuario, whatsapp: phone });
                  }
                }}
                inputProps={{
                  name: 'whatsapp',
                  required: true,
                }}
                masks={{ ec: '...-...-...' }}
                enableSearch
              />
            </div>
          </label>

          <label>
            <div className="label">Dirección:</div>
            <div className="input-icono">
              <FaMapMarkerAlt />
              <input
                type="text"
                name="direccion"
                value={usuario.direccion}
                onChange={handleChange}
              />
            </div>
          </label>

          <div className="botones-perfil">
            <button className="btn-guardar" onClick={handleGuardar}>
              <FaSave style={{ marginRight: "8px" }} />
              Guardar
            </button>
            <button className="btn-cancelar" onClick={handleCancelar}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;