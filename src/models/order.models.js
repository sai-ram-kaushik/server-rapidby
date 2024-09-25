import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },

        imageUrl: {
          type: [String],
          required: true,
        },
        amount: {
          type: Number,
        },
      },
    ],

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "pending",
    },

    mobileNumber: {
      type: String,
      required: true,
    },

    places: {
      type: String,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
