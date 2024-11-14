import { Category } from "../models/Category";
import { ICategory } from "../interfaces";

// Create a new category
export const createCategory = async (categoryData: ICategory) => {
  const category = new Category(categoryData);
  return await category.save();
};

// Get all categories
export const getCategories = async (page: number, limit: number) => {
  // Calculate the skip value based on the page and limit
  const skip = (page - 1) * limit;

  // Get total count of categories
  const totalCount = await Category.countDocuments();

  // Get categories with pagination
  const categories = await Category.find()
    .skip(skip)
    .limit(limit);

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / limit);

  // Return data and pagination info
  return {
    data: categories,
    page,
    limit,
    totalPages,
    totalCount
  };
};

// Get category by ID
export const getCategoryById = async (categoryId: string) => {
  return await Category.findById(categoryId);
};

// Update category by ID
export const updateCategory = async (categoryId: string, updateData: ICategory) => {
  return await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
};

// Delete category by ID
export const deleteCategory = async (categoryId: string) => {
  return await Category.findByIdAndDelete(categoryId);
};
