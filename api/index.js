import db from "./config/db.js";
import cookieParser from "cookie-parser";
import express from "express";
import router from "./routes/routes.js";
import { noEncontrado, manejarErrores } from "./middleware/errores.js";

//Crear el servidor
const app = express();

//habilitar Cookie Parser
app.use(cookieParser());
app.use(express.json());

try {
  await db.authenticate();
  console.log("✅ Conectado a MySQL");
} catch (error) {
  console.error("❌ No se pudo conectar a MySQL:", error.message);
  process.exit(1);
}

//Routing

//Definir un puerto y arrancar el servidor
const PORT = Number(process.env.PORT) || 3000; // usa 3000 si PORT no está en el .env

app.use("/api/", router);

// Manejo de errores: SIEMPRE después de todas las rutas
app.use(noEncontrado); // 404 si ninguna ruta respondió
app.use(manejarErrores); // 500 si alguna ruta lanzó un error

app.listen(PORT, (error) => {
  if (error) {
    // ¿falló el arranque?
    if (error.code === "EADDRINUSE") {
      // código de Node para "puerto ocupado"
      console.error(`❌ El puerto ${PORT} ya está en uso...`);
    } else {
      console.error("❌ No se pudo iniciar el servidor:", error.message);
    }
    process.exit(1); // se cierra con error, igual que con MySQL
  }

  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`); // solo si arrancó bien
});

