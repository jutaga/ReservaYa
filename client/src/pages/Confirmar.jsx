import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";
import { Aviso, BotonLink, Cargando, TarjetaAuth } from "../components/ui.jsx";

// Página a la que lleva el enlace del email: FRONTEND_URL/confirmar/:token
export default function Confirmar() {
  const { token } = useParams();
  const [estado, setEstado] = useState({ cargando: true });
  // En desarrollo React (StrictMode) ejecuta los efectos dos veces. Sin esta
  // guarda, la segunda llamada usaría un token ya consumido y daría 400.
  const llamado = useRef(false);

  useEffect(() => {
    if (llamado.current) return;
    llamado.current = true;
    // POST porque confirmar cambia datos (confirmado = true, token = null). Sin body: el token va en la URL.
    api(`/auth/confirmar/${encodeURIComponent(token)}`, { method: "POST" })
      .then((data) => setEstado({ ok: true, mensaje: data.mensaje }))
      .catch((error) => setEstado({ error }));
  }, [token]);

  if (estado.cargando) return <Cargando texto="Confirmando tu cuenta…" />;

  if (estado.ok) {
    return (
      <TarjetaAuth icono="check" titulo="¡Cuenta confirmada!" subtitulo={estado.mensaje || "Ya puedes iniciar sesión y reservar."}>
        <BotonLink to="/login" fullWidth>Iniciar sesión</BotonLink>
      </TarjetaAuth>
    );
  }

  return (
    <TarjetaAuth icono="alert" titulo="No pudimos confirmar tu cuenta"
      subtitulo="El enlace no es válido o ya se usó.">
      <Aviso error={estado.error} />
      <BotonLink to="/login" variante="secundario" fullWidth>Ir a iniciar sesión</BotonLink>
    </TarjetaAuth>
  );
}
