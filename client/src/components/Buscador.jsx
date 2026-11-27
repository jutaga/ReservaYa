import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, InputGroup, Label, ListBox, Select, TextField } from "@heroui/react";
import { DEPORTES } from "../sedes.js";
import { Icon } from "./ui.jsx";

const TODOS = "todos";

// Formulario de búsqueda de sedes. Al buscar, va a /sedes con los filtros en la URL
// (así se pueden compartir, y Atrás vuelve a la búsqueda anterior). Empieza siempre en la página 1.
export default function Buscador({ inicial = {}, conNombre = false, className = "" }) {
  const navigate = useNavigate();
  const [ciudad, setCiudad] = useState(inicial.ciudad ?? "");
  const [deporte, setDeporte] = useState(inicial.deporte || TODOS);
  const [q, setQ] = useState(inicial.q ?? "");

  const buscar = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (ciudad.trim()) params.set("ciudad", ciudad.trim());
    if (deporte !== TODOS) params.set("deporte", deporte);
    if (conNombre && q.trim()) params.set("q", q.trim());
    navigate(`/sedes${params.size ? `?${params}` : ""}`);
  };

  return (
    <form onSubmit={buscar} role="search" aria-label="Buscar sedes"
      className={`grid gap-2 rounded-2xl border border-border bg-surface p-2 shadow-surface ${
        conNombre ? "sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]" : "sm:grid-cols-[1fr_1fr_auto]"} ${className}`}>
      <TextField aria-label="Ciudad" variant="secondary" value={ciudad} onChange={setCiudad}>
        <InputGroup variant="secondary">
          <InputGroup.Prefix><Icon name="pin" size={16} /></InputGroup.Prefix>
          <InputGroup.Input placeholder="Ciudad" autoComplete="address-level2" className="min-w-0 flex-1" />
        </InputGroup>
      </TextField>
      <Select aria-label="Deporte" variant="secondary" value={deporte} onChange={(v) => setDeporte(v ?? TODOS)}>
        <Label className="sr-only">Deporte</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id={TODOS} textValue="Cualquier deporte">Cualquier deporte<ListBox.ItemIndicator /></ListBox.Item>
            {DEPORTES.map((d) => (
              <ListBox.Item key={d.id} id={d.id} textValue={d.nombre}>{d.emoji} {d.nombre}<ListBox.ItemIndicator /></ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      {conNombre && (
        <TextField aria-label="Nombre de la sede" variant="secondary" value={q} onChange={setQ}>
          <InputGroup variant="secondary">
            <InputGroup.Prefix><Icon name="search" size={16} /></InputGroup.Prefix>
            <InputGroup.Input placeholder="Nombre de la sede" className="min-w-0 flex-1" />
          </InputGroup>
        </TextField>
      )}
      <Button type="submit" className={conNombre ? "sm:col-span-2 lg:col-span-1" : ""}><Icon name="search" size={16} /> Buscar</Button>
    </form>
  );
}
