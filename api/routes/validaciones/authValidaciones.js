import { body } from "express-validator";

// ── Reglas compartidas ─────────────────────────────────────────────
// Son funciones: cada llamada crea una regla NUEVA.
// Así, si a una le añades algo (como en el registro), no cambia en las demás.

// Email: obligatorio, texto, formato válido y en minúsculas.
// Igual en registro y login: el login DEBE pasar a minúsculas
// para encontrar el email tal como se guardó.
const reglaEmail = () =>
  body("email")
    .exists({ values: "null" })
    .withMessage("El email es obligatorio")
    .bail()
    .isString()
    .withMessage("El email debe ser texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .bail()
    .isEmail()
    .withMessage("Email no válido")
    .bail()
    .toLowerCase();

// Contraseña: solo obligatoria y texto.
const reglaPassword = () =>
  body("password")
    .exists({ values: "null" })
    .withMessage("La contraseña es obligatoria")
    .bail()
    .isString()
    .withMessage("La contraseña debe ser texto")
    .bail()
    .notEmpty()
    .withMessage("La contraseña es obligatoria");

const reglaPasswordNueva = () =>
  reglaPassword()
    .bail()
    .isLength({ min: 8 })
    .withMessage("Mínimo 8 caracteres")
    .bail()
    .matches(/^\S+$/)
    .withMessage("La contraseña no puede contener espacios");

// ── Registro ───────────────────────────────────────────────────────
export const validarRegistro = [
  body("nombre")
    .exists({ values: "null" })
    .withMessage("El nombre es obligatorio")
    .bail()
    .isString()
    .withMessage("El nombre debe ser texto")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isLength({ max: 60 })
    .withMessage("Máximo 60 caracteres"),

  reglaEmail(),

  reglaPasswordNueva(),

  body("telefono")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("Formato de teléfono no válido")
    .bail()
    .trim()
    .matches(/^\d{7,15}$/)
    .withMessage("El teléfono debe tener solo dígitos (entre 7 y 15)"),
];

export const validarLogin = [reglaEmail(), reglaPassword()];

export const validarOlvidePassword = [reglaEmail()];

export const validarResetPassword = [reglaPasswordNueva()];
