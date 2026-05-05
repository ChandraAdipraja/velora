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

    // Get current reservations (active ones)
    const now = new Date();
    const activeReservations = await Reservation.find({
      status: { $ne: "cancelled" },
      checkIn: { $lt: now },
      checkOut: { $gt: now },
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
            description: room.description,
            facilities: room.facilities || [],
            totalUnits: 0,
            availableUnits: 0,
          };
        }

        acc[room.roomType].totalUnits += 1;

        // Check if this room has an active reservation
        const isOccupied = activeReservations.some(
          (res) => res.room.toString() === room._id.toString(),
        );

        if (!isOccupied) {
          acc[room.roomType].availableUnits += 1;
        }

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

const checkRoomAvailabilityByType = async (req, res) => {
  try {
    const { roomType } = req.params;
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        message: "checkIn dan checkOut wajib diisi",
      });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Format tanggal tidak valid",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        message: "Check-out harus setelah check-in",
      });
    }

    const rooms = await Room.find({
      roomType,
      status: "available",
    }).sort({ roomNumber: 1 });

    if (!rooms.length) {
      return res.status(404).json({
        message: "Tipe kamar tidak ditemukan",
      });
    }

    const occupiedRoomIds = await Reservation.find({
      room: { $in: rooms.map((room) => room._id) },
      status: { $ne: "cancelled" },
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    }).distinct("room");

    const availableRooms = rooms.filter(
      (room) =>
        !occupiedRoomIds.some(
          (occupiedRoomId) => occupiedRoomId.toString() === room._id.toString(),
        ),
    );

    return res.json({
      roomType,
      checkIn: start,
      checkOut: end,
      totalUnits: rooms.length,
      availableUnits: availableRooms.length,
      isAvailable: availableRooms.length > 0,
      availableRooms: availableRooms.map((room) => ({
        id: room._id,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
      })),
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
      description,
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
      description,
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
  checkRoomAvailabilityByType,
  createRoom,
  updateRoom,
  deleteRoom,
};
