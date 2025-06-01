import { getAllvacuna, createNewVacuna, getVacunasByMascotaId, updateVacunaById, deleteVacunaById } from "../services/vacuna.service.js";

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

//Editar vacunación por ID
export const updateVacuna = async (req, res) => {
  const { vacunaId } = req.params;
  try {
    const updatedVacuna = await updateVacunaById(vacunaId, req.body);
    res.status(200).json({ message: "Vacuna actualizada con éxito", data: updatedVacuna });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Eliminar vacunación por ID
export const deleteVacuna = async (req, res) => {
  const { vacunaId } = req.params;
  try {
    const result = await deleteVacunaById(vacunaId);
    if (result.state === "success") {
      res.status(200).json({ message: "Vacuna eliminada con éxito" });
    } else {
      res.status(500).json({ message: result.message });
    }
  } catch (error) {
    console.error("Error al eliminar la vacuna:", error);
    res.status(500).json({ message: "Error interno del servidor al eliminar la vacuna." });
  }
};