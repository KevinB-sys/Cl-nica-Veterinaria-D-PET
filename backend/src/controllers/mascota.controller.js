import { getAllMascotas, createNewMascota } from "../services/mascota.service.js";

export const getMascotas = async (req, res) => {
  try {
    const mascotas = await getAllMascotas();
    if (mascotas.length === 0) {
      return res.status(404).json({ message: "No hay mascotas registradas." });
    }
    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ message: `Error al obtener mascotas: ${error.message}` });
  }
};

export const createMascotas = async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.raza) {
      return res.status(400).json({ message: "Nombre y raza son obligatorios." });
    }

    const mascota = await createNewMascota(req.body);
    res.status(201).json({ message: "Mascota registrada con éxito", mascota });
  } catch (error) {
    res.status(400).json({ message: `Error al crear la mascota: ${error.message}` });
  }
};
