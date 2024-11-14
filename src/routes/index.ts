import { Router } from "express";
import categoryRoutes from "./categoryRoutes";  
import authRoutes from "./authRoutes";  

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);

export default router;
