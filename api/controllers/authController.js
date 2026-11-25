import generarToken from "../helpers/generarToken.js";
import Usuario from "../models/Usuario.js";

const EMAIL_DUPLICADO = "Ese email ya está registrado";

const registro = async (req, res) => {
  const { nombre, email, password, telefono } = req.body;

  const emailExiste = await Usuario.findOne({
    where: { email },
  });

  if (emailExiste) return res.status(409).json({ error: EMAIL_DUPLICADO });

  try {
    await Usuario.create({
      nombre,
      email,
      password,
      telefono: telefono || null,
      token: generarToken(),
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: EMAIL_DUPLICADO });
    }
    throw err;
  }
  res.status(201).json({ mensaje: "Cuenta creada. Revisa tu email para confirmarla" });
};

export { registro };
