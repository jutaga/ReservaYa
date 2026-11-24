import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { Icon } from "./ui.jsx";
import EstadoApi from "./EstadoApi.jsx";

export default function Layout() {
  return (
    <div className="app">
      <Cabecera />
      <main className="main">
        <Outlet />
      </main>
      <footer className="pie">
        <div className="contenedor pie-fila">
          <span>ReservaYa · proyecto de práctica</span>
          <EstadoApi />
        </div>
      </footer>
    </div>
  );
}

function Cabecera() {
  const { usuario, cargando } = useAuth();
  return (
    <header className="cabecera">
      <div className="contenedor cabecera-fila">
        <Link to="/" className="marca">
          <span className="marca-logo"><Icon name="court" size={20} /></span>
          <span>Reserva<b>Ya</b></span>
        </Link>
        <nav className="nav">
          <NavLink to="/" end>Inicio</NavLink>
          <span className="nav-pronto" title="Llega en el Sprint 2">Sedes <small>pronto</small></span>
        </nav>
        <div className="cabecera-derecha">
          {cargando ? null : usuario ? <MenuUsuario usuario={usuario} /> : (
            <>
              <Link to="/login" className="btn btn-fantasma">Iniciar sesión</Link>
              <Link to="/registro" className="btn btn-primario btn-sm">Crear cuenta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuUsuario({ usuario }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  useEffect(() => setAbierto(false), [location.pathname]);
  useEffect(() => {
    const cerrar = (e) => { if (!ref.current?.contains(e.target)) setAbierto(false); };
    document.addEventListener("click", cerrar);
    return () => document.removeEventListener("click", cerrar);
  }, []);

  const salir = async () => {
    await logout();
    navigate("/login", { state: { mensaje: "Sesión cerrada." } });
  };

  const iniciales = (usuario.nombre || usuario.email || "?").trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="menu-usuario" ref={ref}>
      <button className="avatar-btn" onClick={() => setAbierto(!abierto)} aria-expanded={abierto}>
        <span className="avatar">{iniciales}</span>
        <span className="avatar-nombre">{usuario.nombre}</span>
        {usuario.rol === "admin" && <span className="chip chip-admin">Admin</span>}
      </button>
      {abierto && (
        <div className="menu">
          <div className="menu-cab">
            <strong>{usuario.nombre}</strong>
            <span>{usuario.email}</span>
          </div>
          <Link to="/perfil"><Icon name="user" /> Mi perfil</Link>
          {usuario.rol === "admin" && <Link to="/admin"><Icon name="shield" /> Panel de admin</Link>}
          <button onClick={salir}><Icon name="logout" /> Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}
