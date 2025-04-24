import prisma from "../prisma/prismaClient.js";

export const getAllMascotas = async () => {
    return await prisma.mascota.findMany({
        // select: { id: true, nombre: true, email: true },
    });
};

export const createNewMascota = async (data) => {
  const { nombre, especie, raza, sexo, duenio_id, fecha_nacimiento } = data;
  const now = new Date();

  return await prisma.mascota.create({
    data: {
      nombre,
      especie,
      raza,
      sexo,
      duenio_id,
      fecha_registro: now,
      fecha_nacimiento: new Date(fecha_nacimiento)
    },
  });


  // return await prisma.usuario.create({
  //   data,
  // });
};
  