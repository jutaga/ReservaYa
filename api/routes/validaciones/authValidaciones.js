import { body } from "express-validator";

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
    .toLowerCase(),

  body("password")
    .exists({ values: "null" })
    .withMessage("La contraseña es obligatoria")
    .bail()
    .isString()
    .withMessage("La contraseña debe ser texto")
    .bail()
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Mínimo 8 caracteres")
    .bail()
    .matches(/^\S+$/)
    .withMessage("La contraseña no puede contener espacios"),

  body("telefono")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("Formato de teléfono no válido")
    .bail()
    .trim()
    .matches(/^\d{7,15}$/)
    .withMessage("El teléfono debe tener solo dígitos (entre 7 y 15)"),
];
