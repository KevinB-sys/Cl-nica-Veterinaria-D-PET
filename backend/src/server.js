import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Importar rutas
import usuarioRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";
import mascotaRoutes from "./routes/mascota.routes.js";
import citaRoutes from "./routes/agendar.routes.js";
import vacunaRoutes from "./routes/vacuna.routes.js";

dotenv.config();

const app = express();
app.use(express.json()); // Para recibir JSON
app.use(cors()); // Habilitar CORS

// Configurar rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/auth", authRoutes); 
app.use("/api/mascotas", mascotaRoutes);
app.use("/api/citas", citaRoutes);
app.use("/api/vacunas", vacunaRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
