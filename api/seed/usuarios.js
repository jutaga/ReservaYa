// Passwords en texto plano: el hook beforeSave del modelo los hashea al importar.
// token, telefono y versionToken no se ponen: el modelo ya les da su valor por defecto.
const PASSWORD_PRUEBA = "password123";

const usuarios = [
  {
    nombre: "Admin ReservaYa",
    email: "admin@reservaya.test",
    confirmado: true,
    password: PASSWORD_PRUEBA,
    rol: "admin",
  },
  {
    nombre: "Ana Gómez",
    email: "ana@reservaya.test",
    confirmado: true,
    password: PASSWORD_PRUEBA,
    rol: "cliente",
  },
  {
    nombre: "Luis Pérez",
    email: "luis@reservaya.test",
    confirmado: true,
    password: PASSWORD_PRUEBA,
    rol: "cliente",
  },
];

export default usuarios;
