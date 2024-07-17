import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Category } from "../models/category.models.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  const category = await Category.create({ name });

  return res
    .status(201)
    .json(new ApiResponse(200, category, "Category has been added"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  return res
    .status(201)
    .json(new ApiResponse(200, categories, "All categories"));
});

export { createCategory, getAllCategories };
