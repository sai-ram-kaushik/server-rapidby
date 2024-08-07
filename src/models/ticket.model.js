import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Open",
    },

    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
