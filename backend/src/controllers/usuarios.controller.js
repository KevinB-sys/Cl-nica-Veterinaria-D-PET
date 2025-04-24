import { getAllUsuarios, createNewUsuario } from "../services/usuarios.service.js";

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const usuario = await createNewUsuario(req.body);
    res.status(201).json({message: "usuario creado"} );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
