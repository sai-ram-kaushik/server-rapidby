import { StoreAdmin } from "../models/store-admin.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Product } from "../models/product.models.js";

const getPublicStoreData = asyncHandler(async (req, res) => {
  try {
    const store = await StoreAdmin.findOne({ storeName: req.params.storeName });

    if (!store) {
      throw new ApiError(404, "Store not found");
    }

    return res.status(201).json(new ApiResponse(200, store, "Store Data"));
  } catch (error) {
    console.log("Server Error", error);
  }
});

const getPublicStoreProductByName = asyncHandler(async (req, res) => {
  try {
    const storeName = req.params.storeName;

    const store = await StoreAdmin.findOne({ storeName });

    if (!store) {
      console.log(`Store not found with name: ${storeName}`);
      throw new ApiError(404, "Store name not found");
    }

    const products = await Product.find({ user: store._id }).populate("catalogItem");


    if (!products || products.length === 0) {
      console.log(`No products found for store: ${store._id}`);
      throw new ApiError(404, "No products found for this store");
    }

    return res.status(200).json(new ApiResponse(200, products, "Products"));
  } catch (error) {
    console.error("Server error:", error);
    res.status(error.statusCode || 500).json(
      new ApiResponse(
        error.statusCode || 500,
        null,
        error.message || "Internal Server Error"
      )
    );
  }
});



export { getPublicStoreData, getPublicStoreProductByName };
