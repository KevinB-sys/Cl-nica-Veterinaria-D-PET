import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient.js";
import { v4 as uuidv4 } from 'uuid';

export const register = async (data) => {
  const { nombre, email, password, telefono, whatsapp, direccion } = data;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("El correo ya está registrado");
    }

    const usuarioId = uuidv4();

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario en la base de datos
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        usuario_id: usuarioId,
        nombre,
        email,
        password: hashedPassword,
        telefono,
        whatsapp,
        direccion,
        fecha_registro: new Date(),
        rol_id: 2, // Valor predeterminado de rol cliente
      },
    });

    return nuevoUsuario; // Devuelves el nuevo usuario creado
  } catch (error) {
    throw new Error(error.message || "Error al registrar el usuario");
  }
};

export const loginUser = async (data) => {
  const { email, password } = data;

  try {
    // Buscar usuario por email
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      throw new Error("Credenciales incorrectas");
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      throw new Error("Credenciales incorrectas");
    }

    // Generar JWT
    const token = jwt.sign(
      { usuario_id: usuario.usuario_id, rol_id: usuario.rol_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token válido por 1 horas
    );

    return token; // Devuelves el token generado
  } catch (error) {
    throw new Error(error.message || "Error al iniciar sesión");
  }
};
export const logoutUser = () => {
  localStorage.removeItem('token');
};
