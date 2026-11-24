import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { Cargando, Icon } from "./ui.jsx";

// Sin sesión → al login (y vuelve aquí después). Con rol incorrecto → aviso 403.
// Ojo: esto es solo comodidad visual. Quien protege de verdad es la API.
export default function RutaProtegida({ rol, children }) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) return <Cargando />;
  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  if (rol && usuario.rol !== rol) {
    return (
      <div className="contenedor vacio">
        <Icon name="shield" size={40} />
        <h1>No tienes permiso</h1>
        <p>Esta sección es solo para administradores de sedes.</p>
        <Link to="/" className="btn btn-primario">Volver al inicio</Link>
      </div>
    );
  }
  return children;
}
