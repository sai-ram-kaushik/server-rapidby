import { Router } from "express";
import {
  getTotalCustomers,
  loginUser,
  registerUser,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/create-user").post(registerUser);
router.route("/login-user").post(loginUser);
router.route("/total-customers").get(verifyJWT, getTotalCustomers);

export default router;
