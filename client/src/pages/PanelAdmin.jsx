import { useEffect, useState } from "react";
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
    <div className="contenedor pagina">
      <h1>Panel de admin</h1>
      <p className="texto-suave">Gestiona tus sedes, canchas y reservas.</p>

      {ping.ok && <Aviso tipo="ok">La API reconoce tu rol de admin (<code>GET /api/admin/ping</code> → 200).</Aviso>}
      {ping.error && <Aviso error={ping.error} />}

      <div className="grid-3">
        {SECCIONES.map((s) => (
          <div key={s.titulo} className="tarjeta tarjeta-pronto">
            <div className="tarjeta-icono"><Icon name={s.icono} size={22} /></div>
            <h2>{s.titulo}</h2>
            <p className="texto-suave">{s.texto}</p>
            <span className="chip">Próximamente</span>
          </div>
        ))}
      </div>
    </div>
  );
}
