import mongoose from "mongoose";

const catalogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.String,
      ref: "Category",
      required: true,
    },

    amount: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    quantity: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },

    aboutProduct: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Catalog = mongoose.model("Catalog", catalogSchema);
