import { useState } from "react";

// Iconos SVG en línea (sin dependencias)
const PATHS = {
  ball: <><circle cx="12" cy="12" r="9" /><path d="M12 7l4 3-1.5 5h-5L8 10z" /><path d="M12 3v4M21 10.5l-5-.5M18 19l-3.5-4M6 19l3.5-4M3 10.5l5-.5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 018 0v4" /></>,
  check: <path d="M5 12l5 5L20 7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  alert: <><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.01" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.01" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M3 3l18 18M10.6 6.1A10 10 0 0112 6c6 0 10 6 10 6a17 17 0 01-3 3.6M6.1 6.9A17 17 0 002 12s4 7 10 7a9.7 9.7 0 004.5-1.1" /><path d="M9.9 9.9a3 3 0 004.2 4.2" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
  logout: <><path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3" /><path d="M10 16l-4-4 4-4M6 12h10" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  court: <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M12 5v14" /><circle cx="12" cy="12" r="2.5" /><path d="M3 9h3v6H3M21 9h-3v6h3" /></>,
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />,
};

export function Icon({ name, size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {PATHS[name]}
    </svg>
  );
}

// Mensaje de estado. `error` puede ser un ApiError: si trae aviso de contrato lo muestra aparte.
export function Aviso({ tipo = "info", children, error }) {
  if (error) {
    tipo = error.status === 0 ? "offline" : "error";
    children = error.message;
  }
  if (!children) return null;
  const icono = { info: "info", ok: "check", error: "alert", offline: "alert" }[tipo];
  return (
    <div className={`aviso aviso-${tipo}`} role={tipo === "error" ? "alert" : "status"}>
      <Icon name={icono} />
      <div>
        <div>{children}</div>
        {error?.contrato && (
          <div className="aviso-contrato"><Icon name="code" size={14} /> Para el backend: {error.contrato}</div>
        )}
      </div>
    </div>
  );
}

export function Campo({ label, name, error, opcional, type = "text", ayuda, ...input }) {
  const [ver, setVer] = useState(false);
  const esPassword = type === "password";
  return (
    <label className={`campo ${error ? "campo-error" : ""}`}>
      <span className="campo-label">
        {label} {opcional && <span className="opcional">opcional</span>}
      </span>
      <span className="campo-input">
        <input name={name} type={esPassword && ver ? "text" : type} aria-invalid={!!error} {...input} />
        {esPassword && (
          <button type="button" className="ver-pass" onClick={() => setVer(!ver)}
            aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}>
            <Icon name={ver ? "eyeOff" : "eye"} />
          </button>
        )}
      </span>
      {error ? <span className="campo-msg">{error}</span> : ayuda && <span className="campo-ayuda">{ayuda}</span>}
    </label>
  );
}

export function Boton({ cargando, children, variante = "primario", ...rest }) {
  return (
    <button className={`btn btn-${variante}`} disabled={cargando || rest.disabled} {...rest}>
      {cargando && <span className="spinner" />}
      {children}
    </button>
  );
}

// Tarjeta centrada para las pantallas de cuenta
export function TarjetaAuth({ icono = "user", titulo, subtitulo, children, pie }) {
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-icono"><Icon name={icono} size={26} /></div>
        <h1>{titulo}</h1>
        {subtitulo && <p className="auth-sub">{subtitulo}</p>}
        {children}
      </div>
      {pie && <div className="auth-pie">{pie}</div>}
    </div>
  );
}

export function Cargando({ texto = "Cargando…" }) {
  return <div className="cargando"><span className="spinner spinner-grande" />{texto}</div>;
}
