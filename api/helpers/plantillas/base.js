// Base compartida por los correos que llevan al usuario a un enlace (confirmar cuenta, restablecer contraseña...).
// Cada plantilla solo pone sus textos; el maquetado vive aquí para que todos los correos se vean igual.
// Devuelve las dos versiones que pide nodemailer: html y text (para clientes que no muestran HTML).
//
// Reglas de HTML para correos (distintas a una página web):
// - Se maqueta con <table>: Outlook y otros clientes ignoran flex y grid.
// - Los estilos van en línea (style="..."): muchos clientes borran <style> y no cargan CSS externo.
// - Ancho máximo de 600px: es el estándar para que se vea bien en escritorio y móvil.

import { color, escaparHtml, fuente } from "./utils.js";

/**
 * @param {object} opciones
 * @param {string} opciones.titulo      Encabezado de la tarjeta y <title>.
 * @param {string} opciones.previa      Texto que se ve junto al asunto en la bandeja de entrada.
 * @param {string} opciones.nombre      Nombre del usuario (se escapa).
 * @param {string[]} opciones.parrafos  Párrafos entre el saludo y el botón.
 * @param {string} opciones.textoBoton  Texto del botón.
 * @param {string} opciones.enlace      URL del botón.
 * @param {string} opciones.textoEnlace Frase que precede al enlace en la versión de texto plano.
 * @param {string} opciones.pie         Nota bajo la tarjeta.
 */
export const crearEmailConEnlace = ({ titulo, previa, nombre, parrafos, textoBoton, enlace, textoEnlace, pie }) => {
  const e = {
    titulo: escaparHtml(titulo),
    previa: escaparHtml(previa),
    nombre: escaparHtml(nombre),
    textoBoton: escaparHtml(textoBoton),
    enlace: escaparHtml(enlace),
    pie: escaparHtml(pie),
  };

  const htmlParrafos = parrafos
    .map(
      (parrafo) => `
              <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">
                ${escaparHtml(parrafo)}
              </p>`,
    )
    .join("");

  const html = `
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e.titulo}</title>
</head>
<body style="margin:0; padding:0; background-color:${color.fondo};">

  <!-- Texto de vista previa: lo que se ve junto al asunto en la bandeja de entrada (oculto en el correo) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    ${e.previa}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${color.fondo};">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

          <!-- Logo / nombre de la app -->
          <tr>
            <td style="padding:0 0 20px; font-family:${fuente}; font-size:22px; font-weight:700; color:${color.primario};">
              ReservaYa
            </td>
          </tr>

          <!-- Tarjeta -->
          <tr>
            <td style="background-color:${color.tarjeta}; border:1px solid ${color.borde}; border-radius:12px; padding:32px; font-family:${fuente}; color:${color.texto};">

              <h1 style="margin:0 0 16px; font-size:22px; line-height:1.3;">${e.titulo}</h1>

              <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">
                Hola ${e.nombre},
              </p>
              ${htmlParrafos}

              <!-- Botón: hecho con tabla porque Outlook no respeta padding ni border-radius en un <a> suelto -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;">
                <tr>
                  <td align="center" bgcolor="${color.primario}" style="border-radius:8px;">
                    <a href="${e.enlace}" target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:${fuente}; font-size:16px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:8px;">
                      ${e.textoBoton}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Enlace de respaldo: por si el botón no se ve o el cliente bloquea el clic -->
              <p style="margin:0 0 8px; font-size:14px; line-height:1.6; color:${color.textoSuave};">
                Si el botón no funciona, copia y pega este enlace en tu navegador:
              </p>
              <p style="margin:0; font-size:14px; line-height:1.6; word-break:break-all;">
                <a href="${e.enlace}" target="_blank" style="color:${color.primario};">${e.enlace}</a>
              </p>

            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td style="padding:20px 8px 0; font-family:${fuente}; font-size:13px; line-height:1.6; color:${color.textoSuave};">
              ${e.pie}
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

  // Versión de texto plano: sin escapar, porque aquí no se interpreta HTML
  const text = `Hola ${nombre},

${parrafos.join("\n\n")}

${textoEnlace}
${enlace}

${pie}`;

  return { html, text };
};
