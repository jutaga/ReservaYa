import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import { OPCIONES_COOKIE } from "../helpers/tokens.js";

export const protegerRuta = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ error: "No autenticado" });

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.clearCookie("token", OPCIONES_COOKIE).status(401).json({ error: "No autenticado" });
  }

  const usuario = await Usuario.scope("ocultarDatos").findByPk(decoded.id);

  if (!usuario || decoded.v !== usuario.versionToken) {
    return res.clearCookie("token", OPCIONES_COOKIE).status(401).json({ error: "No autenticado" });
  }

  req.usuario = usuario;
  next();
};
