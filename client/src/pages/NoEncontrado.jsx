import { BotonLink, Vacio } from "../components/ui.jsx";

export default function NoEncontrado() {
  return (
    <Vacio icono="ball" titulo="Fuera de juego" accion={<BotonLink to="/">Volver al inicio</BotonLink>}>
      La página que buscas no existe.
    </Vacio>
  );
}
