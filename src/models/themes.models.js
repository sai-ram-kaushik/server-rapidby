import mongoose from "mongoose";

const ThemeSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Theme = mongoose.model("Theme", ThemeSchema);
