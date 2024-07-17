import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Category } from "../models/category.models.js";
import { Catalog } from "../models/catalog.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/product.models.js";

const createCatalog = asyncHandler(async (req, res) => {
  const { name, category, amount, quantity, status, aboutProduct } = req.body;

  if (
    [name, category, amount, quantity, status, aboutProduct].some(
      (field) => field === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const categoryExists = await Category.findOne({ name: category });
  if (!categoryExists) {
    throw new ApiError(400, "Category not found");
  }

  const categoryImageLocalPath = req.file.path;

  if (!categoryImageLocalPath) {
    throw new ApiError(400, "Category Image is required");
  }

  const categoryImage = await uploadOnCloudinary(categoryImageLocalPath);

  if (!categoryImage) {
    throw new ApiError(400, "Category Image is Required");
  }

  const catalog = await Catalog.create({
    name,
    category: categoryExists.name,
    imageUrl: categoryImage.url,
    amount,
    quantity,
    status,
    aboutProduct,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, catalog, "Catalog has been added"));
});

const getAllCatalogs = asyncHandler(async (req, res) => {
  const catalog = await Catalog.find();

  return res.status(201).json(new ApiResponse(200, catalog, "All catalogs"));
});

const addProductFromCatalog = asyncHandler(async (req, res) => {
  const { catalogId } = req.body;
  const userId = req.user.id; // Assuming user is authenticated and user info is set in req.user

  if (!catalogId) {
    throw new ApiError(400, "Catalog Item ID is required");
  }

  const catalogItem = await Catalog.findById(catalogId);
  if (!catalogItem) {
    throw new ApiError(404, "Catalog item not found");
  }

  const product = await Product.create({
    user: userId,
    catalogItem: catalogItem._id,
    status: catalogItem.status,
    // Add other necessary fields from the catalogItem
  });

  return res
    .status(201)
    .json(new ApiResponse(200, product, "Product added from catalog"));
});

const getProductsByUser = asyncHandler(async (req, res) => {
  const storeAdminId = req.user;

  const products = await Product.find({ user: storeAdminId }).populate(
    "catalogItem"
  );
  if (!products) {
    throw new ApiError(404, "No products found for this user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "User's products retrieved successfully")
    );
});

const getProductByIdForUser = asyncHandler(async (req, res) => {
  const storeAdminId = req.user;
  const { id } = req.params;

  console.log(`StoreAdminId: ${storeAdminId}, CatalogItemId: ${id}`);

  const product = await Product.findOne({
    catalogItem: id,
    user: storeAdminId,
  }).populate("catalogItem");

  if (!product) {
    throw new ApiError(404, "Product not found or not accessible by this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product retrieved successfully"));
});

const removeProductFromMyProduct = asyncHandler(async (req, res) => {
  const storeAdminId = req.user;
  const { id } = req.body;

  const product = await Product.findOneAndDelete({
    catalogItem: id,
    user: storeAdminId,
  });

  if (!product) {
    throw new ApiError(404, "Product not found or not accessible by this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product removed successfully"));
});

export {
  createCatalog,
  getAllCatalogs,
  addProductFromCatalog,
  getProductsByUser,
  getProductByIdForUser,
  removeProductFromMyProduct,
};
