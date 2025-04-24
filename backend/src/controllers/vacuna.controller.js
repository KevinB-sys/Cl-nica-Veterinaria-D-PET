import { getAllvacuna, createNewVacuna } from "../services/vacuna.service.js";

export const getAllvacunas = async (req, res) => {
  try {
    const vacuna = await getAllvacuna();
    res.json(vacuna);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNewVacunas = async (req, res) => {
  try {
    const vacuna = await createNewVacuna(req.body);
    res.status(201).json({message: "Vacuna registrada con exito"} );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};