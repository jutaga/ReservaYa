import nodemailer from "nodemailer";
import { plantillaConfirmarCuenta } from "./plantillas/confirmarCuenta.js";
import { plantillaOlvidePassword } from "./plantillas/olvidePassword.js";

const REMITENTE = '"ReservaYa" <no-reply@reservaya.com>';

const crearTransporte = () =>
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const emailRegistro = async ({ nombre, email, token }) => {
  const enlace = `${process.env.FRONTEND_URL}/confirmar/${token}`;

  const { html, text } = plantillaConfirmarCuenta({ nombre, enlace });

  await crearTransporte().sendMail({
    from: REMITENTE,
    to: email,
    subject: "Confirma tu cuenta en ReservaYa",
    text,
    html,
  });
};

export const emailOlvidePassword = async ({ nombre, email, token }) => {
  const enlace = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const { html, text } = plantillaOlvidePassword({ nombre, enlace });

  await crearTransporte().sendMail({
    from: REMITENTE,
    to: email,
    subject: "Restablece tu contraseña de ReservaYa",
    text,
    html,
  });
};
