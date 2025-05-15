import prisma from "../prisma/prismaClient.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";

export const getAllUsuarios = async () => {
  return await prisma.usuario.findMany({
    select: { id: true, usuario_id: true,nombre: true, email: true },
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
