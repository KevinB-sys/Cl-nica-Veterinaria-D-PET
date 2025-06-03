// backend/src/whatsapp/whatsappClient.js

// SOLUCIÓN: Importar como default export y luego desestructurar
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

import qrcode from 'qrcode-terminal';

let client; // Variable para almacenar la instancia del cliente de WhatsApp

// Función para inicializar el cliente de WhatsApp
const initializeWhatsAppClient = () => {
    // Si el cliente ya existe y está activo, no lo inicializamos de nuevo
    if (client && client.pupPage) {
        console.log('WhatsApp Client already initialized.');
        return client;
    }

    // Inicializa el cliente con autenticación local para guardar la sesión
    client = new Client({
        authStrategy: new LocalAuth({
            clientId: "whatsapp-app-web" // Puedes dar un nombre único a tu sesión
        }),
        puppeteer: {
            // Esto es importante para el despliegue en algunos entornos de servidor
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }
    });

    // Evento cuando el cliente está listo
    client.once('ready', () => {
        console.log('WhatsApp Client is ready!');
        // Aquí podrías enviar una notificación a tu equipo o registrar un evento
    });

    // Evento cuando se recibe el código QR
    client.on('qr', (qr) => {
        console.log('QR RECEIVED');
        qrcode.generate(qr, { small: true });
        console.log('Por favor, escanea este código QR con tu teléfono en WhatsApp > Dispositivos Vinculados.');
    });

    // Evento de desconexión (útil para manejar reconexiones o errores)
    client.on('disconnected', (reason) => {
        console.log('WhatsApp Client Disconnected:', reason);
        // Puedes implementar lógica para intentar reconectar o notificar un error
    });

    // Evento de mensaje entrante (ejemplo: puedes tener comandos básicos aquí)
    client.on('message', message => {
        // console.log('Mensaje recibido:', message.body); // Descomenta si quieres ver todos los mensajes
        if (message.body === '!estado') {
            message.reply('¡Estoy activo y funcionando correctamente!');
        }
    });

    // Inicializa el cliente
    client.initialize()
        .catch(err => console.error('Error initializing WhatsApp client:', err));

    return client;
};

// Función para obtener la instancia del cliente
const getWhatsAppClient = () => {
    if (!client) {
        console.warn('WhatsApp Client not initialized. Call initializeWhatsAppClient first.');
    }
    return client;
};

export {
    initializeWhatsAppClient,
    getWhatsAppClient
};