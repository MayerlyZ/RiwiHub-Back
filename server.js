// =================================================================
// 1. IMPORTACIONES (Siempre al principio del archivo)
// =================================================================
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./BACK/config/db.js";

// Importaciones de Rutas
import userRoutes from "./BACK/routes/userRoutes.js";
import categoryRoutes from "./BACK/routes/categoryRoutes.js";
import cartRoutes from "./BACK/routes/cartRoutes.js";
import orderRoutes from "./BACK/routes/orderRoutes.js";
import transactionRoutes from "./BACK/routes/transactionRoutes.js";
import accountingRoutes from "./BACK/routes/accountingRoutes.js";
import inventoryRoutes from "./BACK/routes/inventoryRoutes.js";
import itemRoutes from "./BACK/routes/itemRoutes.js";
import reportRoutes from "./BACK/routes/reportRoutes.js";

// Importaciones de Modelos y Middlewares
import createAssociations from "./BACK/models/associations.js";
import errorMiddleware from "./BACK/middlewares/errorMiddleware.js";
import authMiddleware from "./BACK/middlewares/authMiddleware.js";

// =================================================================
// 2. CONFIGURACIÓN INICIAL
// =================================================================
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// =================================================================
// 3. MIDDLEWARES GENERALES
// =================================================================
app.use(cors());
app.use(express.json());

// Manejadores globales de errores para depuración
process.on('uncaughtException', err => {
  console.error('FATAL: Uncaught Exception:', err);
  process.exit(1); 
});
process.on('unhandledRejection', err => {
  console.error('FATAL: Unhandled Rejection:', err);
  process.exit(1);
});

// =================================================================
// 4. RUTAS
// =================================================================
app.get('/', (req, res) => {
  res.json({ message: '¡Bienvenido a la API de RiwiHub-Back!' });
});

app.use("/api/users", userRoutes);
app.use("/api/categories", authMiddleware, categoryRoutes);
app.use("/api/carts", authMiddleware, cartRoutes);
app.use("/api/orders", authMiddleware, orderRoutes);
app.use("/api/transactions", authMiddleware, transactionRoutes);
app.use("/api/inventory", authMiddleware, inventoryRoutes);
app.use("/api/accounting", authMiddleware, accountingRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/reports", authMiddleware, reportRoutes);

// =================================================================
// 5. MANEJO DE ERRORES (al final de las rutas)
// =================================================================
app.use(errorMiddleware); 
app.use((req, res, next) => { 
  res.status(404).json({ error: "Route not found" });
});

// =================================================================
// 6. FUNCIÓN DE ARRANQUE SEGURO DEL SERVIDOR
// =================================================================
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection to the database established successfully.");
    
    createAssociations();
    console.log("Models associations created.");
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.name);
    console.error("   Message:", error.message);
    process.exit(1); 
  }
};

// Iniciar el servidor
startServer();