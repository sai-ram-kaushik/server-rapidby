import { Router } from "express";
import {
  createStoreAdmin,
  getStoreAdminDetails,
  loginStoreAdmin,
} from "../controllers/store-admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/create-store-admin")
  .post(upload.single("imageUrl"), createStoreAdmin);
router.route("/login-store-admin").post(loginStoreAdmin);
router.route("/get-store-admin-details").get(verifyJWT, getStoreAdminDetails);
export default router;
