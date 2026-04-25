const SupportTicket = require("../models/SupportTicket");
const TicketMessage = require("../models/TicketMessage");

/*
=================================================
USER - GET MY TICKETS
=================================================
*/
const getUserTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({
      user: req.user.id,
    })
      .populate({
        path: "reservation",
        populate: {
          path: "room",
          model: "Room",
        },
      })
      .populate("assignedStaff", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      tickets,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
=================================================
STAFF - OPEN QUEUE
=================================================
*/
const getOpenTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({
      status: "open",
      assignedStaff: null,
    })
      .populate({
        path: "reservation",
        populate: [
          {
            path: "room",
            model: "Room",
          },
          {
            path: "user",
            model: "User",
            select: "name email",
          },
        ],
      })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      tickets,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
=================================================
STAFF - MY ASSIGNED TICKETS
=================================================
*/
const getMyAssignedTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({
      assignedStaff: req.user.id,
    })
      .populate({
        path: "reservation",
        populate: [
          {
            path: "room",
            model: "Room",
          },
          {
            path: "user",
            model: "User",
            select: "name email",
          },
        ],
      })
      .populate("user", "name email")
      .populate("assignedStaff", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      tickets,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
=================================================
STAFF - TAKE TICKET
=================================================
*/
const takeTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket tidak ditemukan",
      });
    }

    if (ticket.assignedStaff) {
      return res.status(400).json({
        message: "Ticket sudah diambil pengurus lain",
      });
    }

    ticket.assignedStaff = req.user.id;
    ticket.status = "assigned";

    await ticket.save();

    return res.status(200).json({
      message: "Ticket berhasil diambil",
      ticket,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
=================================================
GET TICKET MESSAGES
=================================================
*/
const getTicketMessages = async (req, res) => {
  try {
    const messages = await TicketMessage.find({
      ticket: req.params.id,
    })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
=================================================
SEND TICKET MESSAGE
=================================================
*/
const sendTicketMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Pesan tidak boleh kosong",
      });
    }

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket tidak ditemukan",
      });
    }

    const newMessage = await TicketMessage.create({
      ticket: req.params.id,
      sender: req.user.id,
      senderRole: req.user.role,
      message: message.trim(),
    });

    const populatedMessage = await TicketMessage.findById(
      newMessage._id,
    ).populate("sender", "name email role");

    return res.status(201).json({
      message: "Pesan berhasil dikirim",
      chat: populatedMessage,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getTicketDetail = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate({
        path: "reservation",
        populate: [
          {
            path: "room",
            model: "Room",
          },
          {
            path: "user",
            model: "User",
            select: "name email",
          },
        ],
      })
      .populate("user", "name email")
      .populate("assignedStaff", "name email");

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket tidak ditemukan",
      });
    }

    if (
      req.user.role === "pengurus" &&
      ticket.assignedStaff &&
      ticket.assignedStaff._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Ticket ini ditangani pengurus lain",
      });
    }

    return res.status(200).json({
      ticket,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getUserTickets,
  getOpenTickets,
  getMyAssignedTickets,
  takeTicket,
  getTicketMessages,
  sendTicketMessage,
  getTicketDetail,
};
