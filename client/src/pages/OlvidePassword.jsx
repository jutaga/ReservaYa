import { useState } from "react";
import { Link } from "@heroui/react";
import { api, erroresPorCampo } from "../api.js";
import { Aviso, Boton, BotonLink, Campo, TarjetaAuth, useFormulario } from "../components/ui.jsx";

export default function OlvidePassword() {
  const { form, setErrores, campo } = useFormulario({ email: "" });
  const [error, setError] = useState(null);
  const [enviado, setEnviado] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);
    setErrores({});
    setEnviando(true);
    try {
      const data = await api("/auth/olvide-password", { method: "POST", body: { email: form.email } });
      setEnviado(data.mensaje || "Si el email existe, te enviamos instrucciones.");
    } catch (err) {
      const porCampo = erroresPorCampo(err);
      setErrores(porCampo);
      if (!Object.keys(porCampo).length) setError(err);
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <TarjetaAuth icono="mail" titulo="Revisa tu email" subtitulo={enviado}>
        <BotonLink to="/login" variante="secundario" fullWidth>Volver a iniciar sesión</BotonLink>
      </TarjetaAuth>
    );
  }

  return (
    <TarjetaAuth icono="lock" titulo="¿Olvidaste tu contraseña?"
      subtitulo="Escribe tu email y te enviaremos un enlace para crear una nueva."
      pie={<Link href="/login">Volver a iniciar sesión</Link>}>
      <form onSubmit={enviar} noValidate className="grid gap-4">
        <Aviso error={error} />
        <Campo label="Email" type="email" {...campo("email")} autoComplete="username" spellCheck={false} autoFocus />
        <Boton type="submit" cargando={enviando} fullWidth>Enviar instrucciones</Boton>
      </form>
    </TarjetaAuth>
  );
}
