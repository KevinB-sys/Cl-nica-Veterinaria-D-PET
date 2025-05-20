import React, { useState } from "react";
import "../estilos css/administrar.css";

const AdminSettingsPage = () => {
    const [settings, setSettings] = useState({
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        siteName: "D'PET",
        maintenanceMode: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Configuraciones guardadas correctamente.");
        console.log(settings);
    };

    return (
        <div className="admin-container">
            <div className="logo-container">
                <img
                    src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8Hz0UUXxZm21BEiTgWaMMgmjHU0AKmWpwLck_ucBy2J0a2MlNaZbEeQ74sc_2-zxiqEPp3wpx43jHoEqKCWbbuwSXwSv3ihs9R2fSSh5K7-5nWVYtT6gSPG30_9qUoAZeFld2uCRcGiRmh8UD5QUH_jEzOGDncZluQbi6pnmYdjVDZIM0vmHDhetO0xE/s320/logo.png"
                    alt="Login"
                    className="admin-logo"
                />
            </div>
            <h2 className="admin-title">Configuración del Sitio</h2>
            <form onSubmit={handleSubmit} className="admin-form">
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

                <div className="form-actions">
                    <button type="submit" className="save-button">Guardar cambios</button>
                    <a href="/" className="cancel-button">Cancelar</a>
                </div>
            </form>
        </div>
    );
};

export default AdminSettingsPage;
