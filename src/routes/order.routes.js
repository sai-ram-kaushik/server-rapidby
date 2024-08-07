import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getPendingOrdersCount,
  updateOrderDetails,
} from "../controllers/order.controller.js";

const router = Router();

router.route("/create-order").post(createOrder);
router.route("/get-all-orders").get(getAllOrders);
router.route("/update-order-details/:id").put(updateOrderDetails);
router.route("/order-pending-count").get(getPendingOrdersCount);

export default router;
