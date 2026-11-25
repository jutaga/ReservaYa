// Plantilla del correo de confirmación de cuenta.
// Devuelve las dos versiones que pide nodemailer: html y text (para clientes que no muestran HTML).
//
// Reglas de HTML para correos (distintas a una página web):
// - Se maqueta con <table>: Outlook y otros clientes ignoran flex y grid.
// - Los estilos van en línea (style="..."): muchos clientes borran <style> y no cargan CSS externo.
// - Ancho máximo de 600px: es el estándar para que se vea bien en escritorio y móvil.

// El nombre lo escribe el usuario: se escapa para que no pueda meter HTML en el correo.
const escaparHtml = (texto) =>
  String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Colores tomados de client/src/styles.css para que el correo se parezca a la app
const color = {
  fondo: "#f6f8f7",
  tarjeta: "#ffffff",
  borde: "#dde5e2",
  texto: "#0f1f1c",
  textoSuave: "#5b6b67",
  primario: "#0f766e",
};

const fuente = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const plantillaConfirmarCuenta = ({ nombre, enlace }) => {
  const nombreSeguro = escaparHtml(nombre);

  const html = `
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Confirma tu cuenta</title>
</head>
<body style="margin:0; padding:0; background-color:${color.fondo};">

  <!-- Texto de vista previa: lo que se ve junto al asunto en la bandeja de entrada (oculto en el correo) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
    Confirma tu cuenta para empezar a reservar.
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

              <h1 style="margin:0 0 16px; font-size:22px; line-height:1.3;">Confirma tu cuenta</h1>

              <p style="margin:0 0 16px; font-size:16px; line-height:1.6;">
                Hola ${nombreSeguro},
              </p>
              <p style="margin:0 0 24px; font-size:16px; line-height:1.6;">
                Gracias por registrarte en ReservaYa. Tu cuenta está casi lista: solo falta que confirmes tu email.
              </p>

              <!-- Botón: hecho con tabla porque Outlook no respeta padding ni border-radius en un <a> suelto -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center" bgcolor="${color.primario}" style="border-radius:8px;">
                    <a href="${enlace}" target="_blank"
                       style="display:inline-block; padding:14px 28px; font-family:${fuente}; font-size:16px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:8px;">
                      Confirmar mi cuenta
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Enlace de respaldo: por si el botón no se ve o el cliente bloquea el clic -->
              <p style="margin:0 0 8px; font-size:14px; line-height:1.6; color:${color.textoSuave};">
                Si el botón no funciona, copia y pega este enlace en tu navegador:
              </p>
              <p style="margin:0; font-size:14px; line-height:1.6; word-break:break-all;">
                <a href="${enlace}" target="_blank" style="color:${color.primario};">${enlace}</a>
              </p>

            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td style="padding:20px 8px 0; font-family:${fuente}; font-size:13px; line-height:1.6; color:${color.textoSuave};">
              Si no creaste una cuenta en ReservaYa, puedes ignorar este mensaje.
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

Gracias por registrarte en ReservaYa. Tu cuenta está casi lista: solo falta que confirmes tu email.

Confirma tu cuenta en este enlace:
${enlace}

Si no creaste una cuenta en ReservaYa, puedes ignorar este mensaje.`;

  return { html, text };
};
