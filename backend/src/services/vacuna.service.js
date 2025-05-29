import prisma from "../prisma/prismaClient.js";
import { v4 as uuidv4 } from 'uuid';

export const getAllvacuna = async () => {
  return await prisma.vacunacion.findMany({
  });
};

export const createNewVacuna = async (data) => {
  const { vacuna, fecha, proxVisita, edad, peso } = data;
  const now = new Date();
  const vacunaId = uuidv4();
  return await prisma.vacunacion.create({
    data: {
      vacunacion_id: vacunaId,
      mascota_id: 10,
      vacuna,
      fecha_aplicacion: new Date(fecha),
      proxima_visita: new Date(proxVisita),
      edad,
      peso
    },
  });


  // return await prisma.usuario.create({
  //   data,
  // });
};
