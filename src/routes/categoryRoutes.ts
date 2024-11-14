import { Router } from "express";
import {
  createCategoryController,
  getCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController";

const router = Router();

// Routes for Category CRUD operations
router.post("/", createCategoryController); // Create a new category
router.get("/", getCategoriesController); // Get all categories
router.get("/:id", getCategoryByIdController); // Get category by ID
router.put("/:id", updateCategoryController); // Update category by ID
router.delete("/:id", deleteCategoryController); // Delete category by ID

export default router;
