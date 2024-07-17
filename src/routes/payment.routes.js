import Router from "express";
import {
  createPayment,
  getPaymentDetails,
} from "../controllers/payment.controller.js";

const router = Router();

router.route("/orders").post(createPayment);
router.route("/payment/:paymentId").get(getPaymentDetails);

export default router;
