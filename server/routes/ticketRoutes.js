const express = require("express");
const {
  getUserTickets,
  getOpenTickets,
  getMyAssignedTickets,
  takeTicket,
  getTicketMessages,
  sendTicketMessage,
  getTicketDetail,
} = require("../controllers/ticketController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

/*
USER
*/
router.get("/my", protect, authorizeRoles("user"), getUserTickets);

/*
STAFF / ADMIN
*/
router.get(
  "/queue",
  protect,
  authorizeRoles("pengurus", "admin"),
  getOpenTickets,
);

router.get(
  "/my-assigned",
  protect,
  authorizeRoles("pengurus", "admin"),
  getMyAssignedTickets,
);

router.get(
  "/:id",
  protect,
  authorizeRoles("pengurus", "admin", "user"),
  getTicketDetail,
);
router.patch(
  "/:id/take",
  protect,
  authorizeRoles("pengurus", "admin"),
  takeTicket,
);

/*
MESSAGES
*/
router.get("/:id/messages", protect, getTicketMessages);

router.post("/:id/messages", protect, sendTicketMessage);

module.exports = router;
