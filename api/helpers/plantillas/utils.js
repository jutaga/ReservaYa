// Utilidades compartidas por las plantillas de correo.

export const escaparHtml = (texto) =>
  String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const color = {
  fondo: "#f6f8f7",
  tarjeta: "#ffffff",
  borde: "#dde5e2",
  texto: "#0f1f1c",
  textoSuave: "#5b6b67",
  primario: "#0f766e",
};

export const fuente = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
