//Llamar a la API de recordatorioWpp con fetch
export const enviarRecordatorioWpp = async (phoneNumber, message) => {
    if (!phoneNumber || typeof phoneNumber !== "string" || !phoneNumber.trim()) {
        return { state: "error", message: "El número de teléfono es requerido y debe ser una cadena válida." };
    }
    if (!message || typeof message !== "string" || !message.trim()) {
        return { state: "error", message: "El mensaje es requerido y debe ser una cadena válida." };
    }

    try {
        const res = await fetch("http://localhost:5000/api/send-whatsapp-reminder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ phoneNumber, message }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Error al enviar el recordatorio de WhatsApp");
        }

        return await res.json();
    } catch (error) {
        console.error("Error en enviarRecordatorioWpp:", error);
        return { state: "error", message: error.message || "Error en la conexión con el servidor" };
    }
};