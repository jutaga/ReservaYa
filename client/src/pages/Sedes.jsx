import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, Chip, Pagination, Skeleton } from "@heroui/react";
import { api } from "../api.js";
import { nombreDeporte, precio } from "../sedes.js";
import Buscador from "../components/Buscador.jsx";
import { Aviso, BotonLink, Icon } from "../components/ui.jsx";

const LIMITE = 9; // 3 filas de 3 en escritorio

// Catálogo público: GET /api/sedes?ciudad&deporte&q&pagina&limite. Los filtros viven en la URL.
export default function Sedes() {
  const [params, setParams] = useSearchParams();
  const ciudad = params.get("ciudad") ?? "";
  const deporte = params.get("deporte") ?? "";
  const q = params.get("q") ?? "";
  const pagina = Number(params.get("pagina")) || 1;
  const consulta = new URLSearchParams({ ...(ciudad && { ciudad }), ...(deporte && { deporte }), ...(q && { q }), pagina, limite: LIMITE }).toString();

  const [estado, setEstado] = useState({ cargando: true });

  useEffect(() => {
    // Si cambian los filtros antes de que llegue la respuesta, se cancela la anterior:
    // así nunca se pinta una página vieja encima de la nueva.
    const ctrl = new AbortController();
    setEstado((e) => ({ ...e, cargando: true, error: null }));
    api(`/sedes?${consulta}`, { signal: ctrl.signal })
      .then((data) => {
        if (!Array.isArray(data.sedes)) {
          console.warn("[contrato] GET /api/sedes debería devolver { sedes, total, pagina, paginas }");
          throw Object.assign(new Error("La respuesta del catálogo no tiene el formato esperado."),
            { contrato: 'GET /api/sedes debería responder { "sedes": [...], "total", "pagina", "paginas" }.' });
        }
        setEstado({ data });
      })
      .catch((error) => {
        if (error.name !== "AbortError") setEstado({ error });
      });
    return () => ctrl.abort();
  }, [consulta]);

  const irA = (p) => {
    const nuevos = new URLSearchParams(params);
    nuevos.set("pagina", p);
    setParams(nuevos);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { cargando, data, error } = estado;
  const filtros = [ciudad && `en ${ciudad}`, deporte && nombreDeporte(deporte), q && `“${q}”`].filter(Boolean);

  return (
    <div className="contenedor py-10">
      <h1 className="text-3xl font-bold">Sedes</h1>
      <p className="text-muted">Encuentra dónde jugar y mira sus canchas y precios.</p>

      {/* key: si cambia la URL (Atrás, un enlace), el formulario se rellena con los filtros nuevos */}
      <Buscador key={`${ciudad}|${deporte}|${q}`} inicial={{ ciudad, deporte, q }} conNombre className="mt-6" />

      <div className="mt-6 flex min-h-6 flex-wrap items-center justify-between gap-2" aria-live="polite">
        {data && !cargando && (
          <p className="text-sm text-muted">
            {data.total === 1 ? "1 sede" : `${data.total} sedes`}{filtros.length ? ` · ${filtros.join(" · ")}` : ""}
          </p>
        )}
        {filtros.length > 0 && <Link to="/sedes" className="text-sm font-medium text-accent hover:underline">Quitar filtros</Link>}
      </div>

      {error && <div className="mt-3"><Aviso error={error} /></div>}
      {error?.errores?.length > 0 && (
        <ul className="mt-2 list-disc ps-6 text-sm text-muted">{error.errores.map((e) => <li key={e.campo}>{e.campo}: {e.mensaje}</li>)}</ul>
      )}

      <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cargando && !data && Array.from({ length: 6 }, (_, k) => <Skeleton key={k} className="h-72 rounded-2xl" />)}
        {data?.sedes.map((s) => <TarjetaSede key={s.id} sede={s} atenuada={cargando} />)}
      </div>

      {data && !cargando && data.sedes.length === 0 && (
        <Card className="mt-3 grid justify-items-center gap-2 px-6 py-14 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-surface-secondary text-muted"><Icon name="search" size={26} /></span>
          <h2 className="text-xl font-semibold">{pagina > 1 && data.total > 0 ? "Esta página está vacía" : "No hay sedes con esos filtros"}</h2>
          <p className="text-muted">{pagina > 1 && data.total > 0 ? "Hay menos páginas de resultados." : "Prueba con otra ciudad u otro deporte."}</p>
          <BotonLink to={pagina > 1 && data.total > 0 ? `/sedes?${new URLSearchParams({ ...(ciudad && { ciudad }), ...(deporte && { deporte }), ...(q && { q }) })}` : "/sedes"} variante="secundario" className="mt-2">
            {pagina > 1 && data.total > 0 ? "Ir a la primera página" : "Ver todas las sedes"}
          </BotonLink>
        </Card>
      )}

      {data?.paginas > 1 && <Paginacion pagina={pagina} paginas={data.paginas} irA={irA} />}
    </div>
  );
}

