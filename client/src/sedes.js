// Datos y formatos compartidos por las pantallas de sedes y canchas.

// Mismo orden y mismos ids que el ENUM `deporte` de la API (RY-43).
export const DEPORTES = [
  { id: "futbol5", nombre: "Fútbol 5", emoji: "⚽" },
  { id: "futbol7", nombre: "Fútbol 7", emoji: "🥅" },
  { id: "tenis", nombre: "Tenis", emoji: "🎾" },
  { id: "padel", nombre: "Pádel", emoji: "🏓" },
  { id: "baloncesto", nombre: "Baloncesto", emoji: "🏀" },
];

export const nombreDeporte = (id) => DEPORTES.find((d) => d.id === id)?.nombre ?? id;

// La API manda el DECIMAL como texto ("80000.00"); también acepta un número.
// Sin decimales si es exacto ($ 80.000) y con los dos si no ($ 85.000,50).
const PESOS = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const PESOS_CENTAVOS = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 2 });
export const precio = (valor) => {
  if (valor == null || valor === "") return "—";
  const n = Number(valor);
  return (Number.isInteger(n) ? PESOS : PESOS_CENTAVOS).format(n);
};

// MySQL devuelve TIME con segundos ("08:00:00"); la API los recibe sin ellos ("08:00").
export const hora = (valor) => (valor ? String(valor).slice(0, 5) : "");

// Tipos de imagen que acepta la API (RY-42)
export const TIPOS_IMAGEN = "image/jpeg,image/png,image/webp";
