import { validationResult } from "express-validator";

export const validarCampos = (req, res, next) => {
  const resultado = validationResult(req); // recoge lo que anotaron las reglas

  if (!resultado.isEmpty()) {
    const errores = resultado.array().map((e) => ({
      campo: e.path, // en la v7 es "path" (en la v6 era "param")
      mensaje: e.msg,
    }));
    return res.status(400).json({ errores });
  }

  next(); // sin errores: sigue al controlador
};
