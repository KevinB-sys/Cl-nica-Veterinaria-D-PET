import express from "express";
import { registerUsuario, loginUsuario, enviarCorreoRecuperacion, restablecerContrasena } from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { handleInputErrors } from "../middlewares/handleInputErrors.js";

const router = express.Router();

// 📌 Ruta para registrar usuario
router.post(
  "/register",
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("email").isEmail().withMessage("Debe ser un email válido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  handleInputErrors,
  registerUsuario
);

// 📌 Ruta para loguear usuario
router.post("/login",
  [
    body("email").isEmail().withMessage("Debe ser un email válido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  handleInputErrors,
  loginUsuario);

// 📌 Ruta para enviar enlace de restablecimiento de contraseña
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Debe ser un email válido")],
  handleInputErrors,
  enviarCorreoRecuperacion
);

// 📌 Ruta para restablecer contraseña con token
router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("El token es requerido"),
    body("newPassword").isLength({ min: 6 }).withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
  ],
  handleInputErrors,
  restablecerContrasena
);

export default router;
