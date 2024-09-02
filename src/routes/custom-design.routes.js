import { Router } from "express";
import {
  addMessage,
  createOrGetChat,
  getChatByProductId,
} from "../controllers/custom-design-chat.controller.js";

const router = Router();

router.route("/chat").post(createOrGetChat);
router.route("/chat/message").post(addMessage);
router.route("/chat/product/:productId").get(getChatByProductId);

export default router;
