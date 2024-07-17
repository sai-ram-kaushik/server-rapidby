import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { StoreAdmin } from "../models/store-admin.models.js";
import { Product } from "../models/product.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    let token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // Trim the token to remove any leading/trailing spaces
    token = token?.trim();

    // Log the token to ensure it's being captured correctly

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Log the decoded token to verify its structure

    // Find the user based on the decoded token's ID
    const user = await StoreAdmin.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // Attach the user to the request object
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
