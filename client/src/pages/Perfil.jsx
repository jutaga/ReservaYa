import { Avatar, Card, Chip, Separator } from "@heroui/react";
import { useAuth, useCerrarSesion } from "../auth.jsx";
import { Boton, BotonLink, Icon, iniciales } from "../components/ui.jsx";

export default function Perfil() {
  const { usuario } = useAuth();
  const salir = useCerrarSesion();
  const esAdmin = usuario.rol === "admin";

  const datos = [
    { icono: "user", etiqueta: "Nombre", valor: usuario.nombre },
    { icono: "mail", etiqueta: "Email", valor: usuario.email },
    { icono: "phone", etiqueta: "Teléfono", valor: usuario.telefono || <span className="text-muted">—</span> },
    {
      icono: "shield",
      etiqueta: "Rol",
      valor: esAdmin
        ? <Chip size="sm" className="bg-[var(--admin-soft)] text-[var(--admin)]">Admin de sede</Chip>
        : <Chip size="sm" variant="soft">Cliente</Chip>,
    },
  ];

  return (
    <div className="contenedor py-10">
      <div className="flex items-center gap-4">
        <Avatar size="lg" color="accent" className="size-16 text-xl">
          <Avatar.Fallback className="bg-accent text-accent-foreground">{iniciales(usuario.nombre)}</Avatar.Fallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">Hola, {usuario.nombre?.split(" ")[0]}</h1>
          <p className="text-muted">
            {esAdmin ? "Administras sedes en ReservaYa." : "Listo para tu próximo partido."}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Card className="p-6">
          <Card.Header>
            <h2 className="text-xl font-semibold">Tus datos</h2>
          </Card.Header>
          <Card.Content>
            <dl className="grid">
              {datos.map((d, i) => (
                <div key={d.etiqueta}>
                  {i > 0 && <Separator />}
                  <div className="flex items-center justify-between gap-4 py-3">
                    <dt className="flex items-center gap-2 text-muted"><Icon name={d.icono} size={16} /> {d.etiqueta}</dt>
                    <dd className="text-end font-medium [overflow-wrap:anywhere]">{d.valor}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Card.Content>
          <Card.Footer className="pt-2">
            <Boton variante="secundario" onPress={salir}><Icon name="logout" size={16} /> Cerrar sesión</Boton>
          </Card.Footer>
        </Card>

        <Card className="p-6">
          <Card.Header>
            <h2 className="text-xl font-semibold">{esAdmin ? "Tus sedes" : "Mis reservas"}</h2>
          </Card.Header>
          <Card.Content className="grid flex-1 place-items-center gap-3 py-8 text-center text-muted">
            <span className="grid size-14 place-items-center rounded-full bg-surface-secondary">
              <Icon name={esAdmin ? "court" : "calendar"} size={28} />
            </span>
            <p>{esAdmin
              ? "Pronto podrás dar de alta tus sedes y canchas."
              : "Aquí verás tus próximas reservas en cuanto puedas reservar."}</p>
            {esAdmin && <BotonLink to="/admin" size="sm">Ir al panel</BotonLink>}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
