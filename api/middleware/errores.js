// 404: ninguna ruta anterior respondió a esta petición.
// Se registra en index.js DESPUÉS de todas las rutas: si la petición llega aquí, es que la ruta no existe.
export const noEncontrado = (req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
};

// Manejador de errores para cualquier código (4xx y 5xx).
// Express lo reconoce porque recibe 4 parámetros (err primero).
// No usamos req ni next, pero hay que declararlos: si quitas uno, Express ya no lo trata como manejador de errores.
export const manejarErrores = (err, req, res, next) => {
  // El error completo (con stack) solo va a la consola del servidor; el cliente nunca lo ve
  console.error("❌", err);

  // Si el error trae su propio código se respeta; si no, es un fallo nuestro: 500.
  // Ejemplos: express.json() pone 400 (JSON mal formado) o 413 (body muy grande);
  // también vale para errores propios con err.status = 404, 409, etc.
  const status = err.status || err.statusCode || 500;

  // Decidir qué mensaje ve el cliente.
  // El orden importa: el caso particular (JSON mal formado) va antes que el general (4xx),
  // porque también es un 4xx y si no, lo atraparía el segundo if.
  let mensaje;

  if (err.type === "entity.parse.failed") {
    // Excepción: JSON mal formado (400). Su err.message viene de JSON.parse,
    // es técnico y puede incluir parte del body, así que ponemos uno propio (ver #56).
    mensaje = "El cuerpo no es JSON válido";
  } else if (status < 500) {
    // 4xx: el error es del cliente. Le mostramos el mensaje real para que sepa qué corregir.
    mensaje = err.message;
  } else {
    // 5xx: el error es nuestro (BD caída, bug...). Nunca mostrar el detalle:
    // podría revelar tablas, rutas de archivos, etc. Ya quedó en la consola.
    mensaje = "Error interno del servidor";
  }

  res.status(status).json({ error: mensaje });
};
