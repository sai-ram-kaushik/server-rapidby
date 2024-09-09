import { Router } from "express";
import {
  createTicket,
  getAllTickets,
  getTicketByItsId,
  getTicketCounts,
  replyToTicket,
  updateTicketStatus,
} from "../controllers/ticket.controllers.js";

const router = Router();

router.route("/get-all-tickets").get(getAllTickets);
router.route("/get-ticket/:id").get(getTicketByItsId);
router.route("/create-ticket").post(createTicket);
router.route("/update-ticket-status/:id").put(updateTicketStatus);
router.route("/:id/reply-to-ticket").post(replyToTicket);
router.route("/get-ticket-count").get(getTicketCounts)
export default router;
