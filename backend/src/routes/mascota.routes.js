import express from "express";
import { getMascotas, createMascotas } from "../controllers/mascota.controller.js";

const router = express.Router();

router.get("/", getMascotas); // Obtener todas las mascotas
router.post("/", createMascotas); // Crear mascota

export default router;
