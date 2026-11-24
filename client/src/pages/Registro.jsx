import { useState } from "react";
import { Link } from "react-router-dom";
import { api, erroresPorCampo } from "../api.js";
import { Aviso, Boton, Campo, Icon, TarjetaAuth } from "../components/ui.jsx";

const VACIO = { nombre: "", email: "", telefono: "", password: "", repetir: "" };

export default function Registro() {
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [creada, setCreada] = useState(null);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);
    // Única validación del front: que las dos contraseñas coincidan.
    // El resto lo valida tu API (por eso el formulario no usa `required`).
    if (form.password !== form.repetir) {
      setErrores({ repetir: "Las contraseñas no coinciden" });
      return;
    }
    setErrores({});
    setEnviando(true);
    try {
      const { repetir, telefono, ...datos } = form;
      const body = telefono.trim() ? { ...datos, telefono } : datos;
      const data = await api("/auth/registro", { method: "POST", body });
      setCreada({ email: form.email, mensaje: data.mensaje });
    } catch (err) {
      const porCampo = erroresPorCampo(err);
      if (err.status === 409) porCampo.email = err.message;
      setErrores(porCampo);
      if (!Object.keys(porCampo).length || err.status === 0) setError(err);
    } finally {
      setEnviando(false);
    }
  };

  if (creada) {
    return (
      <TarjetaAuth icono="mail" titulo="Revisa tu email"
        subtitulo={creada.mensaje || "Cuenta creada. Revisa tu email para confirmarla."}>
        <p className="email-destacado">{creada.email}</p>
        <p className="texto-suave centrado">Si no lo ves en unos minutos, revisa la carpeta de spam.</p>
        <Link to="/login" className="btn btn-secundario btn-bloque">Ir a iniciar sesión</Link>
      </TarjetaAuth>
    );
  }

  return (
    <TarjetaAuth titulo="Crea tu cuenta" subtitulo="Reserva canchas en tu ciudad en segundos."
      pie={<>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></>}>
      <form onSubmit={enviar} noValidate className="form">
        <Aviso error={error} />
        <Campo label="Nombre" name="nombre" value={form.nombre} onChange={cambiar} error={errores.nombre} autoComplete="name" autoFocus />
        <Campo label="Email" name="email" type="email" value={form.email} onChange={cambiar} error={errores.email} autoComplete="email" />
        <Campo label="Teléfono" name="telefono" type="tel" opcional value={form.telefono} onChange={cambiar} error={errores.telefono} autoComplete="tel" />
        <div className="fila-2">
          <Campo label="Contraseña" name="password" type="password" value={form.password} onChange={cambiar} error={errores.password} autoComplete="new-password" ayuda="Mínimo 8 caracteres" />
          <Campo label="Repetir contraseña" name="repetir" type="password" value={form.repetir} onChange={cambiar} error={errores.repetir} autoComplete="new-password" />
        </div>
        <Boton type="submit" cargando={enviando}>Crear cuenta</Boton>
        <p className="texto-suave centrado nota-chica"><Icon name="shield" size={14} /> Te enviaremos un email para confirmar tu cuenta.</p>
      </form>
    </TarjetaAuth>
  );
}
