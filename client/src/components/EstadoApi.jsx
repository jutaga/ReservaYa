import { useEffect, useState } from "react";

// Indicador del pie: ¿responde GET /api/salud?
export default function EstadoApi() {
  const [estado, setEstado] = useState("comprobando");

  useEffect(() => {
    let vivo = true;
    const comprobar = async () => {
      let nuevo = "caida";
      try {
        const res = await fetch("/api/salud");
        const tipo = res.headers.get("content-type") || "";
        if (res.ok && tipo.includes("application/json")) nuevo = "ok";
        else if (res.status === 404 || (res.ok && !tipo.includes("json"))) nuevo = "parcial";
      } catch { /* caída */ }
      if (vivo) setEstado(nuevo);
    };
    comprobar();
    const id = setInterval(comprobar, 10000);
    return () => { vivo = false; clearInterval(id); };
  }, []);

  const texto = {
    comprobando: "Comprobando API…",
    ok: "API conectada",
    parcial: "API responde, pero falta GET /api/salud",
    caida: "API sin conexión (puerto 3000)",
  }[estado];

  return <span className={`estado-api estado-${estado}`}><span className="punto" />{texto}</span>;
}
