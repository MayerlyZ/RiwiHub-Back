import express from "express";
import dotenv from "dotenv";
import sequelize from "./BACK/config/db.js";
import cors from "cors";

//Import routes
import userRoutes from "./BACK/routes/userRoutes.js";
import categoryRoutes from "./BACK/routes/categoryRoutes.js";
import cartRoutes from "./BACK/routes/cartRoutes.js";
import orderRoutes from "./BACK/routes/orderRoutes.js";
import transactionRoutes from "./BACK/routes/transactionRoutes.js";
import createAssociations from "./BACK/models/associations.js";
import accountingRoutes from "./BACK/routes/accountingRoutes.js";
import inventoryRoutes from "./BACK/routes/inventoryRoutes.js";
import itemRoutes from "./BACK/routes/itemRoutes.js";


// Middlewares
import errorMiddleware from "./BACK/middlewares/errorMiddleware.js";
import authMiddleware from "./BACK/middlewares/authMiddleware.js";
import { Association } from "sequelize";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

//Create associations
createAssociations();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/categories", authMiddleware, categoryRoutes);
app.use("/api/carts", authMiddleware, cartRoutes);
app.use("/api/orders", authMiddleware, orderRoutes);
app.use("/api/transactions", authMiddleware, transactionRoutes);
app.use("/api/inventory", authMiddleware, inventoryRoutes);
app.use("/api/accounting", authMiddleware, accountingRoutes);
app.use("/api/items", authMiddleware, itemRoutes);

//handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Error middleware
app.use(errorMiddleware);

//Show connection variables
console.log(" Connection variables:", {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
});

  //Connection to the database
sequelize.authenticate()
  .then(() => console.log("✅ Connected to the database"))
  .catch(err => console.error("❌ Error connecting:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
