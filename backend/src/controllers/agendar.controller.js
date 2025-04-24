import { getAllCitas, createNewCita } from "../services/agendar.service.js";

export const getCitas = async (req, res) => {
  try {
    const citas = await getAllCitas();
    res.json(citas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCita = async (req, res) => {
  try {
    const citas = await createNewCita(req.body);
    res.status(201).json({message: "Cita agendada con exito"} );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};