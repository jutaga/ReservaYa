import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  AlertDialog,
  Button,
  Card,
  Description,
  FieldError,
  Input,
  InputGroup,
  Label,
  Spinner,
  TextField,
  buttonVariants,
} from "@heroui/react";

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
  chevron: <path d="M6 9l6 6 6-6" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></>,
  trash: <><path d="M4 7h16M10 11v6M14 11v6" /><path d="M6 7l1 13h10l1-13M9 7V4h6v3" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></>,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" /></>,
};

export function Icon({ name, size = 18, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {PATHS[name]}
    </svg>
  );
}

// "Ana María López" → "AM"
export const iniciales = (texto = "?") =>
  texto.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

// Mensaje de estado. `error` puede ser un ApiError: si trae aviso de contrato lo muestra aparte.
const ESTADO = { info: "accent", ok: "success", error: "danger", offline: "warning" };
const FONDO = { info: "bg-accent-soft", ok: "bg-success-soft", error: "bg-danger-soft", offline: "bg-warning-soft" };

export function Aviso({ tipo = "info", children, error }) {
  if (error) {
    tipo = error.status === 0 ? "offline" : "error";
    children = error.message;
  }
  if (!children) return null;
  return (
    <Alert status={ESTADO[tipo]} role={tipo === "error" ? "alert" : "status"} className={`${FONDO[tipo]} shadow-none`}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{children}</Alert.Title>
        {error?.contrato && (
          <Alert.Description className="mt-1 flex items-start gap-1.5 font-mono text-xs text-muted">
            <Icon name="code" size={14} className="mt-0.5 shrink-0" /> Para el backend: {error.contrato}
          </Alert.Description>
        )}
      </Alert.Content>
    </Alert>
  );
}

// Estado de un formulario: valores y errores por campo (los que manda la API en `errores`).
// campo("email") devuelve las props de <Campo>. Al escribir en un campo se borra su error.
export function useFormulario(inicial) {
  const [form, setForm] = useState(inicial);
  const [errores, setErrores] = useState({});
  const campo = (name) => ({
    name,
    value: form[name],
    error: errores[name],
    onChange: (value) => {
      setForm((f) => ({ ...f, [name]: value }));
      setErrores(({ [name]: _quitado, ...resto }) => resto);
    },
  });
  return { form, errores, setErrores, campo };
}

// Campo de texto. No valida nada: muestra el error que le pasen (normalmente el de la API).
export function Campo({ label, error, opcional, type = "text", ayuda, spellCheck, ...props }) {
  const [ver, setVer] = useState(false);
  const esPassword = type === "password";
  return (
    <TextField {...props} type={esPassword && ver ? "text" : type} isInvalid={!!error}
      validationBehavior="aria" variant="secondary" fullWidth>
      <Label>
        {label}
        {opcional && <span className="ms-1.5 text-xs font-normal text-muted">opcional</span>}
      </Label>
      {esPassword ? (
        <InputGroup variant="secondary" fullWidth>
          {/* min-w-0: sin esto el input conserva su ancho intrínseco (~20 caracteres) y empuja el botón fuera */}
          <InputGroup.Input spellCheck={false} className="min-w-0 flex-1" />
          <InputGroup.Suffix className="pe-1">
            <Button isIconOnly size="sm" variant="ghost" onPress={() => setVer(!ver)}
              aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}>
              <Icon name={ver ? "eyeOff" : "eye"} size={16} />
            </Button>
          </InputGroup.Suffix>
        </InputGroup>
      ) : (
        <Input spellCheck={spellCheck} />
      )}
      {error ? <FieldError>{error}</FieldError> : ayuda && <Description>{ayuda}</Description>}
    </TextField>
  );
}

const VARIANTES = { primario: "primary", secundario: "secondary", fantasma: "ghost", borde: "outline" };

