import React, { useState } from "react";
import "../estilos css/administrar.css";
import Swal from 'sweetalert2'; // Importamos SweetAlert2

const AdminSettingsPage = () => {
    const [settings, setSettings] = useState({
        maxLoginAttempts: 4,
        lockoutDuration: 0.5,
        lockout: 60,
        siteName: "D'PET",
        maintenanceMode: false,
    });

    const [especiesYRazas, setEspeciesYRazas] = useState({
        PERRO: ["LABRADOR", "BULLDOG", "COCKER"],
        GATO: ["SIAMES", "PERSA"],
        AVE: ["PERIQUITO", "CANARIO"],
        ROEDOR: ["HAMSTER", "CONEJO"],
        REPTIL: ["SERPIENTE", "LAGARTO"],
    });

    const [nuevaEspecie, setNuevaEspecie] = useState("");
    const [nuevaRaza, setNuevaRaza] = useState("");
    const [especieSeleccionada, setEspecieSeleccionada] = useState("PERRO"); // Estado para la especie seleccionada

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleGuardarCambios = async (e) => {
        e.preventDefault();
        // Muestra una alerta de éxito
        await Swal.fire({
            icon: 'success',
            title: '¡Cambios Guardados!',
            text: 'Las configuraciones y datos de especies/razas se han guardado correctamente.',
            confirmButtonText: 'Ok'
        });
        console.log("Configuración del sitio:", settings);
        console.log("Especies y Razas:", especiesYRazas);
        window.location.href = "/"; // Redirige a la página principal
    };

    const handleCancelar = () => {
        // Muestra una alerta de confirmación antes de cancelar
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Los cambios no guardados se perderán.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, continuar editando'
        }).then((result) => {
            if (result.isConfirmed) {
                // Redirige al home si el usuario confirma
                window.location.href = "/"; // Redirige a la página principal
            }
        });
    };

    const agregarEspecie = () => {
        if (nuevaEspecie.trim() && !Object.keys(especiesYRazas).includes(nuevaEspecie.toUpperCase())) {
            setEspeciesYRazas((prev) => ({
                ...prev,
                [nuevaEspecie.toUpperCase()]: [], // Inicializa la nueva especie sin razas
            }));
            setNuevaEspecie("");
            Swal.fire({
                icon: 'success',
                title: '¡Especie Agregada!',
                text: `La especie "${nuevaEspecie.toUpperCase()}" ha sido añadida.`,
                timer: 1500,
                showConfirmButton: false
            });
        } else if (Object.keys(especiesYRazas).includes(nuevaEspecie.toUpperCase())) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `La especie "${nuevaEspecie.toUpperCase()}" ya existe.`,
            });
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Por favor, introduce el nombre de la especie.',
            });
        }
    };

    const agregarRaza = () => {
        if (nuevaRaza.trim() && especieSeleccionada) {
            const razaUpper = nuevaRaza.toUpperCase();
            if (!especiesYRazas[especieSeleccionada].includes(razaUpper)) {
                setEspeciesYRazas((prev) => ({
                    ...prev,
                    [especieSeleccionada]: [...prev[especieSeleccionada], razaUpper],
                }));
                setNuevaRaza("");
                Swal.fire({
                    icon: 'success',
                    title: '¡Raza Agregada!',
                    text: `La raza "${razaUpper}" ha sido añadida a "${especieSeleccionada}".`,
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `La raza "${nuevaRaza}" ya existe para la especie "${especieSeleccionada}".`,
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Por favor, selecciona una especie y escribe el nombre de la raza.',
            });
        }
    };

    return (
        <div className="admin-container">
            <div className="logimage">
                <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8Hz0UUXxZm21BEiTgWaMMgmjHU0AKmWpwLck_ucBy2J0a2MlNaZbEeQ74sc_2-zxiqEPp3wpx43jHoEqKCWbbuwSXwSv3ihs9R2fSSh5K7-5nWVYtT6gSPG30_9qUoAZeFld2uCRcGiRmh8UD5QUH_jEzOGDncZluQbi6pnmYdjVDZIM0vmHDhetO0xE/s320/logo.png" alt="Login" />
            </div>
            <h2 className="admin-title">Configuración del Sitio</h2>

            <div className="admin-content-wrapper">
                {/* Contenedor Izquierdo: Configuración del Sitio */}
                <div className="admin-section site-settings-section">
                    <h3>Ajustes del Sitio</h3>
                    <form className="admin-form">
                        <div className="form-group">
                            <label htmlFor="siteName">Nombre del Sitio</label>
                            <input
                                type="text"
                                id="siteName"
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="maxLoginAttempts">Intentos Permitidos al Iniciar Sesión</label>
                            <input
                                type="number"
                                id="maxLoginAttempts"
                                name="maxLoginAttempts"
                                value={settings.maxLoginAttempts}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lockoutDuration">Tiempo de Bloqueo (minutos)</label>
                            <input
                                type="number"
                                id="lockoutDuration"
                                name="lockoutDuration"
                                value={settings.lockoutDuration}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="lockout">Tiempo válido de cambio de contraseña (minutos)</label>
                            <input
                                type="number"
                                id="lockout"
                                name="lockout"
                                value={settings.lockout}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>
                    </form>
                </div>

                {/* Contenedor Derecho: Especies y Razas */}
                <div className="admin-section species-breeds-section">
                    <h3>Administrar Especies y Razas</h3>
                    {/* Campo para agregar nueva especie */}
                    <div className="form-group add-item-group">
                        <input
                            type="text"
                            placeholder="Nueva especie"
                            value={nuevaEspecie}
                            onChange={(e) => setNuevaEspecie(e.target.value)}
                        />
                        <button onClick={agregarEspecie} className="add-button" disabled={!nuevaEspecie.trim()}>
                            Agregar especie
                        </button>
                    </div>

                    <div className="form-group">
                        <label htmlFor="selectEspecie">Seleccionar Especie</label>
                        <select
                            id="selectEspecie"
                            className="select-especie"
                            value={especieSeleccionada}
                            onChange={(e) => setEspecieSeleccionada(e.target.value)}
                        >
                            {Object.keys(especiesYRazas).map((especie) => (
                                <option key={especie} value={especie}>
                                    {especie}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Campo para agregar nueva raza */}
                    <div className="form-group add-item-group">
                        <input
                            type="text"
                            placeholder="Nueva raza"
                            value={nuevaRaza}
                            onChange={(e) => setNuevaRaza(e.target.value)}
                        />
                        <button onClick={agregarRaza} className="add-button" disabled={!especieSeleccionada || !nuevaRaza.trim()}>
                            Agregar raza
                        </button>
                    </div>

                    <div className="form-group">
                        <label>Razas de {especieSeleccionada}:</label>
                        <ul className="lista-razas">
                            {especiesYRazas[especieSeleccionada] && especiesYRazas[especieSeleccionada].length > 0 ? (
                                especiesYRazas[especieSeleccionada].map((raza, index) => (
                                    <li key={index}>{raza}</li>
                                ))
                            ) : (
                                <li>No hay razas registradas para esta especie.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" onClick={handleGuardarCambios} className="save-button">Guardar cambios</button>
                <button type="button" onClick={handleCancelar} className="cancel-button">Cancelar</button>
            </div>
        </div>
    );
};

export default AdminSettingsPage;