import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";
import { Boton, Icon } from "../components/ui.jsx";

export default function Perfil() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const iniciales = (usuario.nombre || "?").trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const salir = async () => {
    await logout();
    navigate("/login", { state: { mensaje: "Sesión cerrada." } });
  };

  return (
    <div className="contenedor pagina">
      <div className="perfil-cab">
        <span className="avatar avatar-grande">{iniciales}</span>
        <div>
          <h1>Hola, {usuario.nombre?.split(" ")[0]}</h1>
          <p className="texto-suave">
            {usuario.rol === "admin" ? "Administras sedes en ReservaYa." : "Listo para tu próximo partido."}
          </p>
        </div>
      </div>

      <div className="grid-2">
        <section className="tarjeta">
          <h2>Tus datos</h2>
          <dl className="datos">
            <div><dt><Icon name="user" /> Nombre</dt><dd>{usuario.nombre}</dd></div>
            <div><dt><Icon name="mail" /> Email</dt><dd>{usuario.email}</dd></div>
            <div><dt><Icon name="phone" /> Teléfono</dt><dd>{usuario.telefono || <span className="texto-suave">—</span>}</dd></div>
            <div><dt><Icon name="shield" /> Rol</dt><dd><span className={`chip ${usuario.rol === "admin" ? "chip-admin" : ""}`}>{usuario.rol === "admin" ? "Admin de sede" : "Cliente"}</span></dd></div>
          </dl>
          <Boton variante="secundario" onClick={salir}><Icon name="logout" /> Cerrar sesión</Boton>
        </section>

        <section className="tarjeta tarjeta-pronto">
          <h2>{usuario.rol === "admin" ? "Tus sedes" : "Mis reservas"}</h2>
          <div className="vacio vacio-chico">
            <Icon name={usuario.rol === "admin" ? "court" : "calendar"} size={36} />
            <p>{usuario.rol === "admin"
              ? "Pronto podrás dar de alta tus sedes y canchas."
              : "Aquí verás tus próximas reservas en cuanto puedas reservar."}</p>
            {usuario.rol === "admin" && <Link to="/admin" className="btn btn-primario btn-sm">Ir al panel</Link>}
          </div>
        </section>
      </div>
    </div>
  );
}
