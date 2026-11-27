import { Link } from "react-router-dom";
import { Card } from "@heroui/react";
import { useAuth } from "../auth.jsx";
import { DEPORTES } from "../sedes.js";
import Buscador from "../components/Buscador.jsx";
import { BotonLink, Icon } from "../components/ui.jsx";

const PASOS = [
  { icono: "search", titulo: "Busca", texto: "Filtra por ciudad y deporte para encontrar sedes cerca de ti." },
  { icono: "clock", titulo: "Elige tu hora", texto: "Ve qué horas están libres y reserva de 1 a 3 horas." },
  { icono: "check", titulo: "Juega", texto: "Recibes la confirmación por email. Puedes cancelar hasta 2 h antes." },
];

export default function Inicio() {
  const { usuario } = useAuth();
  return (
    <div className="pb-14">
      <section className="overflow-hidden border-b border-separator bg-linear-160 from-accent-soft to-background to-70% py-14 sm:py-16">
        <div className="contenedor grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-sm font-semibold text-accent">
              <Icon name="ball" size={16} /> Canchas por horas
            </span>
            <h1 className="text-[clamp(2.1rem,5.5vw,3.4rem)] leading-[1.05] font-extrabold">
              Reserva tu cancha <span className="resaltado">en segundos</span>
            </h1>
            <p className="mt-4 max-w-[520px] text-lg text-muted">
              Fútbol, tenis, pádel y baloncesto. Mira qué horas quedan libres y asegura tu turno sin llamadas ni esperas.
            </p>

            <Buscador className="mt-7" />
          </div>

          <div className="relative max-w-[460px] pt-5 pb-10 lg:max-w-none" aria-hidden="true">
            <div className="cancha">
              <div className="cancha-linea" />
              <div className="cancha-circulo" />
              <div className="cancha-area izq" />
              <div className="cancha-area der" />
            </div>
            <Card className="absolute right-0 bottom-0 min-w-[210px] gap-1 p-4 text-sm shadow-lg">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-success"><Icon name="check" size={16} /> Reserva confirmada</span>
              <strong>Cancha 2 · Fútbol 5</strong>
              <span className="flex items-center gap-1.5 text-muted"><Icon name="calendar" size={14} /> Sáb 28 dic</span>
              <span className="flex items-center gap-1.5 text-muted"><Icon name="clock" size={14} /> 19:00 – 21:00</span>
            </Card>
          </div>
        </div>
      </section>

      <section className="contenedor pt-12">
        <h2 className="text-2xl font-bold">¿A qué quieres jugar?</h2>
        <ul className="mt-4 flex flex-wrap gap-3">
          {DEPORTES.map((d) => (
            <li key={d.id}>
              <Link to={`/sedes?deporte=${d.id}`} className="flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2.5 font-semibold shadow-surface transition hover:border-accent hover:text-accent">
                <span className="text-2xl leading-none" aria-hidden="true">{d.emoji}</span>{d.nombre}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="contenedor pt-12">
        <h2 className="text-2xl font-bold">Así de fácil</h2>
        <ol className="mt-5 grid gap-5 md:grid-cols-3">
          {PASOS.map((p, i) => (
            <li key={p.titulo} className="grid">
              <Card className="relative gap-2 p-6">
                <span className="absolute top-4 right-5 font-display text-4xl font-extrabold text-surface-tertiary" aria-hidden="true">{i + 1}</span>
                <span className="mb-2 grid size-11 place-items-center rounded-xl bg-accent-soft text-accent-soft-foreground">
                  <Icon name={p.icono} size={22} />
                </span>
                <h3 className="text-lg font-semibold">{p.titulo}</h3>
                <p className="text-muted">{p.texto}</p>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      {!usuario && (
        <section className="contenedor pt-12">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-linear-120 from-[#0f766e] to-[#115e59] p-8 text-white sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold">¿Listo para el próximo partido?</h2>
              <p className="opacity-85">Crea tu cuenta gratis y reserva en cuanto se abran las reservas.</p>
            </div>
            <BotonLink to="/registro" variante="secundario" className="bg-white text-[#0b5f58] hover:bg-white/90">Crear cuenta</BotonLink>
          </div>
        </section>
      )}
    </div>
  );
}
