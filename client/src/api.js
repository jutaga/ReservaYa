// Cliente de la API. Todo pasa por aquí, así que es el único sitio que
// conoce el contrato: { error } / { errores: [{ campo, mensaje }] }.

export class ApiError extends Error {
  constructor(status, message, { errores = [], contrato = null } = {}) {
    super(message);
    this.status = status; // 0 = la API no responde
    this.errores = errores;
    this.contrato = contrato; // aviso para el backend si la respuesta no cumple el contrato
  }
}

export async function api(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw offline();
  }

  const tipo = res.headers.get("content-type") || "";
  const data = tipo.includes("application/json") ? await res.json().catch(() => null) : null;

  // Si la API no está levantada, el proxy de Vite responde 5xx en texto plano.
  // (Un 500 en HTML sí viene de tu API: es el manejador de errores por defecto de Express.)
  if (!data && res.status >= 500 && !tipo.includes("html")) throw offline();

  if (res.ok) {
    if (data === null && res.status !== 204) {
      console.warn(`[contrato] ${method} /api${path} respondió ${res.status} sin JSON`);
    }
    return data ?? {};
  }

  if (!data) {
    throw new ApiError(res.status, `La API respondió ${res.status} sin JSON.`, {
      contrato: `${method} /api${path} debería responder JSON (por ejemplo { "error": "..." }), no ${tipo.split(";")[0] || "un cuerpo vacío"}.`,
    });
  }

  const errores = Array.isArray(data.errores) ? data.errores : [];
  const mensaje = data.error || (errores.length ? "Revisa los campos marcados." : `Error ${res.status}`);
  const contrato = !data.error && !errores.length
    ? `${method} /api${path} respondió ${res.status} sin "error" ni "errores" en el JSON.`
    : null;
  throw new ApiError(res.status, mensaje, { errores, contrato });
}

function offline() {
  return new ApiError(0, "No hay conexión con la API. ¿Está corriendo en el puerto 3000?");
}

// { email: "El email no es válido", ... } a partir de un ApiError
export function erroresPorCampo(err) {
  const map = {};
  for (const e of err?.errores ?? []) {
    const campo = e.campo ?? e.path ?? e.param;
    if (campo && !map[campo]) map[campo] = e.mensaje ?? e.msg ?? "Valor no válido";
  }
  return map;
}
