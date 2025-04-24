import express from "express";
import { registerUsuario, loginUsuario } from "../controllers/auth.controller.js";
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

export default router;
