import express from "express";
import { getAllvacunas, createNewVacunas, getVacunasByMascota, updateVacuna, deleteVacuna } from "../controllers/vacuna.controller.js";

const router = express.Router();

router.get("/", getAllvacunas); // Obtener todas las vacunas
router.post("/", createNewVacunas); // crear una nueva vacuna
router.get("/:mascotaId", getVacunasByMascota); // Obtener vacunas por ID de mascota
router.put("/:vacunaId", updateVacuna); // Editar vacunación por ID
router.delete("/:vacunaId", deleteVacuna); // Eliminar vacunación por ID

export default router;