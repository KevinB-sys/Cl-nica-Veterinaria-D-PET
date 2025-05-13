import { loginUser, register, sendPasswordReset, resetPassword } from "../services/auth.service.js";

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

// 📌 ENVIAR CORREO DE RECUPERACIÓN
export const enviarCorreoRecuperacion = async (req, res) => {
  try {
    const { email } = req.body;

    // Ejecuta y captura el resultado si es necesario
    const resultado = await sendPasswordReset(email);

    res.status(200).json({
      message: resultado.message || "Enlace de restablecimiento enviado al correo",
      state: "success",
    });
  } catch (error) {
    // Devuelve el mensaje de error más claro y personalizado desde sendPasswordReset
    res.status(500).json({
      message: error.message || "Error al enviar el correo",
      state: "error",
    });
  }
};

// 📌 RESTABLECER CONTRASEÑA
export const restablecerContrasena = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    await resetPassword(token, newPassword);

    res.status(200).json({
      message: "Contraseña restablecida correctamente",
      state: "success",
    });
  } catch (error) {
    res.status(400).json({
      message: "No se pudo restablecer la contraseña",
      error: error.message,
      state: "error",
    });
  }
};
