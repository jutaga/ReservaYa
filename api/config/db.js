import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "node:path";

// Carga el .env de /api sin importar desde qué carpeta se ejecute node
dotenv.config({ path: path.join(import.meta.dirname, "../.env"), quiet: true });

const { MYSQL_BD_HOST, MYSQL_BD_PORT, MYSQL_BD_NAME, MYSQL_BD_USER, MYSQL_BD_PASSWORD, NODE_ENV } =
  process.env;

// Crea la conexión a la base de datos.
// Los tres primeros parámetros son, en orden:
//   1. Nombre de la base de datos -> "bienesraices_node_mvc"
//   2. Usuario de MySQL
//   3. Password de ese usuario
// El cuarto parámetro es un objeto con el resto de la configuración.
const db = new Sequelize(MYSQL_BD_NAME, MYSQL_BD_USER, MYSQL_BD_PASSWORD, {
  host: MYSQL_BD_HOST,
  port: Number(MYSQL_BD_PORT) || 3306,
  dialect: "mysql",
  timezone: "-05:00", // hora de Colombia: las reservas se guardan con la hora local
  logging: NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default db;
