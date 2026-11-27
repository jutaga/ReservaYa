import db from "../config/db.js";
import Usuario from "../models/Usuario.js";
import usuarios from "./usuarios.js";

const filtroSeeder = { email: usuarios.map((u) => u.email) };

const importarDatos = async () => {
  try {
    await db.authenticate();
    await db.sync();


    await Usuario.destroy({ where: filtroSeeder });


    await Usuario.bulkCreate(usuarios, { individualHooks: true });
    console.log("Datos importados correctamente");
    process.exit(0);
  } catch (error) {
    console.error("Error al importar los datos", error);
    process.exit(1);
  }
};

const eliminarDatos = async () => {
  try {
    await Usuario.destroy({ where: filtroSeeder });
    console.log("Datos eliminados correctamente");
    process.exit(0);
  } catch (error) {
    console.error("Error al eliminar los datos", error);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importarDatos();
}

if (process.argv[2] === "-e") {
  eliminarDatos();
}
