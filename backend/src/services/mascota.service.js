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

//listar mascotas por duenio_id ---
export const getMascotasByDuenioId = async (duenio_id) => {
  return await prisma.mascota.findMany({
    where: {
      duenio_id: duenio_id,
    },
  });
};


//listar mascotas por id ---
export const getMascotaById = async (mascota_id) => {
  const id = parseInt(mascota_id, 10);
  if (isNaN(id)) {
    throw new Error("mascota_id debe ser un entero");
  }
  return await prisma.mascota.findUnique({
    where: {
      mascota_id: id,
    },
  });
};

//Editar mascota por id ---
export const updateMascotaById = async (mascota_id, data) => {
  const id = parseInt(mascota_id, 10);
  if (isNaN(id)) {
    throw new Error("mascota_id debe ser un entero");
  }
  return await prisma.mascota.update({
    where: {
      mascota_id: id,
    },
    data,
  });
};


// Eliminar mascota por id ---
export const deleteMascotaById = async (mascota_id) => {
  const id = parseInt(mascota_id, 10);
  if (isNaN(id)) {
    throw new Error("mascota_id debe ser un entero");
  }
  return await prisma.mascota.delete({
    where: {
      mascota_id: id,
    },
  });
};