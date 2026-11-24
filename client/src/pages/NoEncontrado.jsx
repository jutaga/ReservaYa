import { Link } from "react-router-dom";
import { Icon } from "../components/ui.jsx";

export default function NoEncontrado() {
  return (
    <div className="contenedor vacio">
      <Icon name="ball" size={44} />
      <h1>Fuera de juego</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn btn-primario">Volver al inicio</Link>
    </div>
  );
}
