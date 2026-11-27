import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Chip, Skeleton } from "@heroui/react";
import { api } from "../api.js";
import { DEPORTES, hora, nombreDeporte, precio } from "../sedes.js";
import { Aviso, BotonLink, Icon, Vacio } from "../components/ui.jsx";

// Ficha pública de una sede: GET /api/sedes/:id (sus datos y sus canchas activas)
export default function Sede() {
  const { id } = useParams();
  const [estado, setEstado] = useState({ cargando: true });

  useEffect(() => {
    const ctrl = new AbortController();
    setEstado({ cargando: true });
    api(`/sedes/${encodeURIComponent(id)}`, { signal: ctrl.signal })
      .then((sede) => {
        if (!Array.isArray(sede.canchas)) console.warn("[contrato] GET /api/sedes/:id debería incluir `canchas: [...]`");
        if (sede.usuario?.email || sede.usuario?.password || sede.usuarioId) {
          console.warn("[contrato] GET /api/sedes/:id no debería incluir datos del admin salvo usuario.nombre");
        }
        setEstado({ sede });
      })
      .catch((error) => { if (error.name !== "AbortError") setEstado({ error }); });
    return () => ctrl.abort();
  }, [id]);

  const { cargando, sede, error } = estado;

  if (error?.status === 404) {
    return (
      <Vacio icono="court" titulo="Sede no encontrada" accion={<BotonLink to="/sedes">Ver todas las sedes</BotonLink>}>
        Puede que la hayan eliminado o que el enlace no sea correcto.
      </Vacio>
    );
  }

  return (
    <div className="contenedor py-8">
      <Link to="/sedes" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground">
        <Icon name="arrowLeft" size={16} /> Sedes
      </Link>

      {error && <div className="mt-4"><Aviso error={error} /></div>}

      {cargando && (
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Skeleton className="aspect-[16/9] rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      )}

      {sede && <Ficha sede={sede} />}
    </div>
  );
}

function Ficha({ sede }) {
  const canchas = sede.canchas ?? [];
  const datos = [
    { icono: "pin", texto: `${sede.direccion} · ${sede.ciudad}` },
    { icono: "clock", texto: `Abierto de ${hora(sede.horaApertura)} a ${hora(sede.horaCierre)}` },
    sede.telefono && { icono: "phone", texto: sede.telefono, href: `tel:${sede.telefono}` },
    sede.usuario?.nombre && { icono: "user", texto: `Gestionada por ${sede.usuario.nombre}` },
  ].filter(Boolean);
  const emoji = (d) => DEPORTES.find((x) => x.id === d)?.emoji;

  return (
    <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div className="grid gap-6">
        <div className="grid aspect-[16/9] place-items-center overflow-hidden rounded-2xl bg-surface-secondary text-muted">
          {sede.imagen ? <img src={sede.imagen} alt={`Foto de ${sede.nombre}`} className="size-full object-cover" /> : <Icon name="court" size={56} />}
        </div>

        <section aria-labelledby="titulo-canchas">
          <h2 id="titulo-canchas" className="text-2xl font-bold">Canchas</h2>
          {canchas.length === 0 ? (
            <p className="mt-3 rounded-xl bg-surface-secondary px-4 py-6 text-center text-muted">Esta sede no tiene canchas disponibles ahora mismo.</p>
          ) : (
            <ul className="mt-3 grid gap-3">
              {canchas.map((c) => (
                <li key={c.id}>
                  <Card className="flex-row flex-wrap items-center gap-x-4 gap-y-2 p-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-xl" aria-hidden="true">{emoji(c.deporte) ?? "🏟️"}</span>
                    <div className="min-w-0 flex-1 basis-40">
                      <h3 className="font-semibold [overflow-wrap:anywhere]">{c.nombre}</h3>
                      <p className="text-sm text-muted">{nombreDeporte(c.deporte)}{c.superficie ? ` · ${c.superficie}` : ""}</p>
                    </div>
                    <p className="tabular-nums"><strong className="text-lg">{precio(c.precioHora)}</strong> <span className="text-sm text-muted">/ hora</span></p>
                    <Button variant="secondary" size="sm" isDisabled aria-describedby="nota-reservas">Reservar</Button>
                  </Card>
                </li>
              ))}
            </ul>
          )}
          <p id="nota-reservas" className="mt-2 text-sm text-muted">Las reservas se abren en el Sprint 3.</p>
        </section>
      </div>

      {/* En móvil va primero: si no, el nombre de la sede quedaría debajo de todas sus canchas */}
      <Card className="gap-4 p-6 max-lg:order-first lg:sticky lg:top-24">
        <div>
          <h1 className="text-3xl font-bold [overflow-wrap:anywhere]">{sede.nombre}</h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[...new Set(canchas.map((c) => c.deporte))].map((d) => <Chip key={d} size="sm" variant="soft">{nombreDeporte(d)}</Chip>)}
          </div>
        </div>
        <ul className="grid gap-2.5">
          {datos.map((d) => (
            <li key={d.icono} className="flex items-start gap-2.5">
              <Icon name={d.icono} size={18} className="mt-0.5 shrink-0 text-muted" />
              {d.href ? <a href={d.href} className="text-accent hover:underline">{d.texto}</a> : <span>{d.texto}</span>}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
