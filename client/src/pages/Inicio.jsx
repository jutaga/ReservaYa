import { Link } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { Icon } from "../components/ui.jsx";

const DEPORTES = [
  { id: "futbol5", nombre: "Fútbol 5", emoji: "⚽" },
  { id: "futbol7", nombre: "Fútbol 7", emoji: "🥅" },
  { id: "tenis", nombre: "Tenis", emoji: "🎾" },
  { id: "padel", nombre: "Pádel", emoji: "🏓" },
  { id: "baloncesto", nombre: "Baloncesto", emoji: "🏀" },
];

const PASOS = [
  { icono: "search", titulo: "Busca", texto: "Filtra por ciudad y deporte para encontrar sedes cerca de ti." },
  { icono: "clock", titulo: "Elige tu hora", texto: "Ve qué horas están libres y reserva de 1 a 3 horas." },
  { icono: "check", titulo: "Juega", texto: "Recibes la confirmación por email. Puedes cancelar hasta 2 h antes." },
];

export default function Inicio() {
  const { usuario } = useAuth();
  return (
    <>
      <section className="hero">
        <div className="contenedor hero-fila">
          <div className="hero-texto">
            <span className="hero-etiqueta"><Icon name="ball" size={16} /> Canchas por horas</span>
            <h1>Reserva tu cancha <span className="resaltado">en segundos</span></h1>
            <p>Fútbol, tenis, pádel y baloncesto. Mira qué horas quedan libres y asegura tu turno sin llamadas ni esperas.</p>

            <form className="buscador" onSubmit={(e) => e.preventDefault()} aria-describedby="buscador-nota">
              <label className="buscador-campo">
                <Icon name="pin" />
                <input placeholder="Ciudad" disabled />
              </label>
              <label className="buscador-campo">
                <Icon name="ball" />
                <select disabled defaultValue="">
                  <option value="">Cualquier deporte</option>
                  {DEPORTES.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                </select>
              </label>
              <button className="btn btn-primario" disabled><Icon name="search" /> Buscar</button>
            </form>
            <p id="buscador-nota" className="hero-nota">El buscador de sedes se activa en el Sprint 2.</p>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="cancha">
              <div className="cancha-linea" />
              <div className="cancha-circulo" />
              <div className="cancha-area izq" />
              <div className="cancha-area der" />
            </div>
            <div className="ticket">
              <div className="ticket-cab"><Icon name="check" size={16} /> Reserva confirmada</div>
              <strong>Cancha 2 · Fútbol 5</strong>
              <span><Icon name="calendar" size={14} /> Sáb 28 dic</span>
              <span><Icon name="clock" size={14} /> 19:00 – 21:00</span>
            </div>
          </div>
        </div>
      </section>

      <section className="contenedor seccion">
        <h2 className="titulo-seccion">¿A qué quieres jugar?</h2>
        <div className="deportes">
          {DEPORTES.map((d) => (
            <div key={d.id} className="deporte"><span className="deporte-emoji">{d.emoji}</span>{d.nombre}</div>
          ))}
        </div>
      </section>

      <section className="contenedor seccion">
        <h2 className="titulo-seccion">Así de fácil</h2>
        <div className="grid-3">
          {PASOS.map((p, i) => (
            <div key={p.titulo} className="tarjeta paso">
              <div className="paso-num">{i + 1}</div>
              <div className="tarjeta-icono"><Icon name={p.icono} size={22} /></div>
              <h3>{p.titulo}</h3>
              <p className="texto-suave">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {!usuario && (
        <section className="contenedor seccion">
          <div className="cta">
            <div>
              <h2>¿Listo para el próximo partido?</h2>
              <p>Crea tu cuenta gratis y reserva en cuanto abran las sedes.</p>
            </div>
            <Link to="/registro" className="btn btn-claro">Crear cuenta</Link>
          </div>
        </section>
      )}
    </>
  );
}
