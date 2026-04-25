const Room = require("../models/Room");
const Reservation = require("../models/Reservation");

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.json({ rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGroupedRoomsByType = async (req, res) => {
  try {
    const rooms = await Room.find({ status: "available" }).sort({
      roomNumber: 1,
    });

    const grouped = Object.values(
      rooms.reduce((acc, room) => {
        if (!acc[room.roomType]) {
          acc[room.roomType] = {
            id: room.roomType,
            name: room.roomType,
            roomType: room.roomType,
            pricePerHour: room.pricePerHour,
            capacity: room.capacity,
            size: room.size,
            image: room.image,
            facilities: room.facilities || [],
            totalUnits: 0,
            availableUnits: 0,
          };
        }

        acc[room.roomType].totalUnits += 1;
        acc[room.roomType].availableUnits += 1;

        return acc;
      }, {}),
    );

    res.json({ rooms: grouped });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRoomUnitsByType = async (req, res) => {
  try {
    const { roomType } = req.params;

    const rooms = await Room.find({
      roomType,
      status: "available",
    }).sort({ roomNumber: 1 });

    if (!rooms.length) {
      return res.status(404).json({
        message: "Tipe kamar tidak ditemukan",
      });
    }

    res.json({
      roomType,
      rooms,
      detail: {
        name: roomType,
        roomType,
        pricePerHour: rooms[0].pricePerHour,
        capacity: rooms[0].capacity,
        size: rooms[0].size,
        image: rooms[0].image,
        facilities: rooms[0].facilities || [],
        totalUnits: rooms.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    const exists = await Room.findOne({ roomNumber });

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
    res.status(500).json({ message: error.message });
  }
};

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
    res.status(500).json({ message: error.message });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const usedReservation = await Reservation.findOne({
      room: req.params.id,
      status: { $ne: "cancelled" },
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
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllRooms,
  getGroupedRoomsByType,
  getRoomUnitsByType,
  createRoom,
  updateRoom,
  deleteRoom,
};
