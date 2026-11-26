// Plantilla del correo para restablecer la contraseña. El maquetado está en ./base.js.
import { crearEmailConEnlace } from "./base.js";

export const plantillaOlvidePassword = ({ nombre, enlace }) =>
  crearEmailConEnlace({
    titulo: "Restablece tu contraseña",
    previa: "Elige una nueva contraseña para tu cuenta de ReservaYa.",
    nombre,
    parrafos: [
      "Recibimos una solicitud para restablecer la contraseña de tu cuenta en ReservaYa.",
      "Haz clic en el botón para elegir una nueva.",
    ],
    textoBoton: "Restablecer contraseña",
    enlace,
    textoEnlace: "Restablece tu contraseña en este enlace:",
    pie: "Si no pediste cambiar tu contraseña, ignora este mensaje: tu contraseña actual sigue funcionando.",
  });
