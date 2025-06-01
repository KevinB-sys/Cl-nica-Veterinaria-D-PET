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


//Obtener vacunación por ID de mascota
export const getVacunasByMascotaId = async (mascotaId) => {
  try {
    const vacunas = await prisma.vacunacion.findMany({
      where: {
        mascota_id: parseInt(mascotaId), // Filtra por el ID de la mascota
      },
      orderBy: {
        fecha_aplicacion: 'asc', // Opcional: Ordena las vacunas por fecha de aplicación
      },
    });
    return { state: "success", data: vacunas };
  } catch (error) {
    console.error("Error al obtener vacunas por mascota ID:", error);
    return { state: "error", message: "No se pudieron obtener las vacunas para esta mascota." };
  }
};


//Editar vacunación por ID
export const updateVacunaById = async (vacunaId, data) => {
  const { mascota_id, vacuna, fecha, proxVisita, edad, peso } = data;

  try {
    const updatedVacuna = await prisma.vacunacion.update({
      where: { vacunacion_id: vacunaId },
      data: {
        mascota: {
          connect: {
            mascota_id: mascota_id,
          },
        },
        vacuna,
        fecha_aplicacion: new Date(fecha),
        proxima_visita: new Date(proxVisita),
        edad,
        peso
      },
    });
    return { state: "success", data: updatedVacuna };
  } catch (error) {
    console.error("Error al actualizar la vacunación:", error);
    return { state: "error", message: "No se pudo actualizar la vacunación." };
  }
};

//Eliminar vacunación por ID
export const deleteVacunaById = async (vacunaId) => {
  try {
    await prisma.vacunacion.delete({
      where: { vacunacion_id: vacunaId },
    });
    return { state: "success", message: "Vacunación eliminada correctamente." };
  } catch (error) {
    console.error("Error al eliminar la vacunación:", error);
    return { state: "error", message: "No se pudo eliminar la vacunación." };
  }
};