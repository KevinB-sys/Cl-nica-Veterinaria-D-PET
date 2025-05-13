import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient.js";
import { v4 as uuidv4 } from 'uuid';
//Para recuperacion de contraseña por correo
import crypto from "crypto";
import nodemailer from "nodemailer";

import dotenv from 'dotenv';
dotenv.config();

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

//Aqui recueporacion de contraseña 

export const sendPasswordReset = async (email) => {
  try {
    console.log("Buscando usuario...");
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      console.log("Usuario no encontrado");
      throw new Error("No existe un usuario con ese correo");
    }

    console.log("Generando token...");
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.usuario.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    console.log("Configurando transporter...");
    // const transporter = nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 588, // Puerto correcto para STARTTLS
      secure: false, // No SSL, usa STARTTLS
      auth: {
        user: "73347aea8efce8",  // Tu usuario
        pass: "1953c42fef8962"   // Tu contraseña
      }
    });
    const resetUrl = `http://localhost:5173/Reset?token=${token}`;
    console.log("Enviando correo...");
    await transporter.sendMail({
      from: '"Veterinaria D´Pets" <no-reply@dpets.com>',
      to: email,
      subject: "Recuperación de contraseña",
      html: `
        <h3>Recuperar Contraseña</h3>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    console.log("Correo enviado con éxito");
    return { message: "Enlace de recuperación enviado a tu correo" };
  } catch (error) {
    console.error("Error completo:", error); // 👈 esto te mostrará el fallo exacto
    throw new Error(error.message || "Error al enviar enlace de recuperación");
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const user = await prisma.usuario.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new Error("Token inválido o expirado");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.usuario.update({
      where: { usuario_id: user.usuario_id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: "Contraseña restablecida correctamente" };
  } catch (error) {
    throw new Error(error.message || "Error al restablecer contraseña");
  }
};