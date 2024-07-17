import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Order } from "../models/order.models.js";
import { ApiResponse } from "../utils/apiResponse.js";

const createOrder = asyncHandler(async (req, res) => {
  try {
    const { cartItems, firstName, lastName, email, mobileNumber, places } =
      req.body;

    if (!cartItems) {
      throw new ApiError(400, "Cart items are required");
    }

    const order = await Order.create({
      items: cartItems,
      firstName,
      lastName,
      email,
      mobileNumber,
      places,
    });

    return res
      .status(201)
      .json(new ApiResponse(200, order, "Order has been placed"));
  } catch (error) {
    console.log("Error creating order", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  return res.status(200).json(new ApiResponse(200, orders, "All Orders"));
});

const getOrderByItsId = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const orderById = await Order.findById(orderId);

  if (!orderById) {
    throw new ApiError(404, "Order not found");
  }

  // If the order is found, return it
  return res.status(200).json(new ApiResponse(200, orderById, "Order by Id"));
});

const getNumberOfOrders = asyncHandler(async (req, res) => {
  const count = await Order.countDocuments();
  return res
    .status(200)
    .json(new ApiResponse(200, count, "Total number of orders"));
});

const updateOrderDetails = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated successfully", updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const deleteOrder = asyncHandler(async (req, res) => {
  const deleteOrderByItsId = req.params.id;

  const deleteOrder = await Order.findByIdAndDelete(deleteOrderByItsId);

  if (!deleteOrder) {
    throw new ApiError(404, "Order not found");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, null, "Order has been deleted"));
});

export {
  createOrder,
  getAllOrders,
  getOrderByItsId,
  getNumberOfOrders,
  updateOrderDetails,
  deleteOrder,
};