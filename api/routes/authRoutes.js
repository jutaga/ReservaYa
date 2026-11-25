import express from "express";
import { confirmarUsuario, registro, login } from "../controllers/authController.js";
import { validarLogin, validarRegistro } from "./validaciones/authValidaciones.js";
import { validarCampos } from "../middleware/validarCampos.js";

const router = express.Router();

// Express acepta arreglos de middlewares: validarRegistro se expande en sus 4 reglas.
// El orden importa: reglas (anotan errores) → validarCampos (responde 400 si hay) → controlador.
router.post("/registro", validarRegistro, validarCampos, registro);

router.post("/confirmar/:token", confirmarUsuario);

router.post("/login", validarLogin, validarCampos, login)

export default router;
