import js from "@eslint/js";
import globals from "globals";

export default [
  // Reglas recomendadas: no-undef (variables/imports que faltan), no-unused-vars, etc.
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node, // process, console, Buffer... existen en Node
    },
    rules: {
      // Express necesita los 4 parámetros (err, req, res, next) para reconocer un manejador
      // de errores, aunque no se use next.
      "no-unused-vars": ["error", { argsIgnorePattern: "^next$" }],
      // catch {} vacío a propósito: p. ej. en logout un JWT inválido se ignora y se borra la cookie igual.
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
];
