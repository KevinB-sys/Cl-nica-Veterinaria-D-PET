import prisma from "../prisma/prismaClient.js";
import { v4 as uuidv4 } from 'uuid';

export const getAllvacuna = async () => {
  return await prisma.vacunacion.findMany({
  });
};

export const createNewVacuna = async (data) => {
  const { mascota_id, vacuna, fecha, proxVisita, edad, peso } = data; // 'mascota_id' llega aquí desde el frontend

  const vacunaId = uuidv4();

  return await prisma.vacunacion.create({
    data: {
      vacunacion_id: vacunaId,
      mascota: {
        connect: {
          mascota_id: mascota_id, // Aquí conectamos con la mascota que tiene este ID
        },
      },
      vacuna,
      fecha_aplicacion: new Date(fecha),
      proxima_visita: new Date(proxVisita),
      edad,
      peso
    },
  });
};