// src/components/ChatBotAgendar.jsx
import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { agendarcita } from "../services/agendarService"; // Ajusta la ruta a tus servicios
import { obtenerCitas } from "../services/obtenercitaService"; // Ajusta la ruta a tus servicios
import '../estilos css/chatbot.css'; // ¡Importamos los estilos aquí!

const ChatBotAgendar = () => {
    const [messages, setMessages] = useState([
        { from: "bot", text: "¡Guau-hola! 🐾 Soy tu amigable asistente peludo. ¿En qué fecha quieres agendar una cita para tu pequeño amigo? (ej: 2025-05-30)" }
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

        const selectedDateAtMidnight = new Date(fecha);
        selectedDateAtMidnight.setHours(0, 0, 0, 0);

        const now = new Date();
        const todayAtMidnight = new Date(now);
        todayAtMidnight.setHours(0, 0, 0, 0);

        const parseTimeToDate = (timeStr, baseDate) => {
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            const d = new Date(baseDate);
            d.setHours(hours, minutes, 0, 0);
            return d;
        };

        const fechaStringISO = formatearFechaSinZona(fecha);

        const horasOcupadas = citas
            .filter(cita => cita.fecha.split("T")[0] === fechaStringISO)
            .map(cita => cita.hora);

        let horasFiltradas = ALL_POSSIBLE_HOURS.filter(hora => {
            const isOccupied = horasOcupadas.includes(hora);
            let isPast = false;

            if (selectedDateAtMidnight.getTime() === todayAtMidnight.getTime()) {
                const horaCitaCompleta = parseTimeToDate(hora, now);
                isPast = horaCitaCompleta.getTime() <= now.getTime();
            }

            return !isOccupied && !isPast;
        });

        return horasFiltradas;
    };

    const handleUserMessage = async (msg) => {
        setMessages(prev => [...prev, { from: "user", text: msg }]);

        if (step === "esperando_fecha") {
            const [year, month, day] = msg.split("-");
            if (!year || !month || !day || isNaN(parseInt(year)) || isNaN(parseInt(month)) || isNaN(parseInt(day))) {
                setMessages(prev => [...prev, { from: "bot", text: "¡Oops! Parece que no entendí la fecha. 🙀 Por favor, escríbela en formato AAAA-MM-DD, como '2025-06-01'. ¡Gracias por tu paciencia felina! 🐱" }]);
                return;
            }
            // Crear fecha con UTC para evitar zona horaria
            const fecha = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));

            if (isNaN(fecha.getTime())) {
                setMessages(prev => [...prev, { from: "bot", text: "¡Ay, mi colita! 🐶 Esa fecha no parece correcta. Intenta de nuevo con el formato AAAA-MM-DD, por ejemplo: 2025-06-01." }]);
                return;
            }
            setSelectedDate(fecha);
            const horas = calcularHorasDisponibles(fecha);
            setHorasDisponibles(horas);
            if (horas.length === 0) {
                setMessages(prev => [...prev, { from: "bot", text: "¡Miau! 😿 Parece que estamos completos para esa fecha. Por favor, elige otro día para consentir a tu mascota." }]);
                return;
            }
            setStep("esperando_hora");
            // *** CAMBIO CLAVE AQUÍ: Usamos directamente 'msg' para mostrar la fecha ingresada ***
            setMessages(prev => [...prev, { from: "bot", text: `¡Genial! Para el día ${msg}, las horas disponibles son: ${horas.join(", ")}. ¿Cuál le viene mejor? 🐶⏰` }]);
        }
        else if (step === "esperando_hora") {
            if (!horasDisponibles.includes(msg)) {
                setMessages(prev => [...prev, { from: "bot", text: "¡Ups! Esa hora ya está ocupada o no es válida. Por favor, elige una de estas opciones para tu amigo peludo: " + horasDisponibles.join(", ") + " 🐾" }]);
                return;
            }
            setSelectedTime(msg);
            setStep("confirmacion");
            // *** CAMBIO CLAVE AQUÍ: Usamos formatearFechaSinZona(selectedDate) para la confirmación ***
            setMessages(prev => [...prev, { from: "bot", text: `¡Excelente elección! ¿Quieres confirmar la cita para tu mascota el ${formatearFechaSinZona(selectedDate)} a las ${msg}? (Responde "sí" para confirmar o "no" para cancelar y buscar otra hora). 🐕‍⬛` }]);
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
                    }
                }

                const citaData = {
                    fecha: fechaISO,
                    hora: selectedTime,
                    observaciones: "",
                    usuario_id
                };

                const resultado = await agendarcita(citaData);

                if (resultado.message === "Cita agendada con exito") {
                    setMessages(prev => [...prev, { from: "bot", text: "¡Fantástico! 🎉 Tu cita ha sido agendada con éxito. ¡Estamos ansiosos por conocer a tu mascota! 🐶🐱" }]);
                    setStep("finalizado");
                } else {
                    setMessages(prev => [...prev, { from: "bot", text: "¡Oh no! Algo salió mal al agendar la cita. 😔 " + (resultado.message || "Por favor, inténtalo de nuevo más tarde o contáctanos directamente si el problema persiste. ¡No te rindas con tu patita!") }]);
                    setStep("finalizado");
                }
            } else {
                setMessages(prev => [...prev, { from: "bot", text: "¡Entendido! Cita cancelada. Si quieres agendar otra vez, solo dime la fecha para tu amigo peludo. 🐾" }]);
                setStep("esperando_fecha");
            }
        }
    };

    const onSend = () => {
        if (!input.trim()) return;
        handleUserMessage(input.trim());
        setInput("");
    };

    return (
        <div className="chatbot-container">
            <h3 className="chatbot-header">
                🐶 Agendamiento Veterinario 🐱
            </h3>
            <div className="chatbot-messages">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`message-row ${m.from === "bot" ? "bot-message-row" : "user-message-row"}`}
                    >
                        <div className={`message-bubble ${m.from === "bot" ? "bot-bubble" : "user-bubble"}`}>
                            {m.text}
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