import express from "express";
import { getUsuarios, createUsuario } from "../controllers/usuarios.controller.js";

const router = express.Router();

router.get("/", getUsuarios); // Obtener todos los usuarios
router.post("/", createUsuario); // Crear un usuario

export default router;
