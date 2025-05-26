import prisma from "../prisma/prismaClient.js";
import { v4 as uuidv4 } from 'uuid';

export const getAllCitas = async () => {
    return await prisma.cita.findMany({});
};

export const createNewCita = async (data) => {
    const { fecha, hora, estado, observaciones, usuario_id } = data;
    const CITA_ID = uuidv4();
    return await prisma.cita.create({
        data: {
            cita_id: CITA_ID,
            fecha: new Date(fecha),
            hora,
            estado,
            observaciones,
            usuario_id
        },
    });
};

// ---

/**
 * Obtiene todas las citas para un usuario_id específico.
 * @param {string} usuario_id - El ID del usuario.
 * @returns {Promise<Array>} - Un array de citas.
 */
export const getCitasByUserId = async (usuario_id) => {
    return await prisma.cita.findMany({
        where: {
            usuario_id: usuario_id,
        },
    });
};

/**
 * Actualiza una cita existente.
 * @param {string} cita_id - El ID de la cita a actualizar.
 * @param {object} data - Los datos a actualizar (por ejemplo, { hora: "15:00" }).
 * @returns {Promise<object>} - La cita actualizada.
 */
export const updateCita = async (cita_id, data) => {
    // Si la fecha se envía, asegúrate de convertirla a tipo Date
    if (data.fecha) {
        data.fecha = new Date(data.fecha);
    }
    return await prisma.cita.update({
        where: {
            cita_id: cita_id,
        },
        data: data,
    });
};

/**
 * Elimina una cita existente.
 * @param {string} cita_id - El ID de la cita a eliminar.
 * @returns {Promise<object>} - La cita eliminada.
 */
export const deleteCita = async (cita_id) => {
    return await prisma.cita.delete({
        where: {
            cita_id: cita_id,
        },
    });
};