import { useState } from "react";
import { Link } from "react-router-dom";
import { api, erroresPorCampo } from "../api.js";
import { Aviso, Boton, Campo, TarjetaAuth } from "../components/ui.jsx";

export default function OlvidePassword() {
  const [email, setEmail] = useState("");
  const [errores, setErrores] = useState({});
  const [error, setError] = useState(null);
  const [enviado, setEnviado] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);
    setErrores({});
    setEnviando(true);
    try {
      const data = await api("/auth/olvide-password", { method: "POST", body: { email } });
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
        <Link to="/login" className="btn btn-secundario btn-bloque">Volver a iniciar sesión</Link>
      </TarjetaAuth>
    );
  }

  return (
    <TarjetaAuth icono="lock" titulo="¿Olvidaste tu contraseña?"
      subtitulo="Escribe tu email y te enviaremos un enlace para crear una nueva."
      pie={<Link to="/login">Volver a iniciar sesión</Link>}>
      <form onSubmit={enviar} noValidate className="form">
        <Aviso error={error} />
        <Campo label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errores.email} autoComplete="email" autoFocus />
        <Boton type="submit" cargando={enviando}>Enviar instrucciones</Boton>
      </form>
    </TarjetaAuth>
  );
}
