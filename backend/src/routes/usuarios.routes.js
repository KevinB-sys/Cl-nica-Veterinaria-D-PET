import express from "express";
import { getUsuarios, createUsuario, getUsuario, updateUsuarioController } from "../controllers/usuarios.controller.js";

const router = express.Router();

router.get("/", getUsuarios); // Obtener todos los usuarios
router.get("/:id", getUsuario); // Obtener un usuario por su ID (el ':id' indica un parámetro en la ruta)
router.post("/", createUsuario); // Crear un usuario
router.put("/:id", updateUsuarioController); // Actualizar un usuario por su ID

export default router;