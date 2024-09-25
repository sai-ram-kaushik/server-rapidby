import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { StoreAdmin } from "../models/store-admin.models.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generation access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, store, contact, province } = req.body;

  if (
    [name, email, password, store, contact, province].some(
      (fields) => fields === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ name }, { email }],
  });

  // Use findOne() instead of find()
  const existedStore = await StoreAdmin.findOne({ storeName: store });
  if (!existedStore) {
    throw new ApiError(404, "Store not found");
  }

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    store: existedStore.storeName, // Use _id from the found store document
    contact,
    province,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, user, "User has been created"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { name, email, password, store } = req.body;

  // Ensure either name or email is provided
  if (!(name || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  // Find user by name or email
  const user = await User.findOne({
    $or: [{ name }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if the provided store exists
  let existedStore = null;
  if (store) {
    existedStore = await StoreAdmin.findOne({ storeName: store });
    if (!existedStore) {
      throw new ApiError(404, "Store not found");
    }
  }

  // Validate password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, "Password is invalid");
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // Fetch logged-in user data excluding password and refreshToken
  const loggedInUser = await User.findById(user.id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  // Send cookies and response
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const getTotalCustomers = asyncHandler(async (req, res) => {
  // Assuming you have the logged-in StoreAdmin's ID from the authentication token or session
  const storeAdminId = req.user.id; // req.user should hold the authenticated store admin

  // Find the store admin by ID
  const storeAdmin = await StoreAdmin.findById(storeAdminId);
  if (!storeAdmin) {
    throw new ApiError(404, "Store admin not found");
  }

  // Count the number of users associated with the store
  const userCount = await User.countDocuments({ store: storeAdmin.storeName });

  // Return the count of users
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { store: storeAdmin.storeName, userCount },
        "User count fetched successfully"
      )
    );
});

const getUsersByStoreAdmin = asyncHandler(async (req, res) => {
  const storeAdminId = req.user.id;

  const storeAdmin = await StoreAdmin.findById(storeAdminId);
  if (!storeAdmin) {
    throw new ApiError(404, "Store admin not found");
  }

  const users = await User.find({ store: storeAdmin.storeName }).select(
    "-password -refreshToken"
  );

  if (users.length === 0) {
    throw new ApiError(404, "No users found for this store");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export { registerUser, loginUser, getTotalCustomers, getUsersByStoreAdmin };
