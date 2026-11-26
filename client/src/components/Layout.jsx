import { Link, NavLink, Outlet } from "react-router-dom";
import { Avatar, Button, Chip, Dropdown, Header, Label, Toast, Tooltip } from "@heroui/react";
import { useAuth, useCerrarSesion } from "../auth.jsx";
import { useTema } from "../tema.jsx";
import { BotonLink, Icon, iniciales } from "./ui.jsx";
import EstadoApi from "./EstadoApi.jsx";

export default function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Cabecera />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-separator bg-surface">
        <div className="contenedor flex flex-wrap items-center justify-between gap-3 py-4 text-sm text-muted">
          <span>ReservaYa · proyecto de práctica</span>
          <EstadoApi />
        </div>
      </footer>
      {/* Donde aparecen los toast() de toda la app */}
      <Toast.Provider placement="bottom end" />
    </div>
  );
}

const claseNav = ({ isActive }) =>
  `rounded-lg px-3 py-1.5 font-medium transition-colors ${
    isActive ? "bg-accent-soft text-accent-soft-foreground" : "text-muted hover:bg-default hover:text-foreground"
  }`;

function Cabecera() {
  const { usuario, cargando } = useAuth();
  return (
    <header className="sticky top-0 z-20 border-b border-separator bg-background/85 backdrop-blur-md">
      <div className="contenedor flex h-16 items-center gap-3 sm:gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-display text-lg font-bold tracking-tight sm:gap-2.5 sm:text-xl">
          <span className="grid size-8 place-items-center rounded-xl bg-accent text-accent-foreground sm:size-9">
            <Icon name="court" size={20} />
          </span>
          <span>Reserva<span className="text-accent">Ya</span></span>
        </Link>
        <nav className="hidden gap-1 sm:flex" aria-label="Principal">
          <NavLink to="/" end className={claseNav}>Inicio</NavLink>
          <span className="flex cursor-default items-center gap-1.5 px-3 py-1.5 font-medium text-muted/70" title="Llega en el Sprint 2">
            Sedes <Chip size="sm" variant="soft">pronto</Chip>
          </span>
        </nav>
        <div className="ms-auto flex items-center gap-1 sm:gap-2">
          <BotonTema />
          {cargando ? null : usuario ? <MenuUsuario usuario={usuario} /> : (
            <>
              {/* En móvil no caben los dos botones con el texto largo */}
              <BotonLink to="/login" variante="fantasma" size="sm">
                <span className="sm:hidden">Entrar</span>
                <span className="max-sm:hidden">Iniciar sesión</span>
              </BotonLink>
              <BotonLink to="/registro" size="sm" className="max-sm:px-3">Crear cuenta</BotonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// Muestra el tema que se ve ahora (sol = claro, luna = oscuro) y al pulsar pasa al contrario.
// La lógica (seguir al sistema o fijarlo) está en src/tema.jsx.
function BotonTema() {
  const { visible, alternar } = useTema();
  const destino = visible === "dark" ? "claro" : "oscuro";
  return (
    <Tooltip delay={400}>
      <Button isIconOnly variant="ghost" size="sm" onPress={alternar} aria-label={`Cambiar a tema ${destino}`}>
        <Icon name={visible === "dark" ? "moon" : "sun"} size={18} />
      </Button>
      <Tooltip.Content>Cambiar a tema {destino}</Tooltip.Content>
    </Tooltip>
  );
}

function MenuUsuario({ usuario }) {
  const salir = useCerrarSesion();
  const esAdmin = usuario.rol === "admin";

  // Menú accesible de HeroUI (React Aria): flechas para moverse, Esc para cerrar,
  // y los elementos con href navegan con React Router (RouterProvider en main.jsx).
  return (
    <Dropdown>
      {/* El nombre visible va primero en la etiqueta (WCAG 2.5.3) y las iniciales se ocultan: solo decoran. */}
      <Button variant="ghost" className="h-auto gap-2 rounded-full py-1 ps-1 pe-2" aria-label={`${usuario.nombre}, menú de tu cuenta`}>
        <Avatar size="sm" color="accent" aria-hidden="true">
          <Avatar.Fallback className="bg-accent text-accent-foreground">{iniciales(usuario.nombre || usuario.email)}</Avatar.Fallback>
        </Avatar>
        <span className="max-w-[140px] truncate font-medium max-sm:sr-only">{usuario.nombre}</span>
        {esAdmin && <Chip size="sm" className="bg-[var(--admin-soft)] text-[var(--admin)] max-sm:hidden">Admin</Chip>}
        <Icon name="chevron" size={14} className="text-muted max-sm:hidden" />
      </Button>
      <Dropdown.Popover placement="bottom end" className="min-w-60">
        <Dropdown.Menu aria-label="Tu cuenta" onAction={(key) => key === "salir" && salir()}>
          <Dropdown.Section>
            <Header className="grid px-2 pt-1 pb-2">
              <strong className="truncate text-foreground">{usuario.nombre}</strong>
              <span className="truncate text-xs font-normal text-muted">{usuario.email}</span>
            </Header>
            <Dropdown.Item id="perfil" href="/perfil" textValue="Mi perfil" aria-label="Mi perfil">
              <Icon name="user" size={16} />
              <Label>Mi perfil</Label>
            </Dropdown.Item>
            {esAdmin && (
              <Dropdown.Item id="admin" href="/admin" textValue="Panel de admin" aria-label="Panel de admin">
                <Icon name="shield" size={16} />
                <Label>Panel de admin</Label>
              </Dropdown.Item>
            )}
            <Dropdown.Item id="salir" textValue="Cerrar sesión" aria-label="Cerrar sesión" variant="danger">
              <Icon name="logout" size={16} />
              <Label>Cerrar sesión</Label>
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
