import express from "express";
import { getAllItems, getItemById, createItem, updateItem, deleteItem} from "../controllers/itemController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// ======================
// Public routes (buyers)
// ======================
router.get("/", getAllItems);        //Anyone can list products
router.get("/:id", getItemById);     //Anyone can view a specific product

// ======================
// Protected routes (admin + seller)
// ======================
router.post("/", authMiddleware, authorizeRoles("admin", "seller"), createItem);
router.put("/:id", authMiddleware, authorizeRoles("admin", "seller"), updateItem);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "seller"), deleteItem);

export default router;
