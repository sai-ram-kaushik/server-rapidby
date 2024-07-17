import { Router } from "express";
import { createAdmin, logInAdmin } from "../controllers/admin.controller.js";

const router = Router();

router.route("/create-admin").post(createAdmin);
router.route("/login-admin").post(logInAdmin);

export default router;
