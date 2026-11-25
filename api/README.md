# ReservaYa · API

API REST de ReservaYa: Express 5 + Sequelize + MySQL. **Solo responde JSON**.
El front (`../client`, React + Vite en `http://localhost:5173`) la consume a través del proxy de Vite, así que no hace falta CORS.

## Arrancar

```bash
npm install
cp .env.example .env   # rellena los valores (el .env nunca se sube a git)
npm run dev            # nodemon → http://localhost:3000
```

| Script | Qué hace |
|---|---|
| `npm run dev` | arranca con nodemon (se reinicia al guardar) |
| `npm start` | arranca con node |
| `npm run format` | formatea con Prettier |
| `npm run format:check` | comprueba el formato sin cambiar nada |

Variables del `.env` (ver `.env.example`):

| Grupo | Variables |
|---|---|
| Servidor | `NODE_ENV`, `PORT`, `BACKEND_URL` |
| Frontend | `FRONTEND_URL` (sin `/` al final: los emails enlazan a `FRONTEND_URL/confirmar/<token>`) |
| MySQL | `MYSQL_BD_HOST`, `MYSQL_BD_PORT`, `MYSQL_BD_NAME`, `MYSQL_BD_USER`, `MYSQL_BD_PASSWORD` |
| Email (Mailtrap) | `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`: cada quien usa las credenciales SMTP de su propio inbox de Mailtrap (Email Testing → Inboxes → SMTP Settings) |
| Autenticación | `JWT_SECRET`: firma los JWT de la sesión. Cada quien genera el suyo con `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |

## Estructura

```
config/        conexión a MySQL (Sequelize)
controllers/   lógica de cada endpoint (reciben req, responden res)
helpers/       funciones sueltas reutilizables (generarToken, enviar emails…)
  plantillas/  HTML y texto de cada email (confirmarCuenta…)
middleware/    validarCampos, errores, protegerRuta, soloRol…
models/        modelos de Sequelize
routes/        routers de Express; routes/validaciones/ tiene las reglas de express-validator
seed/          datos de prueba (npm run db:importar / db:eliminar)
index.js       arranca el servidor y monta los routers
```

Orden de una ruta: **reglas de validación → `validarCampos` → (`protegerRuta` → `soloRol`) → controlador**.

```js
router.post("/registro", validarRegistro, validarCampos, registro);
router.post("/sedes", protegerRuta, soloRol("admin"), validarSede, validarCampos, crearSede);
```

---

## 1. Reglas de las rutas

| Regla | Bien | Mal |
|---|---|---|
| Todo bajo `/api` | `/api/sedes` | `/sedes` |
| Recursos con **sustantivos en plural** | `/api/sedes`, `/api/reservas` | `/api/crearSede`, `/api/getReservas` |
| El **método HTTP** dice la acción | `DELETE /api/sedes/:id` | `POST /api/sedes/borrar/:id` |
| Minúsculas y guiones | `/api/auth/olvide-password` | `/api/auth/olvidePassword` |
| Id del recurso en la ruta | `/api/canchas/:id` | `/api/canchas?id=5` |
| Filtros y paginación en la query | `/api/sedes?ciudad=Cali&pagina=2` | `/api/sedes/Cali/2` |
| Recurso hijo bajo su padre | `POST /api/sedes/:sedeId/canchas` | `POST /api/canchas` con `sedeId` suelto |

### Qué método usar

| Método | Para | Body | Ejemplo |
|---|---|---|---|
| `GET` | leer (nunca cambia datos) | no | `GET /api/sedes/:id` |
| `POST` | crear, o una acción que no es CRUD | normalmente | `POST /api/reservas`, `POST /api/auth/login`, `POST /api/auth/confirmar/:token` (sin body) |
| `PUT` | actualizar un recurso con todos sus campos | sí | `PUT /api/sedes/:id` |
| `PATCH` | cambiar **una parte** o hacer una acción sobre él | opcional | `PATCH /api/reservas/:id/cancelar` |
| `DELETE` | borrar | no | `DELETE /api/canchas/:id` |

---

## 2. Formato de las respuestas

Solo hay **tres formas**. El front se basa en ellas: si respondes otra cosa, muestra el aviso *"respuesta fuera de contrato"*.

### ✅ Éxito: el dato o un mensaje

```jsonc
// Un recurso → el objeto
{ "id": "…", "nombre": "Club El Poblado", "ciudad": "Medellín" }

// Varios recursos → el array
[ { "id": "…" }, { "id": "…" } ]

// Listado paginado → objeto con los datos y la paginación
{ "sedes": [ … ], "total": 23, "pagina": 1, "paginas": 3 }

