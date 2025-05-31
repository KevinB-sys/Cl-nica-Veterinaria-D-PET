import express from "express";
import { getCitas, createCita, getCitasByUser, updateExistingCita, deleteExistingCita, getTelefono } from "../controllers/agendar.controller.js";

const router = express.Router();

router.get("/", getCitas); // Obtener todas las citas
router.post("/", createCita); // Agendar cita
router.get("/usuario/:usuario_id", getCitasByUser); // Obtener citas por ID de usuario
router.put("/:cita_id", updateExistingCita); // Actualizar una cita por su ID
router.delete("/:cita_id", deleteExistingCita); // Eliminar una cita por su ID
router.get("/telefono/:usuario_id", getTelefono); // Obtener el teléfono del usuario por su ID

export default router;
