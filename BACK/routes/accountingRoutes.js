import e from "express";
import { getDailyReport } from "../controllers/accountingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import  {authorizeRoles}  from "../middlewares/roleMiddleware.js";

const router = e.Router();

// -- Restricts to authenticated users (and optionally checks admin role within the middleware)
router.get("/daily", authMiddleware, authorizeRoles("admin","seller"), getDailyReport);

export default router;
