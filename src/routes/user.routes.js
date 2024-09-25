import { Router } from "express";
import {
  getUsersByStoreAdmin,
  getTotalCustomers,
  loginUser,
  registerUser,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/create-user").post(registerUser);
router.route("/login-user").post(loginUser);
router.route("/total-customers").get(verifyJWT, getTotalCustomers);
router
  .route("/get-total-customer-details")
  .get(verifyJWT, getUsersByStoreAdmin);

export default router;
