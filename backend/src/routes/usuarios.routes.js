import express from "express";
import { getUsuarios, createUsuario, getUsuario, updateUsuarioController, getUsuarioByUsuarioIdController, getWhatsappByUsuarioIdController } from "../controllers/usuarios.controller.js";

const router = express.Router();

router.get("/", getUsuarios); // Obtener todos los usuarios
router.get("/:id", getUsuario); // Obtener un usuario por su ID (el ':id' indica un parámetro en la ruta)
router.post("/", createUsuario); // Crear un usuario
router.put("/:id", updateUsuarioController); // Actualizar un usuario por su ID
router.get("/usuario/:usuario_id", getUsuarioByUsuarioIdController); // Buscar usuario por usuario_id
router.get("/whatsapp/:usuario_id", getWhatsappByUsuarioIdController); // Obtener el whatsapp de un usuario por su usuario_id

export default router;