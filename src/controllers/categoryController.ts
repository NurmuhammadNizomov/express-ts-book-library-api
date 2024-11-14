import { Request, Response, NextFunction } from "express";
import { createCategory, deleteCategory, getCategories, getCategoryById, updateCategory } from "../services/categoryService";
import { sendSuccessResponse, sendErrorResponse } from "../utils/responseHelper";
import { CustomError } from "../utils/CustomError";

// Create a new category
export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await createCategory(req.body);
    sendSuccessResponse(res, 201, category, "Category created successfully");
  } catch (error: any) {
    sendErrorResponse(res, 500, "Error creating category");
    next(new CustomError(500, error.message));
  }
};

// Get all categories
export const getCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get page and limit from query parameters, default to page 1 and limit 10
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Get categories with pagination
    const result = await getCategories(page, limit);

    // Send success response with categories and pagination details
    sendSuccessResponse(res, 200, result.data, "Categories retrieved successfully", {
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      totalCount: result.totalCount
    });
  } catch (error: any) {
    sendErrorResponse(res, 500, "Error retrieving categories");
    next(new CustomError(500, error.message)); // Forward the error to error handler middleware
  }
};

// Get category by ID
export const getCategoryByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) {
      sendErrorResponse(res, 404, "Category not found");
    } else {
      sendSuccessResponse(res, 200, category, "Category retrieved successfully");
    }
  } catch (error: any) {
    sendErrorResponse(res, 500, "Error retrieving category");
    next(new CustomError(500, error.message)); // Forward the error
  }
};

// Update category by ID
export const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedCategory = await updateCategory(req.params.id, req.body);
    if (!updatedCategory) {
      sendErrorResponse(res, 404, "Category not found");
    } else {
      sendSuccessResponse(res, 200, updatedCategory, "Category updated successfully");
    }
  } catch (error: any) {
    sendErrorResponse(res, 500, "Error updating category");
    next(new CustomError(500, error.message)); // Forward the error
  }
};

// Delete category by ID
export const deleteCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedCategory = await deleteCategory(req.params.id);
    if (!deletedCategory) {
      sendErrorResponse(res, 404, "Category not found");
    } else {
      sendSuccessResponse(res, 200, deletedCategory, "Category deleted successfully");
    }
  } catch (error: any) {
    sendErrorResponse(res, 500, "Error deleting category");
    next(new CustomError(500, error.message)); // Forward the error
  }
};
