import '../crearcarnet.css';
import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaDog, FaCat, FaUser, FaBirthdayCake, FaPaw } from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2"; 
import { registermascota } from '../services/mascotaService';
import { getAllUsuarios } from '../services/usuariosService';

export default function RegistroMascota() {
  const navigate = useNavigate(); 
  const [duenos, setDuenos] = useState([]);
  useEffect(() => {
    const fetchDuenos = async () => {
      const result = await getAllUsuarios();
      if(result){
        setDuenos(result);
      }else{
        alert("Error al cargar los dueños");
      }
    };
    fetchDuenos();
  }, [])

  const [form, setForm] = useState({
    nombre: "",
    especie: "",
    raza: "",
    sexo: "",
    fecha_nacimiento: "",
    duenio_id: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();

    const confirmResult = await Swal.fire({
      title: "¿Está seguro?",
      text: "¿Desea registrar un nuevo carnet de mascota?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, registrar",
      cancelButtonText: "No, cancelar",
    });

    if (confirmResult.isConfirmed) {
      try {
        // console.log(form);
        const data = await registermascota(form); 
        console.log(data);
        
        if (data.message === "Mascota registrada con éxito") {
          Swal.fire({
            icon: "success",
            title: "¡Registro exitoso!",
            text: "Mascota registrada correctamente",
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            navigate("/Services"); 
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Ocurrió un problema en el registro.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Hubo un error",
          text: "No se pudo registrar la mascota",
        });
        console.error(error);
      }
    }
  };

  return (
    <motion.div
      className="registro-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img 
        src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8Hz0UUXxZm21BEiTgWaMMgmjHU0AKmWpwLck_ucBy2J0a2MlNaZbEeQ74sc_2-zxiqEPp3wpx43jHoEqKCWbbuwSXwSv3ihs9R2fSSh5K7-5nWVYtT6gSPG30_9qUoAZeFld2uCRcGiRmh8UD5QUH_jEzOGDncZluQbi6pnmYdjVDZIM0vmHDhetO0xE/s320/logo.png"
        className="logo-vet"
        alt="Logo Veterinaria"
      />

      <h2 className="titulo-registro">Registro de Carnet</h2>

      <form onSubmit={handleSubmit} className="formulario-registro">
        <div className="contenedor-campos">
          <div className="columna">
            <div className="grupo-campo">
              <FaPaw className="icono" />
              <input type="text" name="nombre" placeholder="Nombre de la mascota" onChange={handleChange} required />
            </div>
            <div className="grupo-campo">
              <FaDog className="icono" />
              <input type="text" name="especie" placeholder="Especie" onChange={handleChange} required />
            </div>
            <div className="grupo-campo">
              <FaCat className="icono" />
              <input type="text" name="raza" placeholder="Raza" onChange={handleChange} required />
            </div>
          </div>

          <div className="columna">
            <div className="grupo-campo">
              <FaUser className="icono" />
              <select name="sexo" onChange={handleChange} required>
                <option value="">Seleccione el sexo</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
            <div className="grupo-campo">
              <FaBirthdayCake className="icono" />
              <input type="date" name="fecha_nacimiento" onChange={handleChange} required />
            </div>
            <div className="grupo-campo">
              <FaUser className="icono" />
              <select name="duenio_id" onChange={handleChange} required>
                <option value="">Seleccione el dueño o tutor</option>
                {duenos.map((dueno) => (
                  <option key={dueno.usuarioId} value={dueno.usuarioId}>
                    {dueno.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="contenedor-boton">
          <motion.button
            type="submit"
            className="boton-enviar"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Registrar carnet
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
