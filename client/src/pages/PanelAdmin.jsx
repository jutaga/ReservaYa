import { useEffect, useState } from "react";
import { Card, Chip, Skeleton } from "@heroui/react";
import { api } from "../api.js";
import { Aviso, Icon } from "../components/ui.jsx";

const SECCIONES = [
  { icono: "court", titulo: "Mis sedes", texto: "Crea y edita tus sedes, su horario y su foto." },
  { icono: "ball", titulo: "Canchas", texto: "Deporte, superficie y precio por hora de cada cancha." },
  { icono: "calendar", titulo: "Reservas", texto: "Las reservas de tus sedes, día a día." },
];

export default function PanelAdmin() {
  const [ping, setPing] = useState({ cargando: true });

  // Comprueba la ruta de prueba de la historia "Proteger rutas por rol"
  useEffect(() => {
    api("/admin/ping")
      .then(() => setPing({ ok: true }))
      .catch((error) => setPing({ error }));
  }, []);

  return (
    <div className="contenedor py-10">
      <h1 className="text-3xl font-bold">Panel de admin</h1>
      <p className="text-muted">Gestiona tus sedes, canchas y reservas.</p>

      <div className="mt-5">
        {ping.cargando && <Skeleton className="h-14 w-full rounded-xl" />}
        {ping.ok && <Aviso tipo="ok">La API reconoce tu rol de admin (<code>GET /api/admin/ping</code> → 200).</Aviso>}
        {ping.error && <Aviso error={ping.error} />}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {SECCIONES.map((s) => (
          <Card key={s.titulo} className="gap-3 p-6">
            <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-soft-foreground">
              <Icon name={s.icono} size={22} />
            </span>
            <h2 className="text-lg font-semibold">{s.titulo}</h2>
            <p className="text-muted">{s.texto}</p>
            <Chip size="sm" variant="soft" className="mt-auto w-fit">Próximamente</Chip>
          </Card>
        ))}
      </div>
    </div>
  );
}
