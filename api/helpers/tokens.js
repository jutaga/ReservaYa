import jwt from "jsonwebtoken";

export const OPCIONES_COOKIE = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000,
};

export const generarJWT = ({ id , v}) => {
  return jwt.sign({ id, v }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
