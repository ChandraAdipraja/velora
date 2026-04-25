const Room = require("../models/Room");

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      status: { $ne: "inactive" },
    }).sort({ roomNumber: 1 });

    return res.status(200).json({
      message: "Data semua kamar berhasil diambil",
      rooms,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

const getGroupedRoomsByType = async (req, res) => {
  try {
    const groupedRooms = await Room.aggregate([
      {
        $match: {
          status: "available",
        },
      },
      {
        $group: {
          _id: "$roomType",
          availableUnits: { $sum: 1 },
          startingPrice: { $min: "$pricePerHour" },
          capacity: { $first: "$capacity" },
          size: { $first: "$size" },
          bedType: { $first: "$bedType" },
          image: { $first: "$image" },
          description: { $first: "$description" },
          facilities: { $first: "$facilities" },
        },
      },
      {
        $project: {
          _id: 0,
          roomType: "$_id",
          availableUnits: 1,
          startingPrice: 1,
          capacity: 1,
          size: 1,
          bedType: 1,
          image: 1,
          description: 1,
          facilities: 1,
        },
      },
      {
        $sort: { roomType: 1 },
      },
    ]);

    return res.status(200).json({
      message: "Data kamar per tipe berhasil diambil",
      rooms: groupedRooms,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

const getRoomUnitsByType = async (req, res) => {
  try {
    const { roomType } = req.params;

    const rooms = await Room.find({
      roomType,
      status: { $ne: "inactive" },
    }).sort({ roomNumber: 1 });

    return res.status(200).json({
      message: `Data unit kamar ${roomType} berhasil diambil`,
      rooms,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

module.exports = {
  getAllRooms,
  getGroupedRoomsByType,
  getRoomUnitsByType,
};
