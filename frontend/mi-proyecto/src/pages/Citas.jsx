import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import '../estilos css/citas.css'; // Asegúrate de que la ruta sea correcta

function MisCitas() {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usuarioId, setUsuarioId] = useState(null);
    const [citaSeleccionadaParaEditar, setCitaSeleccionadaParaEditar] = useState(null);

    // Define aquí las horas posibles, igual que en CalendarView
    const ALL_POSSIBLE_HOURS = [
        "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
        "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    ];

    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token'); // Corregido: 'token'
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

    useEffect(() => {
        const fetchCitas = async () => {
            if (!usuarioId) return;

            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('token'); // Corregido: 'token'
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

        fetchCitas();
    }, [usuarioId]);

    // Función para obtener las horas disponibles para una fecha específica
    const getAvailableHoursForDate = (selectedDate) => {
        // Formatea la fecha seleccionada a 'YYYY-MM-DD' en la zona horaria local,
        // igual que se hace en CalendarView para consistencia.
        // Ojo: Si el backend envía las fechas como YYYY-MM-DD y las maneja correctamente,
        // esta transformación podría no ser estrictamente necesaria aquí, pero ayuda a la consistencia.
        const fechaStringLocal = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0];

        // Filtra las citas que ya están agendadas para esa fecha
        const bookedHours = citas
            .filter(cita => {
                // Asegúrate de comparar las fechas de la misma manera que se guardan
                const citaFechaStringLocal = new Date(cita.fecha).toISOString().split("T")[0];
                return citaFechaStringLocal === fechaStringLocal;
            })
            .map(cita => cita.hora); // Obtén solo las horas ocupadas

        // Filtra las horas posibles para obtener solo las disponibles
        const available = ALL_POSSIBLE_HOURS.filter(hour => !bookedHours.includes(hour));
        return available;
    };

    // Manejador para el cambio de fecha en el input (ej. en el modal de edición)
    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        setCitaSeleccionadaParaEditar(prev => ({
            ...prev,
            fecha: newDate.toISOString().split("T")[0] // Guarda la fecha en formato ISO
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
            fecha: new Date(cita.fecha).toISOString().split('T')[0] // <-- Esta línea prepara la fecha para el input type="date"
        });
    };

    const handleGuardarEdicion = async (citaId, datosActualizados) => {
        try {
            const token = localStorage.getItem('token'); // Corregido: 'token'
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

            // Actualiza el estado local de citas para reflejar los cambios inmediatamente
            setCitas(citas.map(c =>
                c.cita_id === citaId ? updatedCitaResponse.cita : c
            ));
            setCitaSeleccionadaParaEditar(null); // Cierra el modal de edición
            Swal.fire({ icon: "success", title: "¡Actualización exitosa!", text: "Cita actualizada correctamente", timer: 2000, showConfirmButton: false });
        } catch (err) {
            console.error("Error al actualizar cita:", err);
            Swal.fire({ icon: "error", title: "Error", text: `Error al actualizar la cita: ${err.message}` });
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
                    const token = localStorage.getItem('token'); // Corregido: 'token'
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
                    Swal.fire({ icon: "success", title: "¡Eliminada!", text: "Cita eliminada con éxito.", timer: 2000, showConfirmButton: false });
                } catch (err) {
                    console.error("Error al eliminar cita:", err);
                    Swal.fire({ icon: "error", title: "Error", text: `Error al eliminar la cita: ${err.message}` });
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
                {!loading && !error && citas.map((cita) => (
                    <div key={cita.cita_id} className="cita-card">
                        <img src="https://lares.com.co/wp-content/uploads/2023/06/blog-mascotas-lares-scaled.jpg" alt="Descripción de la imagen" />
                        <p><strong>Fecha:</strong> {new Date(new Date(cita.fecha).getTime() + new Date(cita.fecha).getTimezoneOffset() * 60000).toLocaleDateString()}</p>
                        <p><strong>Hora:</strong> {cita.hora}</p>
                        <p><strong>Estado:</strong> {cita.estado}</p>
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

                ))}
            </div>

            {/* Modal/Formulario de Edición */}
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
                                    // Asegúrate de que el formato de fecha para defaultValue sea 'YYYY-MM-DD'
                                    defaultValue={citaSeleccionadaParaEditar.fecha}
                                    onChange={handleDateChange} // Nuevo manejador
                                    required
                                    className="form-input"
                                />
                            </label>
                            <label className="form-label">
                                Hora:
                                <select
                                    name="hora"
                                    value={citaSeleccionadaParaEditar.hora} // Usar value para un control total
                                    onChange={handleTimeChange} // Nuevo manejador
                                    required
                                    className="form-input"
                                >
                                    {/* Aquí mostramos solo las horas disponibles para la fecha seleccionada en el modal */}
                                    {getAvailableHoursForDate(new Date(citaSeleccionadaParaEditar.fecha)).map(hora => (
                                        <option key={hora} value={hora}>{hora}</option>
                                    ))}
                                    {/* Si la hora actual de la cita no está en las disponibles (ej. fue cancelada), asegúrate de que se muestre */}
                                    {!getAvailableHoursForDate(new Date(citaSeleccionadaParaEditar.fecha)).includes(citaSeleccionadaParaEditar.hora) && citaSeleccionadaParaEditar.hora && (
                                        <option value={citaSeleccionadaParaEditar.hora} disabled>{citaSeleccionadaParaEditar.hora} (Ocupada o Anterior)</option>
                                    )}
                                </select>
                            </label>
                            <label className="form-label">
                                Estado:
                                <select
                                    name="estado"
                                    defaultValue={citaSeleccionadaParaEditar.estado}
                                    className="form-input"
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Confirmada">Confirmada</option>
                                    <option value="Cancelada">Cancelada</option>
                                    <option value="Completada">Completada</option>
                                </select>
                            </label>
                            <label className="form-label">
                                Observaciones:
                                <textarea
                                    name="observaciones"
                                    defaultValue={citaSeleccionadaParaEditar.observaciones || ''}
                                    className="form-input"
                                ></textarea>
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