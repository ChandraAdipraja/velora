const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { Delete } = require("lucide-react");

const allowedRoles = ["user", "pengurus", "admin"];
const allowedStatuses = ["active", "suspended"];

const SupportTicket = require("../models/SupportTicket");
const TicketMessage = require("../models/TicketMessage");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nama, email, dan password wajib diisi" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      status: "active",
    });

    const safeUser = await User.findById(user._id).select("-password");

    res.status(201).json({
      message: "User berhasil dibuat",
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email;

    if (role) {
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Role tidak valid" });
      }
      updates.role = role;
    }

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Status tidak valid" });
      }
      updates.status = status;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({
      message: "User berhasil diperbarui",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Role tidak valid" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({
      message: "Role berhasil diperbarui",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleSuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    user.status = user.status === "suspended" ? "active" : "suspended";
    await user.save();

    res.json({
      message: "Status user berhasil diperbarui",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.json({
      message: "User berhasil dihapus",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getChatLogs = async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate("user", "name email")
      .populate("assignedStaff", "name email")
      .populate({
        path: "reservation",
        populate: {
          path: "room",
          model: "Room",
        },
      })
      .sort({ createdAt: -1 });

    const logs = await Promise.all(
      tickets.map(async (ticket) => {
        const lastMessage = await TicketMessage.findOne({ ticket: ticket._id })
          .sort({ createdAt: -1 })
          .populate("sender", "name email role");

        const messageCount = await TicketMessage.countDocuments({
          ticket: ticket._id,
        });

        return {
          id: ticket._id,
          status: ticket.status,
          guestName: ticket.user?.name || "-",
          guestEmail: ticket.user?.email || "-",
          assignedStaff: ticket.assignedStaff?.name || "Unassigned",
          room: ticket.reservation?.room
            ? `${ticket.reservation.room.roomType} #${ticket.reservation.room.roomNumber}`
            : "-",
          reservationId: ticket.reservation?._id || "-",
          messageCount,
          lastMessage: lastMessage?.message || "No messages yet",
          lastMessageAt: lastMessage?.createdAt || ticket.createdAt,
          createdAt: ticket.createdAt,
        };
      }),
    );

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChatLogDetail = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate("user", "name email")
      .populate("assignedStaff", "name email")
      .populate({
        path: "reservation",
        populate: {
          path: "room",
          model: "Room",
        },
      });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket tidak ditemukan" });
    }

    const messages = await TicketMessage.find({ ticket: req.params.id })
      .populate("sender", "name email role")
      .sort({ createdAt: 1 });

    res.json({ ticket, messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  toggleSuspendUser,
  getChatLogs,
  getChatLogDetail,
};
