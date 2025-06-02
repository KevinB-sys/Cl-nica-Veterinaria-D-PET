import { getAllUsuarios, createNewUsuario, getUsuarioById, updateUsuario, getUsuarioByUsuarioId } from "../services/usuarios.service.js";

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

export const getUsuario = async (req, res) => {
  try {
    const { id } = req.params; // Obtenemos el 'id' de los parámetros de la ruta
    const usuario = await getUsuarioById(id);

    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUsuarioController = async (req, res) => {
  try {
    const { id } = req.params; // Obtenemos el 'id' de los parámetros de la ruta
    const usuarioActualizado = await updateUsuario(id, req.body);

    if (usuarioActualizado) {
      res.json({ message: "Usuario actualizado correctamente", data: usuarioActualizado });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Buscar usuario por usuario_id
export const getUsuarioByUsuarioIdController = async (req, res) => {
  try {
    const { usuario_id } = req.params; // Obtenemos el 'usuario_id' de los parámetros de la ruta
    const usuario = await getUsuarioByUsuarioId(usuario_id);

    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};