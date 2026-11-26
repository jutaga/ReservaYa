import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Link } from "@heroui/react";
import { erroresPorCampo } from "../api.js";
import { useAuth } from "../auth.jsx";
import { Aviso, Boton, Campo, TarjetaAuth, useFormulario } from "../components/ui.jsx";

export default function Login() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { form, setErrores, campo } = useFormulario({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const destino = location.state?.desde || "/perfil";
  if (usuario && !enviando) return <Navigate to={destino} replace />;

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);
    setErrores({});
    setEnviando(true);
    try {
      await login(form.email, form.password);
      navigate(destino, { replace: true });
    } catch (err) {
      const porCampo = erroresPorCampo(err);
      setErrores(porCampo);
      if (!Object.keys(porCampo).length) setError(err);
      setEnviando(false);
    }
  };

  return (
    <TarjetaAuth icono="lock" titulo="Inicia sesión" subtitulo="Bienvenido de nuevo. Tu cancha te espera."
      pie={<>¿No tienes cuenta? <Link href="/registro">Créala gratis</Link></>}>
      {/* noValidate: el front no valida, así se ven los errores de la API */}
      <form onSubmit={enviar} noValidate className="grid gap-4">
        <Aviso error={error} />
        {error?.status === 403 && (
          <p className="-mt-2 text-center text-sm text-muted">Busca el email de confirmación que te enviamos al registrarte.</p>
        )}
        <Campo label="Email" type="email" {...campo("email")} autoComplete="username" spellCheck={false} autoFocus />
        <div className="grid gap-1.5">
          <Campo label="Contraseña" type="password" {...campo("password")} autoComplete="current-password" />
          <Link href="/olvide-password" className="justify-self-end text-sm">¿Olvidaste tu contraseña?</Link>
        </div>
        <Boton type="submit" cargando={enviando} fullWidth>Entrar</Boton>
      </form>
    </TarjetaAuth>
  );
}
