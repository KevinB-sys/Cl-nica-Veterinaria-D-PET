import '../estilos css/crearcarnet.css';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaDog, FaCat, FaUser, FaBirthdayCake, FaPaw } from "react-icons/fa";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { getAllUsuarios } from '../services/usuariosService';
import { updateMascota } from '../services/mascotaService';
import { getMascotaById } from '../services/obtenermascota';

export default function EditarCarnetMascota() {
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el ID de la URL
    const [duenos, setDuenos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mascotaOriginal, setMascotaOriginal] = useState(null);

    const [form, setForm] = useState({
        nombre: "",
        especie: "",
        raza: "",
        sexo: "",
        fecha_nacimiento: "",
        duenio_id: "",
    });

    const razasPorEspecie = {
        PERRO: ["LABRADOR", "BULLDOG", "COCKER", "PUG", "OTRO"],
        GATO: ["SIAMES", "PERSA", "ANGORA", "OTRO"],
        AVE: ["LORO", "PERIQUITO", "CANARIO", "OTRO"],
        ROEDOR: ["CONEJO", "HAMSTER", "CONEJILLO DE INDIAS", "OTRO"],
        REPTIL: ["TORTUGA", "IGUANA", "GECKO", "OTRO"]
    };

    // Validar que el ID sea un número entero
    useEffect(() => {
        const mascotaId = parseInt(id);

        if (!id || isNaN(mascotaId) || mascotaId <= 0) {
            Swal.fire({
                icon: "error",
                title: "ID inválido",
                text: "El ID de la mascota no es válido",
            }).then(() => {
                navigate("/Services");
            });
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);

                // Cargar información de la mascota
                const mascotaData = await getMascotaById(mascotaId);
                if (!mascotaData) {
                    Swal.fire({
                        icon: "error",
                        title: "Mascota no encontrada",
                        text: "No se pudo encontrar la información de la mascota",
                    }).then(() => {
                        navigate("/Services");
                    });
                    return;
                }

                // Cargar dueños
                const duenosData = await getAllUsuarios();
                if (duenosData) {
                    setDuenos(duenosData);
                }

                // Formatear fecha si existe
                let fechaFormateada = "";
                if (mascotaData.fecha_nacimiento) {
                    const fecha = new Date(mascotaData.fecha_nacimiento);
                    fechaFormateada = fecha.toISOString().split('T')[0];
                }

                // Establecer datos del formulario
                const mascotaForm = {
                    nombre: mascotaData.nombre || "",
                    especie: mascotaData.especie || "",
                    raza: mascotaData.raza || "",
                    sexo: mascotaData.sexo || "",
                    fecha_nacimiento: fechaFormateada,
                    duenio_id: mascotaData.duenio_id || "",
                };

                setForm(mascotaForm);
                setMascotaOriginal(mascotaForm);
                setLoading(false);

            } catch (error) {
                console.error("Error al cargar datos:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error al cargar la información de la mascota",
                }).then(() => {
                    navigate("/Services");
                });
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
            // Si cambia especie, reseteamos la raza
            ...(name === "especie" ? { raza: "" } : {})
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar si hay cambios
        const hasChanges = Object.keys(form).some(key => form[key] !== mascotaOriginal[key]);

        if (!hasChanges) {
            Swal.fire({
                icon: "info",
                title: "Sin cambios",
                text: "No se han realizado modificaciones",
            });
            return;
        }

        const confirmResult = await Swal.fire({
            title: "¿Está seguro?",
            text: "¿Desea guardar los cambios en el carnet de la mascota?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, guardar cambios",
            cancelButtonText: "No, cancelar",
        });

        if (confirmResult.isConfirmed) {
            try {
                const mascotaId = parseInt(id);

                // Convertir fecha a formato DateTime ISO-8601
                const formData = {
                    ...form,
                    fecha_nacimiento: form.fecha_nacimiento ? new Date(form.fecha_nacimiento + 'T00:00:00.000Z').toISOString() : form.fecha_nacimiento
                };

                const data = await updateMascota(mascotaId, formData);
                console.log(data);

                if (data.message === "Mascota actualizada con éxito" || data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "¡Actualización exitosa!",
                        text: "Carnet de mascota actualizado correctamente",
                        timer: 2000,
                        showConfirmButton: false,
                    }).then(() => {
                        navigate("/Services");
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: data.message || "Ocurrió un problema al actualizar.",
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Hubo un error",
                    text: "No se pudo actualizar el carnet de la mascota",
                });
                console.error(error);
            }
        }
    };

    // Mostrar loading mientras se cargan los datos
    if (loading) {
        return (
            <div className="registro-container" style={{ textAlign: 'center', padding: '2rem' }}>
                <div>Cargando información de la mascota...</div>
            </div>
        );
    }

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

            <h2 className="titulo-registro">Editar Carnet de Vacunación</h2>

            <form onSubmit={handleSubmit} className="formulario-registro">
                <div className="contenedor-campos">
                    <div className="columna">
                        <div className="grupo-campo">
                            <FaPaw className="icono" />
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre de la mascota"
                                value={form.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grupo-campo">
                            <FaDog className="icono" />
                            <select name="especie" value={form.especie} onChange={handleChange} required>
                                <option value="">Seleccione la especie</option>
                                <option value="PERRO">PERRO</option>
                                <option value="GATO">GATO</option>
                                <option value="AVE">AVE</option>
                                <option value="ROEDOR">ROEDOR</option>
                                <option value="REPTIL">REPTIL</option>
                            </select>
                        </div>

                        <div className="grupo-campo">
                            <FaCat className="icono" />
                            <select name="raza" value={form.raza} onChange={handleChange} required disabled={!form.especie}>
                                <option value="">
                                    {form.especie ? "Seleccione la raza" : "Seleccione primero una especie"}
                                </option>
                                {form.especie &&
                                    razasPorEspecie[form.especie]?.map((raza) => (
                                        <option key={raza} value={raza}>{raza}</option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="columna">
                        <div className="grupo-campo">
                            <FaUser className="icono" />
                            <select name="sexo" value={form.sexo} onChange={handleChange} required>
                                <option value="">Seleccione el sexo</option>
                                <option value="MACHO">MACHO</option>
                                <option value="HEMBRA">HEMBRA</option>
                            </select>
                        </div>
                        <div className="grupo-campo">
                            <FaBirthdayCake className="icono" />
                            <input
                                type="date"
                                name="fecha_nacimiento"
                                value={form.fecha_nacimiento}
                                onChange={handleChange}
                                required
                                max={new Date().toISOString().split("T")[0]}
                            />
                        </div>
                        <div className="grupo-campo">
                            <FaUser className="icono" />
                            <select name="duenio_id" value={form.duenio_id} onChange={handleChange} required>
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
                        Guardar Cambios
                    </motion.button>

                    <motion.button
                        type="button"
                        className="boton-cancelar"
                        onClick={() => navigate("/Services")}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{ marginLeft: '1rem', backgroundColor: '#6c757d' }}
                    >
                        Cancelar
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
}