// ./BACK/config/db.js

import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import fs from "fs"; 

dotenv.config();

// Obtener la ruta del certificado desde el archivo .env
const caPath = process.env.DB_SSL_CA_PATH;

if (!caPath) {
  throw new Error("La variable de entorno DB_SSL_CA_PATH no está definida.");
}

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    logging: false,

    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(caPath),
      }
    },
    // =======================================================

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export default sequelize;