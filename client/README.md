# ReservaYa · front (React + Vite)

Lo mantiene Claude. Tú no necesitas tocar nada aquí: tu trabajo está en `../api`.

## Arrancar

```bash
cd C:\Users\RYZEN\Documents\Programacion\Node\ReservaYa\client
npm install   # solo la primera vez
npm run dev
```

Abre <http://localhost:5173>. Tu API debe estar corriendo en el **puerto 3000**.

- Vite reenvía `/api` y `/uploads` a `http://localhost:3000` (proxy). El navegador cree que
  todo es el mismo origen, así que la cookie `token` funciona y **no necesitas CORS**.
- El pie de página muestra si tu API responde: verde si `GET /api/salud` devuelve JSON,
  naranja si la API no está levantada.
- Si tu API responde algo que no cumple el contrato (HTML en vez de JSON, un error sin
  `error` ni `errores`…), el front lo dice en el aviso con la etiqueta **"Para el backend"**.

## Pantallas del Sprint 1

| Ruta del front | Endpoints que usa |
|---|---|
| `/registro` | `POST /api/auth/registro` |
| `/confirmar/:token` (enlace del email) | `GET /api/auth/confirmar/:token` |
| `/login` | `POST /api/auth/login` |
| `/olvide-password` | `POST /api/auth/olvide-password` |
| `/reset-password/:token` (enlace del email) | `GET` y `POST /api/auth/reset-password/:token` |
| `/perfil` | `GET /api/auth/perfil`, `POST /api/auth/logout` |
| `/admin` (solo admin) | `GET /api/admin/ping` |

Los enlaces de tus emails deben usar `FRONTEND_URL=http://localhost:5173`.

El front **no valida** los campos (salvo "repetir contraseña"): así ves en pantalla los
errores que devuelve tu API, campo por campo.

## Estructura

```
src/
  api.js          cliente fetch: entiende { error } y { errores: [{ campo, mensaje }] }
  auth.jsx        sesión (pregunta a /api/auth/perfil quién está logueado)
  components/     Layout, RutaProtegida, EstadoApi, ui (Campo, Aviso, Boton…)
  pages/          una página por pantalla
```
