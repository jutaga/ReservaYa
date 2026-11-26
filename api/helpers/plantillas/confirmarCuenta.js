
import { crearEmailConEnlace } from "./base.js";

export const plantillaConfirmarCuenta = ({ nombre, enlace }) =>
  crearEmailConEnlace({
    titulo: "Confirma tu cuenta",
    previa: "Confirma tu cuenta para empezar a reservar.",
    nombre,
    parrafos: ["Gracias por registrarte en ReservaYa. Tu cuenta está casi lista: solo falta que confirmes tu email."],
    textoBoton: "Confirmar mi cuenta",
    enlace,
    textoEnlace: "Confirma tu cuenta en este enlace:",
    pie: "Si no creaste una cuenta en ReservaYa, puedes ignorar este mensaje.",
  });
