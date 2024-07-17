import Razorpay from "razorpay";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const createPayment = asyncHandler(async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.PAYMENT_KEY_ID,
    key_secret: process.env.PAYMENT_KET_SECRET,
  });

  const options = {
    amount: req.body.amount,
    currency: req.body.currency,
    receipt: "receipt#1",
    payment_capture: 1,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    throw new ApiError(500, "Internal Server Error", error);
  }
});

const getPaymentDetails = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const razorpay = new Razorpay({
    key_id: process.env.PAYMENT_KEY_ID,
    key_secret: process.env.PAYMENT_KET_SECRET,
  });

  try {
    const payment = await razorpay.payments.fetch(paymentId);
    if (!payment) {
      throw new ApiError(500, "Error at razorpay");
    }

    return res.status(201).json(
      new ApiResponse(200, {
        status: payment.status,
        method: payment.method,
        amount: payment.amount,
        currency: payment.currency,
      })
    );
  } catch (error) {
    console.log(error);
  }
});

export { createPayment, getPaymentDetails };
