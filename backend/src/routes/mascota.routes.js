import express from "express";
import { getMascotas, createMascotas, getMascotasPorUsuario, getMascotaPorId } from "../controllers/mascota.controller.js";

const router = express.Router();

router.get("/", getMascotas); // Obtener todas las mascotas
router.post("/", createMascotas); // Crear mascota
router.get("/:mascota_id", getMascotaPorId); // Obtener mascota por ID
// Nueva ruta para obtener mascotas por duenio_id
router.get("/usuario/:duenio_id", getMascotasPorUsuario);


export default router;