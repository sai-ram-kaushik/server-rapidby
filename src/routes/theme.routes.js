import { Router } from "express";
import {
  addTheme,
  getAllThemes,
  setStoreTheme,
} from "../controllers/theme.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add-theme").post(upload.single("imageUrl"), addTheme);
router.route("/get-all-themes").get(getAllThemes);
router.route("/set-store-theme").put(setStoreTheme);

export default router;
