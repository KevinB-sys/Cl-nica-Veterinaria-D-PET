// src/components/ChatBotAgendar.jsx
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { agendarcita } from "../services/agendarService"; // Ajusta la ruta a tus servicios
import { obtenerCitas } from "../services/obtenercitaService"; // Ajusta la ruta a tus servicios
import '../estilos css/chatbot.css'; // ¡Importamos los estilos aquí!

const ChatBotAgendar = () => {
    const [messages, setMessages] = useState([
        { from: "bot", text: "¡Guau-hola! 🐾 Soy Lucky tu asistente peludo. ¿En qué fecha quieres agendar una !Guau-cita! veterinaria?", options: "initial_dates" }
    ]);
    const [step, setStep] = useState("esperando_fecha");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [citas, setCitas] = useState([]);
    const [horasDisponibles, setHorasDisponibles] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    // Scroll automático al final
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        async function cargarCitas() {
            const response = await obtenerCitas();
            if (response.state !== "error") {
                setCitas(response);
            }
        }
        cargarCitas();
    }, []);

    // Formatea la fecha sin zona horaria a AAAA-MM-DD
    // Esta función está bien para obtener la cadena de fecha sin importar la zona horaria.
    const formatearFechaSinZona = (date) => {
        const year = date.getFullYear();
        // Usamos getUTCMonth y getUTCDate para evitar zona horaria
        const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
        const day = (date.getUTCDate()).toString().padStart(2, "0"); // getUTCDate para el día
        return `${year}-${month}-${day}`;
    };

    const calcularHorasDisponibles = (fecha) => {
        const ALL_POSSIBLE_HOURS = [
            "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
            "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
        ];

        // Obtén la fecha de hoy formateada para una comparación sencilla
        const todayString = formatearFechaSinZona(new Date());
        // Obtén la fecha seleccionada formateada para una comparación sencilla
        const selectedDateString = formatearFechaSinZona(fecha);

        const now = new Date(); // La hora actual en la zona horaria local

        const parseTimeToDate = (timeStr, baseDate) => {
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            const d = new Date(baseDate); // Usar la baseDate (que es la fecha seleccionada)
            d.setHours(hours, minutes, 0, 0);
            return d;
        };

        const horasOcupadas = citas
            .filter(cita => cita.fecha.split("T")[0] === selectedDateString) // Usar la cadena de fecha para filtrar
            .map(cita => cita.hora);

        let horasFiltradas = ALL_POSSIBLE_HOURS.filter(hora => {
            const isOccupied = horasOcupadas.includes(hora);
            let isPast = false;

            // Solo aplicar filtro de hora si la fecha seleccionada es HOY
            if (selectedDateString === todayString) {
                const horaCitaCompleta = parseTimeToDate(hora, now); // now es la fecha y hora actual local
                // La hora debe ser al menos 15 minutos en el futuro para poder ser seleccionada
                // Usamos now directamente para la comparación horaria
                isPast = horaCitaCompleta.getTime() < (now.getTime() + (15 * 60 * 1000)); // +15 minutos de margen
            }

            return !isOccupied && !isPast;
        });

        return horasFiltradas;
    };

    const getInitialDateOptions = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(today.getDate() + 2);

        const options = [
            { label: `Hoy (${formatearFechaSinZona(today)})`, value: formatearFechaSinZona(today) },
            { label: `Mañana (${formatearFechaSinZona(tomorrow)})`, value: formatearFechaSinZona(tomorrow) },
            { label: `Pasado mañana (${formatearFechaSinZona(dayAfterTomorrow)})`, value: formatearFechaSinZona(dayAfterTomorrow) }
        ];

        return options;
    };


    const handleUserMessage = async (msg) => {
        // No añadir el mensaje del usuario si es una opción de botón
        if (!getInitialDateOptions().some(opt => opt.value === msg) && !horasDisponibles.includes(msg) && !["sí", "si", "no"].includes(msg.toLowerCase())) {
            setMessages(prev => [...prev, { from: "user", text: msg }]);
        }

        if (step === "esperando_fecha") {
            const [year, month, day] = msg.split("-");
            if (!year || !month || !day || isNaN(parseInt(year)) || isNaN(parseInt(month)) || isNaN(parseInt(day))) {
                setMessages(prev => [...prev, { from: "bot", text: "¡Oops! Parece que no entendí la fecha. 🐶 Por favor, escríbela en formato AAAA-MM-DD, como '2025-06-01'. ¡Gracias por tu paciencia felina! 🐶", options: "initial_dates" }]);
                return;
            }
            // Crear fecha con UTC para evitar zona horaria
            // Importante: Al crear la fecha para `setSelectedDate`, es mejor usarla de forma que represente el día sin importar la zona horaria.
            // new Date(año, mes-1, día) crea la fecha en la zona horaria local, lo cual es más consistente con `now`.
            const fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            fecha.setHours(0,0,0,0); // Asegura que la fecha seleccionada sea la medianoche de ese día en la zona local

            if (isNaN(fecha.getTime())) {
                setMessages(prev => [...prev, { from: "bot", text: "¡Ay, mi colita! 🐶 Esa fecha no parece correcta. Intenta de nuevo con el formato AAAA-MM-DD, por ejemplo: 2025-06-01.", options: "initial_dates" }]);
                return;
            }
            setSelectedDate(fecha);
            const horas = calcularHorasDisponibles(fecha);
            setHorasDisponibles(horas);
            if (horas.length === 0) {
                setMessages(prev => [...prev, { from: "bot", text: `¡Guau! 🐶 Parece que estamos completos para el día ${msg}. Por favor, elige otra fecha para consentir a tu mascota.`, options: "initial_dates" }]);
                setStep("esperando_fecha"); // Volver a pedir fecha
                return;
            }
            setStep("esperando_hora");
            setMessages(prev => [...prev, { from: "bot", text: `¡Muy bien! Para el día ${msg}, las horas disponibles son:`, options: horas }]);
        }
        else if (step === "esperando_hora") {
            if (!horasDisponibles.includes(msg)) {
                setMessages(prev => [...prev, { from: "bot", text: "¡Guau! 🐶Esa hora ya está ocupada o no es válida. Por favor, elige una de estas opciones para tu amigo peludo: ", options: horasDisponibles }]);
                return;
            }
            setSelectedTime(msg);
            setStep("confirmacion");
            setMessages(prev => [...prev, { from: "bot", text: `¡Buena elección! ¿Quieres confirmar la cita para tu mascota el ${formatearFechaSinZona(selectedDate)} a las ${msg}?`, options: ["Sí", "No"] }]);
        }
        else if (step === "confirmacion") {
            if (msg.toLowerCase().includes("sí") || msg.toLowerCase().includes("si")) {
                const fechaISO = formatearFechaSinZona(selectedDate);
                const token = localStorage.getItem("token");
                let usuario_id = null;
                if (token) {
                    try {
                        const payloadBase64 = token.split(".")[1];
                        const decodedPayload = JSON.parse(atob(payloadBase64));
                        usuario_id = decodedPayload.usuario_id; // Ajusta esto si tu token tiene la ID anidada
                    } catch (error) {
                        console.error("Error al decodificar token:", error);
                        // Considerar cómo manejar este error en el chatbot (e.g., pedir login)
                    }
                }

                if (!usuario_id) {
                    setMessages(prev => [...prev, { from: "bot", text: "Para agendar una cita, necesito que inicies sesión. Por favor, recarga la página y asegúrate de haber iniciado sesión. ¡Gracias! 🐶" }]);
                    setStep("finalizado");
                    return;
                }

                const citaData = {
                    fecha: fechaISO,
                    hora: selectedTime,
                    observaciones: "", // Puedes añadir una etapa para esto si lo necesitas
                    usuario_id
                };

                const resultado = await agendarcita(citaData);

                if (resultado.message === "Cita agendada con exito") {
                    setMessages(prev => [...prev, { from: "bot", text: "¡Guah! 🐶 Tu cita ha sido agendada con éxito. ¡Estamos ansiosos por conocer a tu mascota! 🐶" }]);
                    setStep("finalizado");
                } else {
                    setMessages(prev => [...prev, { from: "bot", text: "¡Oh no! Algo salió mal al agendar la cita. 🐶😔 " + (resultado.message || "Por favor, inténtalo de nuevo más tarde o contáctanos directamente si el problema persiste. ¡No te rindas con tu patita!") }]);
                    setStep("finalizado");
                }
            } else {
                setMessages(prev => [...prev, { from: "bot", text: "¡Entendido! Cita cancelada. Si quieres agendar otra vez, solo dime la fecha para tu amigo peludo. 🐾", options: "initial_dates" }]);
                setStep("esperando_fecha");
            }
        }
    };

    const onSend = () => {
        if (!input.trim()) return;
        handleUserMessage(input.trim());
        setInput("");
    };

    const handleOptionClick = (optionValue) => {
        handleUserMessage(optionValue);
        setInput(""); // Limpiar el input después de seleccionar una opción
    };

    return (
        <div className="chatbot-container">
            <h3 className="chatbot-header">
                🐶 Agendamiento D'PET 
            </h3>
            <div className="chatbot-messages">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`message-row ${m.from === "bot" ? "bot-message-row" : "user-message-row"}`}
                    >
                        <div className={`message-bubble ${m.from === "bot" ? "bot-bubble" : "user-bubble"}`}>
                            {m.text}
                            {m.options && (
                                <div className="chatbot-options">
                                    {m.options === "initial_dates" ? (
                                        getInitialDateOptions().map((opt, idx) => (
                                            <button key={idx} onClick={() => handleOptionClick(opt.value)} className="option-button">
                                                {opt.label}
                                            </button>
                                        ))
                                    ) : (
                                        m.options.map((opt, idx) => (
                                            <button key={idx} onClick={() => handleOptionClick(opt)} className="option-button">
                                                {opt}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            {step !== "finalizado" && (
                <div className="chatbot-input-area">
                    <input
                        type="text"
                        placeholder="Escribe tu mensaje peludo aquí..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") onSend(); }}
                        className="chatbot-input"
                    />
                    <button
                        onClick={onSend}
                        className="chatbot-send-button"
                    >
                        Enviar 🐾
                    </button>
                </div>
            )}
        </div>
    );
};

export default ChatBotAgendar;