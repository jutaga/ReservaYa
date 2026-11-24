import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx";
import Inicio from "./pages/Inicio.jsx";
import Registro from "./pages/Registro.jsx";
import Login from "./pages/Login.jsx";
import Confirmar from "./pages/Confirmar.jsx";
import OlvidePassword from "./pages/OlvidePassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Perfil from "./pages/Perfil.jsx";
import PanelAdmin from "./pages/PanelAdmin.jsx";
import NoEncontrado from "./pages/NoEncontrado.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="registro" element={<Registro />} />
        <Route path="login" element={<Login />} />
        <Route path="confirmar/:token" element={<Confirmar />} />
        <Route path="olvide-password" element={<OlvidePassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="perfil" element={<RutaProtegida><Perfil /></RutaProtegida>} />
        <Route path="admin" element={<RutaProtegida rol="admin"><PanelAdmin /></RutaProtegida>} />
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}
