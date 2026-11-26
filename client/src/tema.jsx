import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore } from "react";

// Tema claro/oscuro. Por defecto sigue al sistema; el botón de la cabecera permite
// cambiarlo solo para este sitio. Hay tres estados posibles:
//   - sin valor guardado → sigue al sistema (<meta name="color-scheme" content="light dark">)
//   - "light" o "dark" guardado en localStorage → fijado por el usuario
// HeroUI necesita además la clase .light/.dark en <html> para sus colores.
// El script en línea de index.html aplica lo mismo antes de pintar (sin parpadeo).

const CLAVE = "color-scheme";
const OSCURO = "(prefers-color-scheme: dark)";

const leerGuardado = () => {
  try {
    const v = localStorage.getItem(CLAVE);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null; // datos del sitio bloqueados: el tema funciona igual, solo no se recuerda
  }
};

const guardar = (valor) => {
  try {
    if (valor) localStorage.setItem(CLAVE, valor);
    else localStorage.removeItem(CLAVE);
  } catch { /* ídem */ }
};

// Preferencia del sistema, reactiva: si cambia (p. ej. modo automático por la noche), se actualiza.
const suscribirSistema = (avisar) => {
  const mq = matchMedia(OSCURO);
  mq.addEventListener("change", avisar);
  return () => mq.removeEventListener("change", avisar);
};
const leerSistema = () => (matchMedia(OSCURO).matches ? "dark" : "light");

function aplicar(guardado, visible) {
  const html = document.documentElement;
  html.classList.remove("light", "dark");
  html.classList.add(visible);
  html.dataset.theme = visible;
  document.querySelector('meta[name="color-scheme"]')?.setAttribute("content", guardado ?? "light dark");
}

const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const [guardado, setGuardado] = useState(leerGuardado);
  const sistema = useSyncExternalStore(suscribirSistema, leerSistema);
  const visible = guardado ?? sistema;

  useEffect(() => aplicar(guardado, visible), [guardado, visible]);

  // Si se cambia en otra pestaña, esta se pone igual
  useEffect(() => {
    const alCambiar = (e) => { if (e.key === CLAVE) setGuardado(leerGuardado()); };
    window.addEventListener("storage", alCambiar);
    return () => window.removeEventListener("storage", alCambiar);
  }, []);

  // Botón de dos estados: pasa a lo contrario de lo que se ve. Si eso coincide con el
  // sistema, se borra lo guardado (vuelves a seguir al sistema) en vez de fijarlo para siempre.
  const alternar = useCallback(() => {
    const destino = visible === "dark" ? "light" : "dark";
    const nuevo = destino === sistema ? null : destino;
    guardar(nuevo);
    setGuardado(nuevo);
  }, [visible, sistema]);

  return <TemaContext.Provider value={{ visible, guardado, alternar }}>{children}</TemaContext.Provider>;
}

export const useTema = () => useContext(TemaContext);
