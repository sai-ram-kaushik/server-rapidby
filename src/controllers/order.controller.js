import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Order } from "../models/order.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import moment from "moment";

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

    res
      .status(200)
      .json({ message: "Order status updated successfully", updatedOrder });
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

const getPendingOrdersCount = asyncHandler(async (req, res) => {
  try {
    const pendingCount = await Order.countDocuments({ status: "pending" });

    return res
      .status(200)
      .json(
        new ApiResponse(200, pendingCount, "Total number of pending orders")
      );
  } catch (error) {
    console.error("Error getting pending orders count:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

const getMonthlyMetrics = asyncHandler(async (req, res) => {
  const startOfMonth = moment().startOf("month").toDate();
  const endOfMonth = moment().endOf("month").toDate();

  // Fetch all orders created within the current month
  const orders = await Order.find({
    createdAt: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  });

  // Fetch counts for different order statuses within the current month
  const deliveredOrdersCount = await Order.countDocuments({
    status: "delivered",
    updatedAt: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  });

  const readyToDeliverCount = await Order.countDocuments({
    status: "ready to deliver",
    updatedAt: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  });

  const inQueueCount = await Order.countDocuments({
    status: "in queue",
    updatedAt: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  });

  const pendingCount = await Order.countDocuments({
    status: "pending",
    updatedAt: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  });

  let totalSales = 0;
  let totalProfit = 0;
  let productsSold = 0;
  let totalOrdersCount = orders.length;

  orders.forEach((order) => {
    totalSales += order.totalPrice;
    totalProfit += order.totalPrice - order.cost;
    order.items.forEach((item) => {
      productsSold += item.quantity;
    });
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalSales,
        totalProfit,
        productsSold,
        totalOrdersCount,
        deliveredOrdersCount,
        readyToDeliverCount,
        inQueueCount,
        pendingCount,
      },
      "Monthly metrics calculated successfully"
    )
  );
});

const getRevenuePerMonth = asyncHandler(async (req, res) => {
  try {
    // Get the current year to filter orders by year
    const currentYear = moment().year();

    // Aggregate data to calculate total revenue for each month
    const revenueData = await Order.aggregate([
      {
        // Match orders created in the current year
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      },
      {
        // Group by month and calculate the total revenue
        $group: {
          _id: { $month: "$createdAt" }, // Group by month
          totalRevenue: { $sum: "$totalPrice" }, // Calculate total revenue
        },
      },
      {
        // Sort by month (ascending order)
        $sort: { "_id": 1 },
      },
    ]);

    // Create an array with default revenue set to 0 for all 12 months
    const revenueByMonth = Array(12).fill(0);

    // Populate the revenue data for the corresponding months
    revenueData.forEach((data) => {
      const monthIndex = data._id - 1; // Month index (January is 0)
      revenueByMonth[monthIndex] = data.totalRevenue;
    });

    // Return the monthly revenue data
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { revenueByMonth },
          "Monthly revenue data fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching monthly revenue data:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

const getUserOrderStats = asyncHandler(async (req, res) => {
  const userId = req.params.userId; // Get user ID from request params

  try {
   
    const userOrders = await Order.find({ user: userId });

    if (!userOrders || userOrders.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No orders found for this user"));
    }

    // Calculate total number of orders and total amount spent
    const totalOrders = userOrders.length;
    const totalAmountSpent = userOrders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        { totalOrders, totalAmountSpent },
        "User's order statistics fetched successfully"
      )
    );
  } catch (error) {
    console.error("Error fetching user order stats:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});


export {
  createOrder,
  getAllOrders,
  getOrderByItsId,
  getNumberOfOrders,
  updateOrderDetails,
  deleteOrder,
  getPendingOrdersCount,
  getMonthlyMetrics,
  getRevenuePerMonth,
  getUserOrderStats
};
