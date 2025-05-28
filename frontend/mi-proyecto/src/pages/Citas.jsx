import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import '../estilos css/citas.css';
import { obtenerCitas } from "../services/obtenercitaService";

function MisCitas() {
    const [citas, setCitas] = useState([]);
    const [allCitas, setAllCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usuarioId, setUsuarioId] = useState(null);
    const [citaSeleccionadaParaEditar, setCitaSeleccionadaParaEditar] = useState(null);

    const ALL_POSSIBLE_HOURS = [
        "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    ];

    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                return decodedToken.usuario_id;
            } catch (error) {
                console.error("Error decodificando el token:", error);
                return null;
            }
        }
        return null;
    };

    useEffect(() => {
        const id = getUserIdFromToken();
        if (id) {
            setUsuarioId(id);
        } else {
            setError("No se pudo obtener el ID de usuario del token. Por favor, inicia sesión de nuevo.");
            setLoading(false);
        }
    }, []);

    const fetchAllCitas = async () => {
        try {
            const response = await obtenerCitas();
            if (response.state === "error") {
                throw new Error(response.message);
            }
            setAllCitas(response);
        } catch (err) {
            console.error("Error al cargar todas las citas:", err);
        }
    };

    useEffect(() => {
        fetchAllCitas();
    }, []);

    useEffect(() => {
        const fetchUserCitas = async () => {
            if (!usuarioId) return;

            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/citas/usuario/${usuarioId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error desconocido al obtener las citas.');
                }

                const data = await response.json();
                setCitas(data);
            } catch (err) {
                console.error("Error al cargar las citas:", err);
                setError(`Error al cargar las citas: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUserCitas();
    }, [usuarioId]);

    const getAvailableHoursForDate = (selectedDate) => {
        if (!selectedDate || !allCitas.length) return ALL_POSSIBLE_HOURS;

        try {
            const fechaString = new Date(selectedDate);
            fechaString.setHours(0, 0, 0, 0);
            const fechaNormalizada = fechaString.toISOString().split('T')[0];

            const horasOcupadas = allCitas
                .filter(cita => {
                    try {
                        const citaFecha = new Date(cita.fecha);
                        citaFecha.setHours(0, 0, 0, 0);
                        return citaFecha.toISOString().split('T')[0] === fechaNormalizada;
                    } catch (e) {
                        console.error("Error procesando fecha de cita:", e);
                        return false;
                    }
                })
                .map(cita => cita.hora);

            return ALL_POSSIBLE_HOURS.filter(hora => !horasOcupadas.includes(hora));
        } catch (error) {
            console.error("Error al calcular horas disponibles:", error);
            return ALL_POSSIBLE_HOURS;
        }
    };

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        setCitaSeleccionadaParaEditar(prev => ({
            ...prev,
            fecha: e.target.value,
            hora: prev.hora && getAvailableHoursForDate(newDate).includes(prev.hora)
                ? prev.hora
                : ''
        }));
    };

    const handleTimeChange = (e) => {
        setCitaSeleccionadaParaEditar(prev => ({
            ...prev,
            hora: e.target.value
        }));
    };

    const handleEditarClick = (cita) => {
        setCitaSeleccionadaParaEditar({
            ...cita,
            fecha: cita.fecha.includes('T') ? cita.fecha.split('T')[0] : cita.fecha
        });
    };

    const handleGuardarEdicion = async (citaId, datosActualizados) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/citas/${citaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datosActualizados),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar la cita.');
            }

            const updatedCitaResponse = await response.json();
            console.log("Cita actualizada:", updatedCitaResponse.cita);

            setCitas(citas.map(c =>
                c.cita_id === citaId ? updatedCitaResponse.cita : c
            ));
            setCitaSeleccionadaParaEditar(null);
            Swal.fire({
                icon: "success",
                title: "¡Actualización exitosa!",
                text: "Cita actualizada correctamente",
                timer: 2000,
                showConfirmButton: false
            });

            fetchAllCitas();
        } catch (err) {
            console.error("Error al actualizar cita:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `Error al actualizar la cita: ${err.message}`
            });
        }
    };

    const handleEliminarClick = async (citaId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Realmente quieres eliminar esta cita? Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`http://localhost:5000/api/citas/${citaId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Error al eliminar la cita.');
                    }

                    setCitas(citas.filter(c => c.cita_id !== citaId));
                    Swal.fire({
                        icon: "success",
                        title: "¡Eliminada!",
                        text: "Cita eliminada con éxito.",
                        timer: 2000,
                        showConfirmButton: false
                    });

                    fetchAllCitas();
                } catch (err) {
                    console.error("Error al eliminar cita:", err);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: `Error al eliminar la cita: ${err.message}`
                    });
                }
            }
        });
    };

    return (
        <div className="citas-container">
            <h1 className="citas-heading">Mis Citas Agendadas</h1>

            {loading && <p className="citas-message">Cargando tus citas, por favor espera...</p>}
            {error && <p className="citas-message error">Error: {error}</p>}
            {!loading && !error && citas.length === 0 && (
                <p className="citas-message">Parece que no tienes citas agendadas aún. ¡Anímate a crear una!</p>
            )}
            <div className="citas-grid">
                {!loading && !error && citas.map((cita) => {
                    // Función para formatear correctamente la fecha
                    const formatDate = (dateString) => {
                        if (!dateString) return 'Fecha no disponible';

                        // Extraer solo la parte de la fecha si viene con hora
                        const fechaSolo = dateString.split('T')[0];

                        const [yyyy, mm, dd] = fechaSolo.split('-');
                        return `${dd}/${mm}/${yyyy}`;
                    };

                    return (
                        <div key={cita.cita_id} className="cita-card">
                            <img src="https://lares.com.co/wp-content/uploads/2023/06/blog-mascotas-lares-scaled.jpg" alt="Mascota" />
                            <p><strong>Fecha:</strong> {formatDate(cita.fecha)}</p>
                            <p><strong>Hora:</strong> {cita.hora}</p>
                            {/* <p><strong>Estado:</strong> {cita.estado}</p> */}
                            <p><strong>Observaciones:</strong> {cita.observaciones || 'N/A'}</p>
                            <div className="card-actions">
                                <button className="btn btn-edit" onClick={() => handleEditarClick(cita)}>
                                    Editar
                                </button>
                                <button className="btn btn-delete" onClick={() => handleEliminarClick(cita.cita_id)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {citaSeleccionadaParaEditar && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Editar Cita</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const updatedData = {
                                fecha: formData.get('fecha'),
                                hora: formData.get('hora'),
                                estado: formData.get('estado'),
                                observaciones: formData.get('observaciones'),
                            };
                            handleGuardarEdicion(citaSeleccionadaParaEditar.cita_id, updatedData);
                        }}>
                            <label className="form-label">
                                Fecha:
                                <input
                                    type="date"
                                    name="fecha"
                                    value={citaSeleccionadaParaEditar.fecha}
                                    onChange={handleDateChange}
                                    required
                                    className="form-input"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </label>
                            <label className="form-label">
                                Hora:
                                <select
                                    name="hora"
                                    value={citaSeleccionadaParaEditar.hora || ''}
                                    onChange={handleTimeChange}
                                    required
                                    className="form-input"
                                    disabled={!citaSeleccionadaParaEditar.fecha}
                                >
                                    <option value="">Seleccione una hora</option>
                                    {getAvailableHoursForDate(new Date(citaSeleccionadaParaEditar.fecha)).map(hora => (
                                        <option key={hora} value={hora}>{hora}</option>
                                    ))}
                                    {citaSeleccionadaParaEditar.hora &&
                                        !getAvailableHoursForDate(new Date(citaSeleccionadaParaEditar.fecha)).includes(citaSeleccionadaParaEditar.hora) && (
                                            <option
                                                value={citaSeleccionadaParaEditar.hora}
                                                disabled
                                            >
                                                {citaSeleccionadaParaEditar.hora} (Ocupada)
                                            </option>
                                        )}
                                </select>
                            </label>
                            {/* <label className="form-label">
                                Estado:
                                <select
                                    name="estado"
                                    value={citaSeleccionadaParaEditar.estado}
                                    className="form-input"
                                    required
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Confirmada">Confirmada</option>
                                    <option value="Cancelada">Cancelada</option>
                                    <option value="Completada">Completada</option>
                                </select>
                            </label> */}
                            <label className="form-label">
                                Observaciones:
                                <textarea
                                    name="observaciones"
                                    value={citaSeleccionadaParaEditar.observaciones || ''}
                                    className="form-input"
                                />
                            </label>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-save">Guardar Cambios</button>
                                <button type="button" onClick={() => setCitaSeleccionadaParaEditar(null)} className="btn btn-cancel">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MisCitas;