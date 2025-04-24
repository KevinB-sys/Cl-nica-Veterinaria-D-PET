import { loginUser, register } from "../services/auth.service.js";

// 📌 REGISTRAR USUARIO
export const registerUsuario = async (req, res) => {
  try {
    const newUser = await register(req.body); // Esperamos la respuesta del servicio

    // Si se registra correctamente, respondemos al cliente
    res.status(201).json({
      message: "Usuario registrado con éxito",
      state: "success"
    });
  } catch (error) {
    // Si hay un error, lo manejamos aquí
    res.status(500).json({
      message: "Error al registrar usuario",
      error: error.message,
      state: "error",
    });
  }
};

// 📌 LOGIN DE USUARIO
export const loginUsuario = async (req, res) => {
  try {
    const token = await loginUser(req.body); // Esperamos la respuesta del servicio

    // Si el login es exitoso, respondemos con el token
    res.json({
      message: "Login exitoso",
      token,
      state: "success",
    });
  } catch (error) {
    // Si hay un error, lo manejamos aquí
    res.status(500).json({
      message: "Error en el servidor",
      error: error.message,
      state: "error",
    });
  }
};
