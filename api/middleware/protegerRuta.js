import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

export const protegerRuta = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ error: "No autenticado" });

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.clearCookie("token").status(401).json({ error: "No autenticado" });
  }

  const usuario = await Usuario.scope("ocultarDatos").findByPk(decoded.id);

  if (!usuario) {
    return res.clearCookie("token").status(401).json({ error: "No autenticado" });
  }

  req.usuario = usuario;
  next();
};
