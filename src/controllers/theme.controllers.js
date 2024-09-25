import { StoreAdmin } from "../models/store-admin.models.js";
import { Theme } from "../models/themes.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addTheme = asyncHandler(async (req, res) => {
  const themeImageLocalPath = req.file?.path;

  if (!themeImageLocalPath) {
    throw new ApiError(400, "Theme image is required");
  }

  const themeImage = await uploadOnCloudinary(themeImageLocalPath);

  if (!themeImage || !themeImage.url) {
    throw new ApiError(400, "Failed to upload theme image");
  }

  const theme = await Theme.create({ imageUrl: themeImage.url });

  return res
    .status(201)
    .json(new ApiResponse(200, theme, "Theme image has been added"));
});

const getAllThemes = asyncHandler(async (req, res) => {
  const themes = await Theme.find();

  return res
    .status(201)
    .json(new ApiResponse(201, themes, "Themes has been retrieved"));
});

const setStoreTheme = asyncHandler(async (req, res) => {
  const storeAdminId = req.user.id;
  const { themeId } = req.body;

  const store = StoreAdmin.findOne({ admin: storeAdminId });
  if (!store) {
    throw new ApiError(404, "Store not found for the authenticated storeAdmin");
  }

  const theme = await Theme.findById(themeId);
  if (!theme) {
    throw new ApiError(404, "Theme not found");
  }

  store.theme = themeId;
  await store.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, store, "Theme has been set as the store background")
    );
});

export { addTheme, getAllThemes, setStoreTheme };
