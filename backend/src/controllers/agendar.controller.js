import { getAllCitas, createNewCita, getCitasByUserId, updateCita, deleteCita, getTelefonoByUserId } from "../services/agendar.service.js";

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
export const getCitasByUser = async (req, res) => {
    try {
        const { usuario_id } = req.params; // Obtenemos el usuario_id de los parámetros de la URL
        const citas = await getCitasByUserId(usuario_id);
        // if (citas.length === 0) {
        //     return res.status(404).json({ message: "No se encontraron citas para este usuario." });
        // }
        res.json(citas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateExistingCita = async (req, res) => {
    try {
        const { cita_id } = req.params; // Obtenemos el cita_id de los parámetros de la URL
        const updatedData = req.body; // Los datos a actualizar vienen en el cuerpo de la solicitud
        const updatedCita = await updateCita(cita_id, updatedData);
        if (!updatedCita) {
            return res.status(404).json({ message: "Cita no encontrada." });
        }
        res.json({ message: "Cita actualizada con éxito", cita: updatedCita });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteExistingCita = async (req, res) => {
    try {
        const { cita_id } = req.params; // Obtenemos el cita_id de los parámetros de la URL
        const deletedCita = await deleteCita(cita_id);
        if (!deletedCita) {
            return res.status(404).json({ message: "Cita no encontrada." });
        }
        res.json({ message: "Cita eliminada con éxito", cita: deletedCita });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Para obtener el teléfono del usuario por su ID
export const getTelefono = async (req, res) => {
  try {
    const { usuario_id } = req.params; // Obtenemos el usuario_id de los parámetros de la URL
    const telefono = await getTelefonoByUserId(usuario_id);
    if (!telefono) {
      return res.status(404).json({ message: "Teléfono no encontrado para este usuario." });
    }
    res.json(telefono);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};