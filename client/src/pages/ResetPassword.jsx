import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, erroresPorCampo } from "../api.js";
import { Aviso, Boton, BotonLink, Campo, Cargando, TarjetaAuth, useFormulario } from "../components/ui.jsx";

// Página a la que lleva el email de recuperación: FRONTEND_URL/reset-password/:token
export default function ResetPassword() {
  const { token } = useParams();
  const ruta = `/auth/reset-password/${encodeURIComponent(token)}`;
  const [valido, setValido] = useState(null); // null = comprobando
  const [errorToken, setErrorToken] = useState(null);
  const { form, setErrores, campo } = useFormulario({ password: "", repetir: "" });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [listo, setListo] = useState(null);

  useEffect(() => {
    api(ruta)
      .then(() => setValido(true))
      .catch((err) => { setValido(false); setErrorToken(err); });
  }, [ruta]);

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.repetir) return setErrores({ repetir: "Las contraseñas no coinciden" });
    setErrores({});
    setEnviando(true);
    try {
      const data = await api(ruta, { method: "POST", body: { password: form.password } });
      setListo(data.mensaje || "Contraseña actualizada.");
    } catch (err) {
      const porCampo = erroresPorCampo(err);
      setErrores(porCampo);
      if (!Object.keys(porCampo).length) setError(err);
    } finally {
      setEnviando(false);
    }
  };

  if (valido === null) return <Cargando texto="Comprobando el enlace…" />;

  if (listo) {
    return (
      <TarjetaAuth icono="check" titulo="¡Listo!" subtitulo={listo}>
        <BotonLink to="/login" fullWidth>Iniciar sesión</BotonLink>
      </TarjetaAuth>
    );
  }

  if (!valido) {
    return (
      <TarjetaAuth icono="alert" titulo="Enlace no válido" subtitulo="Puede que ya lo hayas usado. Pide uno nuevo.">
        <Aviso error={errorToken} />
        <BotonLink to="/olvide-password" fullWidth>Pedir un enlace nuevo</BotonLink>
      </TarjetaAuth>
    );
  }

  return (
    <TarjetaAuth icono="lock" titulo="Nueva contraseña" subtitulo="Elige una contraseña que no uses en otros sitios.">
      <form onSubmit={enviar} noValidate className="grid gap-4">
        <Aviso error={error} />
        <Campo label="Nueva contraseña" type="password" {...campo("password")} autoComplete="new-password" ayuda="Mínimo 8 caracteres, sin espacios" autoFocus />
        <Campo label="Repetir contraseña" type="password" {...campo("repetir")} autoComplete="new-password" />
        <Boton type="submit" cargando={enviando} fullWidth>Guardar contraseña</Boton>
      </form>
    </TarjetaAuth>
  );
}
