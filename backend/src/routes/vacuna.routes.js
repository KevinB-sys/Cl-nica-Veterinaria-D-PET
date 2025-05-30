import express from "express";
import { getAllvacunas, createNewVacunas, getVacunasByMascota } from "../controllers/vacuna.controller.js";

const router = express.Router();

router.get("/", getAllvacunas); // Obtener todas las vacunas
router.post("/", createNewVacunas); // crear una nueva vacuna
router.get("/:mascotaId", getVacunasByMascota); // Obtener vacunas por ID de mascota

export default router;