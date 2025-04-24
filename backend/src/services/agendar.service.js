import prisma from "../prisma/prismaClient.js";
import { v4 as uuidv4 } from 'uuid';

export const getAllCitas = async () => {
    return await prisma.cita.findMany({
        
    });
};
export const createNewCita = async (data) => {
    const { fecha, hora, estado, observaciones } = data;
    const CITA_ID = uuidv4();
    return await prisma.cita.create({
      data: {
        cita_id: CITA_ID,
        fecha: new Date(fecha),
        hora,
        estado,
        observaciones
      },
    });
  
  
    // return await prisma.usuario.create({
    //   data,
    // });
  };