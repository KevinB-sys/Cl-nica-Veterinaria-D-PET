import { getAllvacuna, createNewVacuna, getVacunasByMascotaId } from "../services/vacuna.service.js";

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
    res.status(201).json({ message: "Vacuna registrada con exito" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getVacunasByMascota = async (req, res) => {
  try {
    const { mascotaId } = req.params; // Obtiene el ID de la mascota de los parámetros de la URL

    if (!mascotaId) {
      return res.status(400).json({ message: "Se requiere el ID de la mascota." });
    }

    const result = await getVacunasByMascotaId(mascotaId); // Llama a la función del servicio

    if (result.state === "success") {
      res.status(200).json(result.data); // Si es exitoso, envía los datos de las vacunas
    } else {
      res.status(500).json({ message: result.message }); // Si hay un error en el servicio
    }
  } catch (error) {
    console.error("Error en el controlador getVacunasByMascota:", error);
    res.status(500).json({ message: "Error interno del servidor al obtener las vacunas de la mascota." });
  }
};