import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { erroresPorCampo } from "../api.js";
import { useAuth } from "../auth.jsx";
import { Aviso, Boton, Campo, TarjetaAuth } from "../components/ui.jsx";

export default function Login() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errores, setErrores] = useState({});
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const destino = location.state?.desde || "/perfil";
  if (usuario && !enviando) return <Navigate to={destino} replace />;

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
      pie={<>¿No tienes cuenta? <Link to="/registro">Créala gratis</Link></>}>
      <form onSubmit={enviar} noValidate className="form">
        {location.state?.mensaje && !error && <Aviso tipo="ok">{location.state.mensaje}</Aviso>}
        <Aviso error={error} />
        {error?.status === 403 && (
          <p className="texto-suave nota-chica">Busca el email de confirmación que te enviamos al registrarte.</p>
        )}
        <Campo label="Email" name="email" type="email" value={form.email} onChange={cambiar} error={errores.email} autoComplete="email" autoFocus />
        <Campo label="Contraseña" name="password" type="password" value={form.password} onChange={cambiar} error={errores.password} autoComplete="current-password" />
        <div className="derecha"><Link to="/olvide-password" className="enlace-chico">¿Olvidaste tu contraseña?</Link></div>
        <Boton type="submit" cargando={enviando}>Entrar</Boton>
      </form>
    </TarjetaAuth>
  );
}
