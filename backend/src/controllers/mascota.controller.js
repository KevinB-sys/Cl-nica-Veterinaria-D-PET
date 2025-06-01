import { getAllMascotas, createNewMascota, getMascotasByDuenioId, getMascotaById, updateMascotaById, deleteMascotaById } from "../services/mascota.service.js";

export const getMascotas = async (req, res) => {
  try {
    const mascotas = await getAllMascotas();
    if (mascotas.length === 0) {
      return res.status(404).json({ message: "No hay carnet de vacunación registrados" });
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

export const getMascotasPorUsuario = async (req, res) => {
  try {
    // Obtenemos el duenio_id de los parámetros de la URL
    const { duenio_id } = req.params;

    // Validar si el duenio_id es válido o existe si es necesario
    if (!duenio_id) {
      return res.status(400).json({ message: "El ID del dueño es requerido." });
    }

    const mascotas = await getMascotasByDuenioId(duenio_id);

    if (mascotas.length === 0) {
      return res.status(404).json({ message: `No tienes ningun carnet de vacunación` });
    }

    res.status(200).json(mascotas);
  } catch (error) {
    res.status(500).json({ message: `Error al obtener las mascotas del usuario: ${error.message}` });
  }
};

export const getMascotaPorId = async (req, res) => {
  try {
    const { mascota_id } = req.params;

    if (!mascota_id) {
      return res.status(400).json({ message: "El ID de la mascota es requerido." });
    }

    const mascota = await getMascotaById(mascota_id);

    if (!mascota) {
      return res.status(404).json({ message: `No se encontró la mascota con ID ${mascota_id}` });
    }

    res.status(200).json(mascota);
  } catch (error) {
    res.status(500).json({ message: `Error al obtener la mascota: ${error.message}` });
  }
};

//Editar mascota por id ---
export const updateMascota = async (req, res) => {
  try {
    const { mascota_id } = req.params;

    if (!mascota_id) {
      return res.status(400).json({ message: "El ID de la mascota es requerido." });
    }

    const updatedMascota = await updateMascotaById(mascota_id, req.body);

    res.status(200).json({ message: "Mascota actualizada con éxito", updatedMascota });
  } catch (error) {
    res.status(400).json({ message: `Error al actualizar la mascota: ${error.message}` });
  }
};

//Eliminar mascota por id ---
export const deleteMascota = async (req, res) => {
  try {
    const { mascota_id } = req.params;

    if (!mascota_id) {
      return res.status(400).json({ message: "El ID de la mascota es requerido." });
    }

    await deleteMascotaById(mascota_id);

    res.status(200).json({ message: "Mascota eliminada con éxito" });
  } catch (error) {
    res.status(400).json({ message: `Error al eliminar la mascota: ${error.message}` });
  }
};