export function Boton({ cargando, children, variante = "primario", ...rest }) {
  return (
    <Button variant={VARIANTES[variante]} isPending={cargando} {...rest}>
      {({ isPending }) => (
        <>
          {isPending && <Spinner color="current" size="sm" />}
          {children}
        </>
      )}
    </Button>
  );
}

// Enlace de React Router con aspecto de botón
export function BotonLink({ to, variante = "primario", size, fullWidth, className = "", children, ...rest }) {
  return (
    <RouterLink to={to} className={`${buttonVariants({ variant: VARIANTES[variante], size, fullWidth })} ${className}`} {...rest}>
      {children}
    </RouterLink>
  );
}

// Tarjeta centrada para las pantallas de cuenta
export function TarjetaAuth({ icono = "user", titulo, subtitulo, children, pie }) {
  return (
    <div className="fondo-auth grid min-h-[calc(100dvh-8rem)] place-content-center px-4 py-10">
      <Card className="w-[min(440px,calc(100vw-2rem))] gap-6 p-7 shadow-lg sm:p-8">
        <Card.Header className="items-center gap-1 text-center">
          <span className="mb-3 grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent-soft-foreground">
            <Icon name={icono} size={26} />
          </span>
          <h1 className="text-2xl font-bold">{titulo}</h1>
          {subtitulo && <p className="text-muted">{subtitulo}</p>}
        </Card.Header>
        <Card.Content className="gap-4">{children}</Card.Content>
      </Card>
      {pie && <p className="mt-5 text-center text-sm text-muted">{pie}</p>}
    </div>
  );
}

export function Cargando({ texto = "Cargando…" }) {
  return (
    <div className="grid place-items-center gap-3 px-4 py-24 text-muted" role="status">
      <Spinner size="lg" />
      {texto}
    </div>
  );
}

// Confirmación antes de una acción que no se puede deshacer (borrar).
// `pedir` = { titulo, texto, accion, alConfirmar } o null. Mientras alConfirmar() corre, el botón espera;
// si falla, el diálogo se cierra igual y quien llama muestra el error.
export function Confirmar({ pedir, onCerrar }) {
  const [cargando, setCargando] = useState(false);
  const confirmar = async () => {
    setCargando(true);
    try { await pedir.alConfirmar(); } finally { setCargando(false); onCerrar(); }
  };
  // Esc cancela: el AlertDialog de HeroUI lo trae desactivado (isKeyboardDismissDisabled = true por
  // defecto) y aquí se activa. El foco empieza en "Cancelar", así que Enter tampoco borra por accidente.
  return (
    <AlertDialog.Backdrop isOpen={!!pedir} isKeyboardDismissDisabled={cargando}
      onOpenChange={(abierto) => !abierto && !cargando && onCerrar()}>
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-[420px]">
          <AlertDialog.Header>
            <AlertDialog.Icon status="danger" />
            <AlertDialog.Heading>{pedir?.titulo}</AlertDialog.Heading>
          </AlertDialog.Header>
          <AlertDialog.Body><p>{pedir?.texto}</p></AlertDialog.Body>
          <AlertDialog.Footer>
            <Button variant="tertiary" onPress={onCerrar} isDisabled={cargando} autoFocus>Cancelar</Button>
            <Boton variant="danger" cargando={cargando} onPress={confirmar}>{pedir?.accion ?? "Eliminar"}</Boton>
          </AlertDialog.Footer>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
}

// Pantalla vacía con icono, título, texto y una acción (404, sin permiso…)
export function Vacio({ icono, titulo, children, accion }) {
  return (
    <div className="contenedor grid justify-items-center gap-2 py-20 text-center text-muted">
      <span className="mb-2 grid size-16 place-items-center rounded-full bg-surface-secondary">
        <Icon name={icono} size={32} />
      </span>
      <h1 className="text-3xl font-bold text-foreground">{titulo}</h1>
      <p className="mb-3">{children}</p>
      {accion}
    </div>
  );
}
