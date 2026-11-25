import nodemailer from "nodemailer";
import { plantillaConfirmarCuenta } from "./plantillas/confirmarCuenta.js";

export const emailRegistro = async ({ nombre, email, token }) => {
  const transporte = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const enlace = `${process.env.FRONTEND_URL}/confirmar/${token}`;

  const { html, text } = plantillaConfirmarCuenta({ nombre, enlace });

  await transporte.sendMail({
    from: '"ReservaYa" <no-reply@reservaya.com>',
    to: email,
    subject: "Confirma tu cuenta en ReservaYa",
    text,
    html,
  });
};
