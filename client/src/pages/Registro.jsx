import { useState } from "react";
import { Link } from "@heroui/react";
import { api, erroresPorCampo } from "../api.js";
import { Aviso, Boton, BotonLink, Campo, Icon, TarjetaAuth, useFormulario } from "../components/ui.jsx";

const VACIO = { nombre: "", email: "", telefono: "", password: "", repetir: "" };

export default function Registro() {
  const { form, setErrores, campo } = useFormulario(VACIO);
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [creada, setCreada] = useState(null);

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
        <p className="mx-auto max-w-full rounded-full bg-surface-secondary px-4 py-2 text-center font-semibold [overflow-wrap:anywhere]">
          {creada.email}
        </p>
        <p className="text-center text-sm text-muted">Si no lo ves en unos minutos, revisa la carpeta de spam.</p>
        <BotonLink to="/login" variante="secundario" fullWidth>Ir a iniciar sesión</BotonLink>
      </TarjetaAuth>
    );
  }

  return (
    <TarjetaAuth titulo="Crea tu cuenta" subtitulo="Reserva canchas en tu ciudad en segundos."
      pie={<>¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link></>}>
      <form onSubmit={enviar} noValidate className="grid gap-4">
        <Aviso error={error} />
        <Campo label="Nombre" {...campo("nombre")} autoComplete="name" autoFocus />
        <Campo label="Email" type="email" {...campo("email")} autoComplete="username" spellCheck={false} />
        <Campo label="Teléfono" type="tel" opcional {...campo("telefono")} autoComplete="tel" />
        <div className="grid items-start gap-4 sm:grid-cols-2 sm:gap-3">
          <Campo label="Contraseña" type="password" {...campo("password")} autoComplete="new-password" ayuda="Mínimo 8 caracteres, sin espacios" />
          <Campo label="Repetir contraseña" type="password" {...campo("repetir")} autoComplete="new-password" />
        </div>
        <Boton type="submit" cargando={enviando} fullWidth>Crear cuenta</Boton>
        <p className="flex items-center justify-center gap-1.5 text-center text-sm text-muted">
          <Icon name="shield" size={14} /> Te enviaremos un email para confirmar tu cuenta.
        </p>
      </form>
    </TarjetaAuth>
  );
}
