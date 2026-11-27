import { useState } from "react";
import { FieldError, Label, ListBox, Modal, Select, Switch, toast } from "@heroui/react";
import { api, erroresPorCampo } from "../api.js";
import { DEPORTES, hora } from "../sedes.js";
import { Aviso, Boton, Campo, Icon, useFormulario } from "./ui.jsx";

// Modal con un formulario que se envía a la API. Si la API responde 400 con `errores`,
// cada mensaje aparece bajo su campo; cualquier otro error, arriba del formulario.
function ModalFormulario({ abierto, onCerrar, icono, titulo, enviar, children, setErrores, textoBoton }) {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await enviar();
      onCerrar();
    } catch (err) {
      if (err.errores?.length) setErrores(erroresPorCampo(err));
      else setError(err);
      if (err.contrato) console.warn("[contrato]", err.contrato);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Modal.Backdrop isOpen={abierto} onOpenChange={(o) => !o && !enviando && onCerrar()}>
      <Modal.Container scroll="outside">
        <Modal.Dialog className="sm:max-w-[520px]">
          <Modal.CloseTrigger />
          <form onSubmit={onSubmit} noValidate className="contents">
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground"><Icon name={icono} size={20} /></Modal.Icon>
              <Modal.Heading>{titulo}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="grid gap-4">
              {error && <Aviso error={error} />}
              {children}
            </Modal.Body>
            <Modal.Footer>
              <Boton variante="secundario" onPress={onCerrar} isDisabled={enviando}>Cancelar</Boton>
              <Boton type="submit" cargando={enviando}>{textoBoton}</Boton>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

// ── Sede ───────────────────────────────────────────────────────────────
const sedeVacia = { nombre: "", direccion: "", ciudad: "", telefono: "", horaApertura: "08:00", horaCierre: "22:00" };

// `sede` = null para crear. `onGuardada(sede)` recibe la respuesta de la API.
export function FormSede({ abierto, sede, onCerrar, onGuardada }) {
  // key: al abrir con otra sede, el estado del formulario empieza de cero
  return abierto ? <FormSedeAbierto key={sede?.id ?? "nueva"} sede={sede} onCerrar={onCerrar} onGuardada={onGuardada} /> : null;
}

function FormSedeAbierto({ sede, onCerrar, onGuardada }) {
  const { form, setErrores, campo } = useFormulario(sede
    ? { nombre: sede.nombre, direccion: sede.direccion, ciudad: sede.ciudad, telefono: sede.telefono ?? "",
        horaApertura: hora(sede.horaApertura), horaCierre: hora(sede.horaCierre) }
    : sedeVacia);

  const enviar = async () => {
    // PUT reemplaza: se mandan todos los campos, y las horas sin segundos (HH:MM)
    const body = { ...form, telefono: form.telefono.trim() || null };
    const guardada = sede
      ? await api(`/sedes/${sede.id}`, { method: "PUT", body })
      : await api("/sedes", { method: "POST", body });
    toast.success(sede ? "Sede actualizada." : "Sede creada.");
    onGuardada?.(guardada);
  };

  return (
    <ModalFormulario abierto onCerrar={onCerrar} icono="court" titulo={sede ? "Editar sede" : "Nueva sede"}
      enviar={enviar} setErrores={setErrores} textoBoton={sede ? "Guardar cambios" : "Crear sede"}>
      <Campo label="Nombre" autoFocus {...campo("nombre")} />
      <Campo label="Dirección" autoComplete="street-address" {...campo("direccion")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Ciudad" autoComplete="address-level2" {...campo("ciudad")} />
        <Campo label="Teléfono" opcional type="tel" inputMode="numeric" autoComplete="tel" {...campo("telefono")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Hora de apertura" type="time" {...campo("horaApertura")} />
        <Campo label="Hora de cierre" type="time" {...campo("horaCierre")} />
      </div>
    </ModalFormulario>
  );
}

// ── Cancha ─────────────────────────────────────────────────────────────
const canchaVacia = { nombre: "", deporte: "futbol5", superficie: "", precioHora: "", activa: true };

// `cancha` = null para crear en `sede`.
export function FormCancha({ abierto, sede, cancha, onCerrar, onGuardada }) {
  return abierto ? <FormCanchaAbierto key={cancha?.id ?? "nueva"} sede={sede} cancha={cancha} onCerrar={onCerrar} onGuardada={onGuardada} /> : null;
}

function FormCanchaAbierto({ sede, cancha, onCerrar, onGuardada }) {
  const { form, errores, setErrores, campo } = useFormulario(cancha
    ? { nombre: cancha.nombre, deporte: cancha.deporte, superficie: cancha.superficie ?? "",
        precioHora: String(Number(cancha.precioHora)), activa: cancha.activa }
    : canchaVacia);

  const enviar = async () => {
    const body = { ...form, superficie: form.superficie.trim() || null, precioHora: form.precioHora.trim() };
    const guardada = cancha
      ? await api(`/canchas/${cancha.id}`, { method: "PUT", body })
      : await api(`/sedes/${sede.id}/canchas`, { method: "POST", body });
    toast.success(cancha ? "Cancha actualizada." : "Cancha creada.");
    onGuardada?.(guardada);
  };

  const deporte = campo("deporte");
  const activa = campo("activa");
  return (
    <ModalFormulario abierto onCerrar={onCerrar} icono="ball" textoBoton={cancha ? "Guardar cambios" : "Crear cancha"}
      titulo={cancha ? "Editar cancha" : `Nueva cancha en ${sede.nombre}`} enviar={enviar} setErrores={setErrores}>
      <Campo label="Nombre" autoFocus ayuda="Por ejemplo: Cancha 1, Pista central…" {...campo("nombre")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select value={deporte.value} onChange={(v) => v && deporte.onChange(v)} isInvalid={!!errores.deporte}
          validationBehavior="aria" variant="secondary" fullWidth>
          <Label>Deporte</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {DEPORTES.map((d) => (
                <ListBox.Item key={d.id} id={d.id} textValue={d.nombre}>{d.emoji} {d.nombre}<ListBox.ItemIndicator /></ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
          {errores.deporte && <FieldError>{errores.deporte}</FieldError>}
        </Select>
        <Campo label="Superficie" opcional ayuda="Sintética, arcilla, madera…" {...campo("superficie")} />
      </div>
      <Campo label="Precio por hora (COP)" inputMode="decimal" ayuda="Sin puntos de miles. Hasta 2 decimales: 85000.50" {...campo("precioHora")} />
      <Switch isSelected={activa.value} onChange={activa.onChange}>
        <Switch.Content>
          <Switch.Control><Switch.Thumb /></Switch.Control>
          <span>
            Activa
            <span className="block text-sm text-muted">Las inactivas no salen en el catálogo ni se pueden reservar.</span>
          </span>
        </Switch.Content>
      </Switch>
      {errores.activa && <p className="text-sm text-danger">{errores.activa}</p>}
    </ModalFormulario>
  );
}
