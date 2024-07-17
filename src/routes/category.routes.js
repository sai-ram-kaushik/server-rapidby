import { Router } from "express";
import {
  createCategory,
  getAllCategories,
} from "../controllers/category.controller.js";

const router = Router();

router.route("/create-category").post(createCategory);
router.route("/get-all-categories").get(getAllCategories);

export default router;
