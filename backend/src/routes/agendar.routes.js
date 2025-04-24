import express from "express";
import { getCitas, createCita } from "../controllers/agendar.controller.js";

const router = express.Router();

router.get("/", getCitas); // Obtener todas las citas
router.post("/", createCita); // Agendar cita

export default router;
