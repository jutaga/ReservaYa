import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Chip, Separator, Skeleton, Spinner, Switch, Tooltip, toast } from "@heroui/react";
import { api } from "../api.js";
import { hora, nombreDeporte, precio, TIPOS_IMAGEN } from "../sedes.js";
import { Aviso, Boton, Confirmar, Icon } from "../components/ui.jsx";
import { FormCancha, FormSede } from "../components/FormulariosSede.jsx";

// Panel del admin: sus sedes (GET /api/admin/sedes), cada una con su foto y sus canchas.
export default function PanelAdmin() {
  const [estado, setEstado] = useState({ cargando: true, sedes: [] });
  const [formSede, setFormSede] = useState(null); // { sede } | null
  const [formCancha, setFormCancha] = useState(null); // { sede, cancha } | null
  const [confirmar, setConfirmar] = useState(null);

  const cargar = useCallback(async () => {
    try {
      const sedes = await api("/admin/sedes");
      if (!Array.isArray(sedes)) {
        console.warn("[contrato] GET /api/admin/sedes debería devolver un array de sedes");
        setEstado({ sedes: [], error: { message: "La respuesta no es una lista de sedes.", contrato: "GET /api/admin/sedes debería responder un array: [{ ...sede, canchas: [...] }]." } });
        return;
      }
      setEstado({ sedes });
    } catch (error) {
      setEstado((e) => ({ sedes: e.sedes, error }));
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  // Borrar algo: pide confirmación, llama a la API y recarga
  const eliminar = (titulo, texto, ruta, mensaje) => setConfirmar({
    titulo, texto,
    alConfirmar: async () => {
      try {
        await api(ruta, { method: "DELETE" });
        toast.success(mensaje);
        await cargar();
      } catch (err) {
        toast.danger(err.message);
      }
    },
  });

  const { cargando, sedes, error } = estado;
  return (
    <div className="contenedor py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--admin)]">Panel de admin</p>
          <h1 className="text-3xl font-bold">Mis sedes</h1>
          <p className="text-muted">Tus sedes, su horario, su foto y sus canchas.</p>
        </div>
        {sedes.length > 0 && <Boton onPress={() => setFormSede({ sede: null })}><Icon name="plus" size={16} /> Nueva sede</Boton>}
      </div>

      {error && <div className="mt-5"><Aviso error={error} /></div>}

      <div className="mt-6 grid gap-6">
        {cargando && [1, 2].map((k) => <Skeleton key={k} className="h-56 w-full rounded-2xl" />)}

        {!cargando && !error && sedes.length === 0 && (
          <Card className="grid justify-items-center gap-3 px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-accent-soft text-accent-soft-foreground"><Icon name="court" size={28} /></span>
            <h2 className="text-xl font-semibold">Aún no tienes sedes</h2>
            <p className="max-w-md text-muted">Crea tu primera sede con su horario. Después podrás añadirle canchas y una foto.</p>
            <Boton onPress={() => setFormSede({ sede: null })}><Icon name="plus" size={16} /> Crear mi primera sede</Boton>
          </Card>
        )}

        {sedes.map((sede) => (
          <TarjetaSede key={sede.id} sede={sede} onCambio={cargar}
            onEditar={() => setFormSede({ sede })}
            onEliminar={() => eliminar(`¿Eliminar ${sede.nombre}?`,
              `${textoBorrarSede(sede)} No se puede deshacer.`,
              `/sedes/${sede.id}`, "Sede eliminada.")}
            onNuevaCancha={() => setFormCancha({ sede, cancha: null })}
            onEditarCancha={(cancha) => setFormCancha({ sede, cancha })}
            onEliminarCancha={(cancha) => eliminar(`¿Eliminar ${cancha.nombre}?`,
              "Si solo quieres que no se pueda reservar, desactívala en lugar de borrarla.",
              `/canchas/${cancha.id}`, "Cancha eliminada.")} />
        ))}
      </div>

      <FormSede abierto={!!formSede} sede={formSede?.sede} onCerrar={() => setFormSede(null)} onGuardada={cargar} />
      <FormCancha abierto={!!formCancha} sede={formCancha?.sede} cancha={formCancha?.cancha} onCerrar={() => setFormCancha(null)} onGuardada={cargar} />
      <Confirmar pedir={confirmar} onCerrar={() => setConfirmar(null)} />
    </div>
  );
}

// "Se borrarán también su cancha y su foto." / "sus 3 canchas" / solo la foto / nada
function textoBorrarSede(sede) {
  const n = sede.canchas?.length ?? 0;
  const partes = [n === 1 ? "su cancha" : n > 1 ? `sus ${n} canchas` : null, sede.imagen ? "su foto" : null].filter(Boolean);
  return partes.length ? `Se borrarán también ${partes.join(" y ")}.` : "";
}

function TarjetaSede({ sede, onCambio, onEditar, onEliminar, onNuevaCancha, onEditarCancha, onEliminarCancha }) {
  const canchas = sede.canchas ?? [];
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="grid gap-5 p-5 sm:grid-cols-[220px_minmax(0,1fr)]">
        <FotoSede sede={sede} onCambio={onCambio} />
        <div className="grid min-w-0 content-start gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold [overflow-wrap:anywhere]">{sede.nombre}</h2>
              <p className="flex items-center gap-1.5 text-muted"><Icon name="pin" size={15} className="shrink-0" /> {sede.direccion} · {sede.ciudad}</p>
            </div>
            <div className="flex gap-1">
              <Tooltip delay={300}>
                <Link to={`/sedes/${sede.id}`} aria-label={`Ver la ficha pública de ${sede.nombre}`}
                  className="grid size-9 place-items-center rounded-lg text-muted hover:bg-default hover:text-foreground">
                  <Icon name="external" size={17} />
                </Link>
                <Tooltip.Content>Ver ficha pública</Tooltip.Content>
              </Tooltip>
              <Button variant="ghost" size="sm" onPress={onEditar}><Icon name="edit" size={16} /> Editar</Button>
              <Button variant="ghost" size="sm" isIconOnly aria-label={`Eliminar ${sede.nombre}`} onPress={onEliminar} className="text-danger">
                <Icon name="trash" size={16} />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <span className="flex items-center gap-1.5"><Icon name="clock" size={15} className="text-muted" /> {hora(sede.horaApertura)} – {hora(sede.horaCierre)}</span>
            <span className="flex items-center gap-1.5"><Icon name="phone" size={15} className="text-muted" /> {sede.telefono || <span className="text-muted">Sin teléfono</span>}</span>
          </div>
        </div>
      </div>

      <Separator />
      <div className="grid gap-2 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">Canchas <span className="font-normal text-muted">({canchas.length})</span></h3>
          <Button variant="secondary" size="sm" onPress={onNuevaCancha}><Icon name="plus" size={15} /> Nueva cancha</Button>
        </div>
        {canchas.length === 0 ? (
          <p className="rounded-xl bg-surface-secondary px-4 py-5 text-center text-sm text-muted">
            Sin canchas todavía. La sede no aparece en el catálogo hasta que tenga al menos una activa.
          </p>
        ) : (
          <ul className="grid divide-y divide-separator">
            {canchas.map((c) => (
              <FilaCancha key={c.id} cancha={c} onCambio={onCambio} onEditar={() => onEditarCancha(c)} onEliminar={() => onEliminarCancha(c)} />
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

// Foto de la sede con su botón para cambiarla (POST /api/sedes/:id/imagen, multipart, campo "imagen")
function FotoSede({ sede, onCambio }) {
  const input = useRef(null);
  const [subiendo, setSubiendo] = useState(false);

  const subir = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = ""; // para poder elegir el mismo archivo otra vez
    if (!archivo) return;
    const datos = new FormData();
    datos.append("imagen", archivo);
    setSubiendo(true);
    try {
      const r = await api(`/sedes/${sede.id}/imagen`, { method: "POST", body: datos });
      if (!r.imagen) console.warn('[contrato] POST /api/sedes/:id/imagen debería responder { "imagen": "/uploads/..." }');
      toast.success("Foto actualizada.");
      await onCambio();
    } catch (err) {
      toast.danger(err.message);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="grid gap-2">
      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-xl bg-surface-secondary text-muted">
        {sede.imagen
          ? <img src={sede.imagen} alt={`Foto de ${sede.nombre}`} className="size-full object-cover" />
          : <span className="grid justify-items-center gap-1 text-sm"><Icon name="image" size={28} /> Sin foto</span>}
        {subiendo && <span className="absolute inset-0 grid place-items-center bg-background/70"><Spinner /></span>}
      </div>
      <input ref={input} type="file" accept={TIPOS_IMAGEN} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={subir} />
      <Button variant="secondary" size="sm" onPress={() => input.current?.click()} isDisabled={subiendo}>
        <Icon name="image" size={15} /> {sede.imagen ? "Cambiar foto" : "Subir foto"}
      </Button>
      <p className="text-center text-xs text-muted">JPG, PNG o WEBP · máx. 2 MB</p>
    </div>
  );
}

function FilaCancha({ cancha, onCambio, onEditar, onEliminar }) {
  const [guardando, setGuardando] = useState(false);

  // PUT reemplaza: se manda la cancha entera con `activa` cambiado
  const alternar = async (activa) => {
    setGuardando(true);
    try {
      const { nombre, deporte, superficie, precioHora } = cancha;
      await api(`/canchas/${cancha.id}`, { method: "PUT", body: { nombre, deporte, superficie, precioHora: String(precioHora), activa } });
      toast.success(activa ? `${cancha.nombre} activada.` : `${cancha.nombre} desactivada.`);
      await onCambio();
    } catch (err) {
      toast.danger(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <li className={`flex flex-wrap items-center gap-x-4 gap-y-2 py-3 ${cancha.activa ? "" : "text-muted"}`}>
      <div className="min-w-0 flex-1 basis-48">
        <p className="font-medium text-foreground [overflow-wrap:anywhere]">{cancha.nombre}</p>
        <p className="text-sm text-muted">{nombreDeporte(cancha.deporte)}{cancha.superficie ? ` · ${cancha.superficie}` : ""}</p>
      </div>
      <span className="font-semibold tabular-nums text-foreground">{precio(cancha.precioHora)}<span className="text-sm font-normal text-muted"> / hora</span></span>
      {!cancha.activa && <Chip size="sm" variant="soft">Inactiva</Chip>}
      <div className="ms-auto flex items-center gap-1">
        <Switch size="sm" isSelected={cancha.activa} onChange={alternar} isDisabled={guardando} aria-label={`${cancha.nombre} activa`}>
          <Switch.Content><Switch.Control><Switch.Thumb /></Switch.Control></Switch.Content>
        </Switch>
        <Button variant="ghost" size="sm" isIconOnly aria-label={`Editar ${cancha.nombre}`} onPress={onEditar}><Icon name="edit" size={16} /></Button>
        <Button variant="ghost" size="sm" isIconOnly aria-label={`Eliminar ${cancha.nombre}`} onPress={onEliminar} className="text-danger"><Icon name="trash" size={16} /></Button>
      </div>
    </li>
  );
}
