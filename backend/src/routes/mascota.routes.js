import express from "express";
import { getMascotas, createMascotas, getMascotasPorUsuario, getMascotaPorId, deleteMascota, updateMascota } from "../controllers/mascota.controller.js";

const router = express.Router();

router.get("/", getMascotas); // Obtener todas las mascotas
router.post("/", createMascotas); // Crear mascota
router.get("/:mascota_id", getMascotaPorId); // Obtener mascota por ID
// Nueva ruta para obtener mascotas por duenio_id
router.get("/usuario/:duenio_id", getMascotasPorUsuario);
router.put("/:mascota_id", updateMascota); // Actualizar mascota por ID
router.delete("/:mascota_id", deleteMascota); // Eliminar mascota por ID


export default router;