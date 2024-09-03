import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const ticketSchema = new mongoose.Schema(
  {
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

    messages: [messageSchema],
  },
  { timestamps: true }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
