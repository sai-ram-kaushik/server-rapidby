import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreAdmin",
      required: true,
    },
    catalogItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Catalog",
      required: true,
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StoreAdmin",
    },
    // quantity: {
    //   type: Number,
    //   required: true,
    // },
    // status: {
    //   type: String,
    //   required: true,
    //   enum: ['available', 'unavailable'], // Example status values
    // },
    // Add other necessary fields as per your requirements
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
