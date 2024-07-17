import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  updateOrderDetails,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/create-order").post(createOrder);
router.route("/get-all-orders").get(getAllOrders);
router.route("/update-order-details/:id").put(updateOrderDetails);

export default router;