// Acción sin dato que devolver → mensaje
{ "mensaje": "Cuenta creada. Revisa tu email para confirmarla" }
```

### ❌ Error general: `error` (en singular, un texto)

```json
{ "error": "Ese email ya está registrado" }
```

### ❌ Error de validación (solo 400): `errores` (en plural, una lista por campo)

```json
{
  "errores": [
    { "campo": "email", "mensaje": "Email no válido" },
    { "campo": "password", "mensaje": "Mínimo 8 caracteres" }
  ]
}
```

> **Regla para no confundirse:** `errores` solo lo produce `validarCampos` con status 400.
> Cualquier otro error (401, 403, 404, 409, 500…) usa `{ "error": "..." }`, aunque se refiera a un campo.
> Ejemplo: el email duplicado es un **409 `{ error }`**, no un `errores` con `campo: "email"`.

---

## 3. Códigos de éxito

| Código | Cuándo | Ejemplo |
|---|---|---|
| **200** OK | leer, actualizar, borrar, login, acciones | `GET /api/sedes`, `PUT /api/sedes/:id`, `DELETE` → `{ "mensaje": "Sede eliminada" }` |
| **201** Created | se **creó** algo nuevo en la BD | `POST /api/auth/registro`, `POST /api/reservas` |

- `res.json(...)` responde 200 por defecto. Para crear, usa `res.status(201).json(...)`.
- **No usamos 204** (sin contenido): el front siempre espera un JSON, así que un `DELETE` responde 200 con `{ mensaje }`.
- Login no crea nada en la BD (solo una cookie): es **200**, no 201.

---

## 4. Códigos de error

| Código | Significa | Cuándo en ReservaYa | Respuesta |
|---|---|---|---|
| **400** Bad Request | los datos que mandó el cliente están mal | validación de express-validator, JSON mal formado, token de email no válido, fecha pasada | `{ errores }` si es validación por campo; `{ error }` si no |
| **401** Unauthorized | **no sé quién eres** | no hay cookie, el JWT caducó o es falso, email/contraseña incorrectos | `{ "error": "No autenticado" }` |
| **403** Forbidden | **sé quién eres, pero no puedes** | rol cliente en ruta de admin, la sede es de otro admin, cuenta sin confirmar | `{ "error": "No tienes permiso para esta acción" }` |
| **404** Not Found | lo que pides no existe | ruta inexistente, `/api/sedes/:id` con un id que no está | `{ "error": "Sede no encontrada" }` |
| **409** Conflict | los datos son válidos, pero chocan con lo que ya hay | email duplicado, turno ya reservado, reserva ya cancelada | `{ "error": "Ese horario ya está reservado" }` |
| **413** Payload Too Large | body demasiado grande | lo pone `express.json()` solo | `{ error }` (lo arma `manejarErrores`) |
| **500** Internal Server Error | **fallo nuestro**, no del cliente | BD caída, bug, excepción no prevista | `{ "error": "Error interno del servidor" }` |

### ¿Qué código uso? (en este orden)

1. ¿El body o la query tienen datos mal formados o fuera de las reglas? → **400**
2. ¿La ruta necesita sesión y no hay una válida? → **401**
3. ¿Hay sesión, pero no tiene el rol o no es el dueño? → **403**
4. ¿El recurso que pide (por id) no existe? → **404**
5. ¿Todo es válido, pero choca con el estado actual de la BD? → **409**
6. ¿Algo que no esperabas falló? → déjalo llegar a `manejarErrores` → **500**

### Confusiones típicas

| Duda | Respuesta |
|---|---|
| ¿401 o 403? | 401 = no hay sesión (o no vale). 403 = hay sesión, pero no tiene permiso. |
| ¿400 o 409? | 400 = el dato está mal en sí mismo (email sin @). 409 = el dato está bien, pero ya existe u ocupa algo (email ya registrado, hora ocupada). |
| ¿403 o 404 para la sede de otro? | En ReservaYa: id que **no existe** → 404; existe pero **es de otro** → 403. |
| ¿Y 422? | No lo usamos: toda validación es **400**. |
| ¿Un 500 con un mensaje útil? | Nunca. Si el cliente puede corregirlo, no es 500: dale un 4xx. |
| ¿Login con email que no existe? | **401** con el mismo mensaje que la contraseña mala (`"Email o contraseña incorrectos"`), para no revelar qué emails están registrados. |

---

## 5. Cómo responder un error en el código

**Errores previstos (4xx):** responde y corta con `return`, para que el código de abajo no se ejecute.

```js
const existe = await Usuario.findOne({ where: { email } });
if (existe) {
  return res.status(409).json({ error: "Ese email ya está registrado" });
}
```

**Errores imprevistos (5xx):** no los atrapes con `try/catch` solo para responder 500. Express 5 envía a `manejarErrores` cualquier error de una función `async`, y ese manejador:

- escribe el error completo en la consola (`console.error`);
- responde `{ "error": "Error interno del servidor" }` **sin stack trace** ni detalles.

Usa `try/catch` solo cuando quieras **convertir** un error concreto en un 4xx, y relanza todos los demás:

```js
try {
  await Usuario.create(datos);
} catch (err) {
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ error: "Ese email ya está registrado" });
  }
  throw err; // cualquier otro error → manejarErrores → 500
}
```

---

## 6. Reglas de seguridad

- **Nunca** devolver `password` ni `token` de un usuario. Usa el scope `ocultarDatos` o elige los `attributes`.
- **Nunca** pasar `req.body` entero a `create` o `update`: coge solo los campos permitidos (así un `"rol": "admin"` en el body no tiene efecto).
- Cada campo de texto se valida con `.isString()` primero: un número o un array en el body debe dar **400**, nunca 500.
- El stack trace y los mensajes internos (SQL, rutas de archivos) **solo van a la consola**, nunca al cliente, tampoco en desarrollo.
- Mensajes que no revelen datos: el login falla igual con email o contraseña incorrectos, y `olvide-password` responde lo mismo exista o no el email.
- La sesión va en la cookie `token` (httpOnly, sameSite `strict`); el JWT nunca va en el body.

---

## 7. Antes de pasar una tarea a "En revisión"

- [ ] Probé el caso que funciona **y** cada caso de error de la tabla de la historia, en Thunder Client.
- [ ] Cada respuesta es una de las tres formas: dato/`mensaje`, `{ error }` o `{ errores }` (solo 400).
- [ ] El código HTTP es el de la tabla de la historia.
- [ ] Mandar tipos raros (número, array, objeto, body vacío) da 400, no 500.
- [ ] Ninguna respuesta trae `password`, `token` ni `stack`.
- [ ] La petición quedó guardada en la colección **ReservaYa** de Thunder Client.
