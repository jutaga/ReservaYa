import crypto from "node:crypto";

// Genera un token aleatorio y seguro para confirmar cuenta o recuperar contraseña.
// 20 bytes → 40 caracteres hex (cabe en la columna token STRING(60)).
const generarToken = () => crypto.randomBytes(20).toString("hex");

export default generarToken;
