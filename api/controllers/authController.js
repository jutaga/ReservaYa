import { emailRegistro } from "../helpers/emails.js";
import generarToken from "../helpers/generarToken.js";
import generarJWT from "../helpers/tokens.js";
import Usuario from "../models/Usuario.js";

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

  res.cookie("token", generarJWT({ id: usuario.id }), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });

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
  const { id, nombre, email, rol } = req.usuario;

  return res.status(200).json({
    usuario: {
      id,
      nombre,
      email,
      rol,
    },
  });
};

export { registro, confirmarUsuario, login, perfil };
