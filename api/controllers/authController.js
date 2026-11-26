import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";
import generarToken from "../helpers/generarToken.js";
import { OPCIONES_COOKIE, generarJWT } from "../helpers/tokens.js";
import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken"; // al inicio del archivo

const EMAIL_DUPLICADO = "Ese email ya está registrado";

const CREDENCIALES_INCORRECTAS = "Email o contraseña incorrectos";

const registro = async (req, res) => {
  const { nombre, email, password, telefono } = req.body;

  const emailExiste = await Usuario.findOne({
    where: { email },
  });

  if (emailExiste) return res.status(409).json({ error: EMAIL_DUPLICADO });

  const token = generarToken();

  let usuario;

  try {
    usuario = await Usuario.create({
      nombre,
      email,
      password,
      telefono: telefono || null,
      token,
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: EMAIL_DUPLICADO });
    }
    throw err;
  }

  try {
    await emailRegistro({ nombre, email, token });
  } catch (err) {
    console.error("❌ No se pudo enviar el email de confirmación:", err);
    await usuario.destroy();
    throw err;
  }

  res.status(201).json({ mensaje: "Cuenta creada. Revisa tu email para confirmarla" });
};

const confirmarUsuario = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({
    where: { token },
  });

  if (!usuario)
    return res.status(400).json({
      error: "Token no válido",
    });

  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  return res.status(200).json({
    mensaje: "Cuenta confirmada correctamente",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Usuario.findOne({
    where: { email },
  });

  if (!usuario) return res.status(401).json({ error: CREDENCIALES_INCORRECTAS });

  if (!(await usuario.comprobarPassword(password))) {
    return res.status(401).json({ error: CREDENCIALES_INCORRECTAS });
  }

  if (!usuario.confirmado)
    return res.status(403).json({ error: "Tu cuenta no ha sido confirmada" });

  res.cookie("token", generarJWT({ id: usuario.id, v: usuario.versionToken }), OPCIONES_COOKIE);

  return res.status(200).json({
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
  });
};

const perfil = async (req, res) => {
  const { id, nombre, email, rol, telefono } = req.usuario;

  return res.status(200).json({
    usuario: {
      id,
      nombre,
      email,
      rol,
      telefono,
    },
  });
};

const logout = async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    let decoded = null;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {}

    if (decoded) {
      const { id, v } = decoded;
      try {
        // Solo si la versión coincide: un JWT viejo no puede cerrar las sesiones actuales.
        await Usuario.increment("versionToken", { where: { id, versionToken: v } });
      } catch (err) {
        // Aunque falle la BD, la cookie se borra igual: el usuario debe poder cerrar sesión.
        console.error("❌ No se pudo invalidar la sesión al cerrar sesión:", err);
      }
    }
  }
  return res.clearCookie("token", OPCIONES_COOKIE).status(200).json({ mensaje: "Sesión cerrada" });
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({
    where: { email },
  });

  if (usuario?.confirmado) {
    usuario.token = generarToken();
    await usuario.save();

    emailOlvidePassword({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    }).catch((err) => console.error("❌ No se pudo enviar el email de recuperación:", err));
  }

  return res.status(200).json({ mensaje: "Si el email existe, te enviamos instrucciones" });
};

const comprobarTokenReset = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({ where: { token, confirmado: true } });

  if (!usuario) return res.status(400).json({ error: "Token no válido" });

  return res.status(200).json({
    valido: true,
  });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ where: { token, confirmado: true } });

  if (!usuario) return res.status(400).json({ error: "Token no válido" });

  usuario.password = password;
  usuario.token = null;
  usuario.versionToken += 1;

  await usuario.save();

  return res.status(200).json({ mensaje: "Contraseña actualizada" });
};

export {
  registro,
  confirmarUsuario,
  login,
  perfil,
  logout,
  olvidePassword,
  comprobarTokenReset,
  resetPassword,
};
