import prisma from "../prisma/prismaClient.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";

export const getAllUsuarios = async () => {
  return await prisma.usuario.findMany({
    select: { id: true, usuario_id: true, nombre: true, email: true },
  });
};

export const getUsuarioById = async (id) => {
  return await prisma.usuario.findUnique({
    where: {
      usuario_id: id, // Busca por el usuario_id (UUID)
    },
    select: { id: true, usuario_id: true, nombre: true, email: true, telefono: true, whatsapp: true, direccion: true, fecha_registro: true, rol_id: true },
  });
};


export const createNewUsuario = async (data) => {
  const { nombre, email, password, telefono, whatsapp, direccion } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const usuarioId = uuidv4();
  const now = new Date();

  return await prisma.usuario.create({
    data: {
      usuario_id: usuarioId,
      nombre,
      email,
      password: hashedPassword,
      telefono,
      whatsapp,
      direccion,
      fecha_registro: now,
      rol_id: 2, // Valor predeterminado de rol cliente
    },
  });


  // return await prisma.usuario.create({
  //   data,
  // });
};

export const updateUsuario = async (id, newData) => {
  const { nombre, email, password, telefono, whatsapp, direccion } = newData;

  const dataToUpdate = {
    nombre,
    email,
    telefono,
    whatsapp,
    direccion,
  };

  // Si se proporciona una nueva contraseña, la hasheamos
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    dataToUpdate.password = hashedPassword;
  }

  return await prisma.usuario.update({
    where: {
      usuario_id: id,
    },
    data: dataToUpdate,
  });
};

//Buscar nombre de usuario por usuario_id
export const getUsuarioByUsuarioId = async (usuario_id) => {
  return await prisma.usuario.findUnique({
    where: {
      usuario_id: usuario_id, // Busca por el usuario_id (UUID)
    },
    select: { id: true, usuario_id: true, nombre: true, email: true },
  });
};


//Obtiene el whatsapp de un usuario por su usuario_id
export const getWhatsappByUsuarioId = async (usuario_id) => {
  const usuario = await prisma.usuario.findUnique({
    where: {
      usuario_id: usuario_id, // Busca por el usuario_id (UUID)
    },
    select: { whatsapp: true },
  });

  return usuario ? usuario.whatsapp : null;
};

