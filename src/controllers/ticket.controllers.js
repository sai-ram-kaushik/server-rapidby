import { asyncHandler } from "../utils/asyncHandler.js";
import { Ticket } from "../models/ticket.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const getAllTickets = asyncHandler(async (req, res) => {
  try {
    const tickets = await Ticket.find();
    return res.status(201).json(new ApiResponse(200, tickets, "All Tickets"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const getTicketByItsId = asyncHandler(async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const createTicket = asyncHandler(async (req, res) => {
  const { name, subject, messages } = req.body;

  if ([name, subject, messages].some((fields) => fields == "")) {
    throw new ApiError(400, "All fields are required");
  }

  const ticket = await Ticket.create({ name, subject, messages });

  return res
    .status(201)
    .json(new ApiResponse(200, ticket, "Ticket has been raised"));
});

const updateTicketStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.status = status;
    await ticket.save();

    return res
      .status(200)
      .json(new ApiResponse(200, ticket, "Ticket status has been updated"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const replyToTicket = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    throw new ApiError(400, "Message is required");
  }

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.messages.push({ message, date: new Date() });
    await ticket.save();

    return res
      .status(200)
      .json(new ApiResponse(200, ticket, "Reply has been added to the ticket"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const getTicketCounts = asyncHandler(async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();

    const openTickets = await Ticket.countDocuments({ status: "open" });

    const inProcessTickets = await Ticket.countDocuments({
      status: "in-process",
    });

    const closedTickets = await Ticket.countDocuments({ status: "closed" });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { totalTickets, openTickets, inProcessTickets, closedTickets },
          "Ticket counts fetched successfully"
        )
      );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export {
  getAllTickets,
  getTicketByItsId,
  createTicket,
  updateTicketStatus,
  replyToTicket,
  getTicketCounts
};