function TarjetaSede({ sede, atenuada }) {
  return (
    <Link to={`/sedes/${sede.id}`}
      className={`group grid overflow-hidden rounded-2xl border border-border bg-surface shadow-surface transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${atenuada ? "opacity-60" : ""}`}>
      <div className="grid aspect-[16/9] place-items-center overflow-hidden bg-surface-secondary text-muted">
        {sede.imagen
          ? <img src={sede.imagen} alt="" loading="lazy" className="size-full object-cover transition group-hover:scale-[1.02]" />
          : <Icon name="court" size={40} />}
      </div>
      <div className="grid gap-2 p-4">
        <div>
          <h2 className="text-lg font-semibold [overflow-wrap:anywhere]">{sede.nombre}</h2>
          <p className="flex items-center gap-1 text-sm text-muted"><Icon name="pin" size={14} /> {sede.ciudad}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(sede.deportes ?? []).map((d) => <Chip key={d} size="sm" variant="soft">{nombreDeporte(d)}</Chip>)}
        </div>
        {sede.precioDesde != null && (
          <p className="text-sm">Desde <strong className="text-base tabular-nums">{precio(sede.precioDesde)}</strong> <span className="text-muted">/ hora</span></p>
        )}
      </div>
    </Link>
  );
}

// 1 … 4 5 6 … 12: siempre la primera, la última y las dos vecinas de la actual
function numeros(pagina, paginas) {
  const set = new Set([1, paginas, pagina - 1, pagina, pagina + 1].filter((p) => p >= 1 && p <= paginas));
  const lista = [...set].sort((a, b) => a - b);
  return lista.flatMap((p, i) => (i > 0 && p - lista[i - 1] > 1 ? ["…", p] : [p]));
}

function Paginacion({ pagina, paginas, irA }) {
  return (
    <Pagination className="mt-8 justify-center" aria-label="Páginas de resultados">
      <Pagination.Content>
        <Pagination.Item>
          <Pagination.Previous isDisabled={pagina <= 1} onPress={() => irA(pagina - 1)}>
            <Pagination.PreviousIcon /><span className="max-sm:sr-only">Anterior</span>
          </Pagination.Previous>
        </Pagination.Item>
        {numeros(pagina, paginas).map((p, i) => (
          <Pagination.Item key={`${p}-${i}`}>
            {p === "…" ? <Pagination.Ellipsis /> : (
              <Pagination.Link isActive={p === pagina} onPress={() => irA(p)} aria-label={`Página ${p}`}
                aria-current={p === pagina ? "page" : undefined}>{p}</Pagination.Link>
            )}
          </Pagination.Item>
        ))}
        <Pagination.Item>
          <Pagination.Next isDisabled={pagina >= paginas} onPress={() => irA(pagina + 1)}>
            <span className="max-sm:sr-only">Siguiente</span><Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
