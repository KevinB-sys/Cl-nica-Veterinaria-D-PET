import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Importar rutas
import usuarioRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";
import mascotaRoutes from "./routes/mascota.routes.js";
import citaRoutes from "./routes/agendar.routes.js";
import vacunaRoutes from "./routes/vacuna.routes.js";

// Importar las funciones del cliente de WhatsApp
import { initializeWhatsAppClient, getWhatsAppClient } from "./whatsapp/whatsappClient.js"; // Ajusta la ruta si 'whatsappClient.js' está en otra carpeta

dotenv.config();

const app = express();
app.use(express.json()); // Para recibir JSON
app.use(cors()); // Habilitar CORS

// Configurar rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/auth", authRoutes);
app.use("/api/mascotas", mascotaRoutes);
app.use("/api/citas", citaRoutes);
app.use("/api/vacunas", vacunaRoutes);

// --- Nueva Ruta para enviar recordatorios de WhatsApp ---
app.post('/api/send-whatsapp-reminder', async (req, res) => {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
        return res.status(400).json({ error: 'Número de teléfono y mensaje son requeridos.' });
    }

    const whatsappClient = getWhatsAppClient();

    if (!whatsappClient || !whatsappClient.pupPage) {
        return res.status(503).json({ error: 'El cliente de WhatsApp no está listo o no está conectado.' });
    }

    try {
        // whatsapp-web.js requiere el formato 'numero@c.us'
        // Asegúrate de que phoneNumber tenga el código de país (ej. 593987654321)
        // Puedes agregar lógica de validación o formato aquí si es necesario
        const formattedPhoneNumber = `${phoneNumber.replace(/\D/g, '')}@c.us`; // Elimina no dígitos y añade @c.us

        await whatsappClient.sendMessage(formattedPhoneNumber, message);

        res.status(200).json({ success: true, message: 'Recordatorio de WhatsApp enviado.' });
    } catch (error) {
        console.error('Error al enviar el mensaje de WhatsApp:', error);
        res.status(500).json({ error: 'Error interno al enviar el recordatorio de WhatsApp.' });
    }
});

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    // ¡Importante! Inicializa el cliente de WhatsApp cuando el servidor Express se inicia
    initializeWhatsAppClient();
});