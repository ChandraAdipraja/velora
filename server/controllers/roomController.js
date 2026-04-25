const Room = require("../models/Room");
const Reservation = require("../models/Reservation");

/* =========================
GET ALL ROOMS
========================= */

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({
      roomNumber: 1,
    });

    res.json({
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
CREATE ROOM
========================= */

const createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      roomType,
      pricePerHour,
      capacity,
      size,
      facilities,
      image,
      status,
    } = req.body;

    if (!roomNumber || !roomType || !pricePerHour) {
      return res.status(400).json({
        message: "Data kamar belum lengkap",
      });
    }

    const exists = await Room.findOne({
      roomNumber,
    });

    if (exists) {
      return res.status(400).json({
        message: "Nomor kamar sudah ada",
      });
    }

    const room = await Room.create({
      roomNumber,
      roomType,
      pricePerHour,
      capacity,
      size,
      facilities,
      image,
      status: status || "available",
    });

    res.status(201).json({
      message: "Kamar berhasil dibuat",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
UPDATE ROOM
========================= */

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!room) {
      return res.status(404).json({
        message: "Kamar tidak ditemukan",
      });
    }

    res.json({
      message: "Kamar diperbarui",
      room,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* =========================
DELETE ROOM
========================= */

const deleteRoom = async (req, res) => {
  try {
    const usedReservation = await Reservation.findOne({
      room: req.params.id,
      status: {
        $ne: "cancelled",
      },
    });

    if (usedReservation) {
      return res.status(400).json({
        message: "Kamar punya riwayat reservasi, ubah ke inactive saja.",
      });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.json({
      message: "Kamar dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
};
