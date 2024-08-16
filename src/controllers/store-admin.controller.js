import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { StoreAdmin } from "../models/store-admin.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (storeAdminId) => {
  try {
    const storeAdmin = await StoreAdmin.findById(storeAdminId);
    const accessToken = storeAdmin.generateAccessToken();
    const refreshToken = storeAdmin.generateRefreshToken();

    storeAdmin.refreshToken = refreshToken;
    await storeAdmin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const createStoreAdmin = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    password,
    linkedinUrl,
    facebookUrl,
    instagramUrl,
    mobileNumber,
    storeName,
  } = req.body;

  if (
    [
      username,
      email,
      password,
      linkedinUrl,
      facebookUrl,
      instagramUrl,
      mobileNumber,
      storeName,
    ].some((fields) => fields === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedStoreAdmin = await StoreAdmin.findOne({
    $or: [{ username }, { email }],
  });

  if (existedStoreAdmin) {
    throw new ApiError(409, "Store Admin already exists");
  }

  const userImageLocalPath = req.file?.path;

  if (!userImageLocalPath) {
    throw new ApiError(400, "User Profile Image is required");
  }

  const userImage = await uploadOnCloudinary(userImageLocalPath);

  if (!userImage) {
    throw new ApiError(400, "User Profile Image is required");
  }

  const storeAdmin = await StoreAdmin.create({
    username,
    email,
    password,
    imageUrl: userImage.url,
    linkedinUrl,
    facebookUrl,
    instagramUrl,
    mobileNumber,
    storeName,
  });

  const createdStoreAdmin = await StoreAdmin.findById(storeAdmin._id).select(
    "-password -refreshToken"
  );

  if (!createdStoreAdmin) {
    throw new ApiError(
      400,
      "Something went wrong while registering a Store Admin"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdStoreAdmin, "Store Admin has been added")
    );
});

const loginStoreAdmin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  const storeAdmin = await StoreAdmin.findOne({
    $or: [{ username }, { email }],
  });

  if (!storeAdmin) {
    throw new ApiError(404, "Store Admin not found");
  }

  const isPasswordValid = await storeAdmin.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is invalid");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    storeAdmin._id
  );

  const loggedInAdmin = await StoreAdmin.findById(storeAdmin._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(
      new ApiResponse(
        200,
        { storeAdmin: loggedInAdmin, accessToken, refreshToken },
        "Store Admin logged in successfully"
      )
    );
});

const getStoreAdminDetails = asyncHandler(async (req, res) => {
  const storeAdminId = req.user;

  if (!storeAdminId) {
    throw new ApiError(400, "Store Admin ID is required");
  }

  const storeAdmin = await StoreAdmin.findById(storeAdminId).select(
    "-password -refreshToken"
  );

  if (!storeAdmin) {
    throw new ApiError(404, "Store Admin not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        storeAdmin,
        "Store Admin details retrieved successfully"
      )
    );
});

const getStoreAdminCout = asyncHandler(async (req, res) => {
  const storeAdminCount = await StoreAdmin.countDocuments();

  return res
    .status(201)
    .json(new ApiResponse(200, storeAdminCount, "Store Admin Count"));
});

export {
  createStoreAdmin,
  loginStoreAdmin,
  getStoreAdminDetails,
  getStoreAdminCout,
};
