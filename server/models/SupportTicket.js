const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
  {
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["open", "assigned", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
