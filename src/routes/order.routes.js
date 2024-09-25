import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getMonthlyMetrics,
  getOrderByItsId,
  getPendingOrdersCount,
  getRevenuePerMonth,
  updateOrderDetails,
  getUserOrderStats
} from "../controllers/order.controller.js";

const router = Router();

router.route("/create-order").post(createOrder);
router.route("/get-all-orders").get(getAllOrders);
router.route("/update-order-details/:id").put(updateOrderDetails);
router.route("/order-pending-count").get(getPendingOrdersCount);
router.route("/order-metrix").get(getMonthlyMetrics);
router.route("/get-order/:id").get(getOrderByItsId);
router.route("/get-revenue-per-month").get(getRevenuePerMonth);
router.route("/user/:userId/orders/stats").get(getUserOrderStats)
export default router;
