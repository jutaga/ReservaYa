import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { BotonLink, Cargando, Vacio } from "./ui.jsx";

// Sin sesión → al login (y vuelve aquí después). Con rol incorrecto → aviso 403.
// Ojo: esto es solo comodidad visual. Quien protege de verdad es la API.
export default function RutaProtegida({ rol, children }) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) return <Cargando />;
  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  if (rol && usuario.rol !== rol) {
    return (
      <Vacio icono="shield" titulo="No tienes permiso" accion={<BotonLink to="/">Volver al inicio</BotonLink>}>
        Esta sección es solo para administradores de sedes.
      </Vacio>
    );
  }
  return children;
}
