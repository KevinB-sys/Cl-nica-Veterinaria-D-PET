import express from "express";
import { getAllvacunas, createNewVacunas } from "../controllers/vacuna.controller.js";

const router = express.Router();

router.get("/", getAllvacunas); // Obtener todas las vacunas
router.post("/", createNewVacunas); // crear una nueva vacuna

export default router;