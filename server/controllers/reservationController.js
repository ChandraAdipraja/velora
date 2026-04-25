const Reservation = require("../models/Reservation");
const Room = require("../models/Room");
const SupportTicket = require("../models/SupportTicket");

/*
=================================================
CREATE RESERVATION
=================================================
*/
console.log("reservationController loaded");
const createReservation = async (req, res) => {
  try {
    const { roomType, checkIn, checkOut, paymentMethod } = req.body;

    if (!roomType || !checkIn || !checkOut || !paymentMethod) {
      return res.status(400).json({
        message: "Data reservasi tidak lengkap",
      });
    }

    if (!["pay_at_checkin", "online"].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Metode pembayaran tidak valid",
      });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (end <= start) {
      return res.status(400).json({
        message: "Check-out harus setelah check-in",
      });
    }

    const diffMs = end - start;
    const durationHours = diffMs / (1000 * 60 * 60);

    if (durationHours < 3) {
      return res.status(400).json({
        message: "Minimal reservasi adalah 3 jam",
      });
    }

    /*
    Ambil semua unit kamar tipe ini
    */
    const candidateRooms = await Room.find({
      roomType,
      status: "available",
    }).sort({
      roomNumber: 1,
    });

    if (!candidateRooms.length) {
      return res.status(404).json({
        message: "Tidak ada kamar aktif tersedia",
      });
    }

    /*
    Cari kamar yang tidak bentrok
    */
    let selectedRoom = null;

    for (const room of candidateRooms) {
      const overlap = await Reservation.findOne({
        room: room._id,
        status: {
          $ne: "cancelled",
        },
        checkIn: {
          $lt: end,
        },
        checkOut: {
          $gt: start,
        },
      });

      if (!overlap) {
        selectedRoom = room;
        break;
      }
    }

    if (!selectedRoom) {
      return res.status(400).json({
        message: "Semua kamar penuh pada rentang waktu itu",
      });
    }

    /*
    Hitung harga
    */

    const totalPrice = durationHours * selectedRoom.pricePerHour;

    /*
    Buat reservasi
    */

    const reservation = await Reservation.create({
      user: req.user.id,
      room: selectedRoom._id,

      checkIn: start,
      checkOut: end,

      durationHours,
      totalPrice,

      paymentMethod,

      paymentStatus: paymentMethod === "online" ? "unpaid" : "unpaid",

      status: "pending",
    });

    const ticket = await SupportTicket.create({
      reservation: reservation._id,
      user: req.user.id,
    });

    return res.status(201).json({
      message: "Reservasi berhasil dibuat",
      reservation,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
=================================================
USER - MY RESERVATIONS
=================================================
*/

const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      user: req.user.id,
    })
      .populate("room")
      .sort({ createdAt: -1 });

    const formattedReservations = reservations.map((item) => ({
      id: item._id,

      room: `${item.room?.roomType} Room`,

      roomNumber: item.room?.roomNumber,

      schedule: `${new Date(item.checkIn).toLocaleString("id-ID")} - ${new Date(
        item.checkOut,
      ).toLocaleString("id-ID")}`,

      status: item.status,
      payment: item.paymentStatus,
      paymentMethod: item.paymentMethod,

      totalPrice: item.totalPrice,

      durationHours: item.durationHours,
    }));

    return res.status(200).json({
      reservations: formattedReservations,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
=================================================
USER - RECEIPT DETAIL
=================================================
*/

const getReservationDetail = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("user", "name email")
      .populate("room");

    if (!reservation) {
      return res.status(404).json({
        message: "Reservasi tidak ditemukan",
      });
    }

    if (reservation.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Akses ditolak",
      });
    }

    return res.status(200).json({
      reservation: {
        id: reservation._id,

        userName: reservation.user.name,

        userEmail: reservation.user.email,

        roomType: reservation.room.roomType,

        roomNumber: reservation.room.roomNumber,

        checkIn: reservation.checkIn,

        checkOut: reservation.checkOut,

        durationHours: reservation.durationHours,

        totalPrice: reservation.totalPrice,

        paymentMethod: reservation.paymentMethod,

        paymentStatus: reservation.paymentStatus,

        status: reservation.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
=================================================
UPLOAD PAYMENT PROOF
=================================================
*/

const uploadPaymentProof = async (req, res) => {
  try {
    const { paymentProof } = req.body;

    if (!paymentProof) {
      return res.status(400).json({
        message: "Bukti pembayaran wajib diisi",
      });
    }

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservasi tidak ditemukan",
      });
    }

    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Akses ditolak",
      });
    }

    reservation.paymentProof = paymentProof;

    reservation.paymentStatus = "pending";

    await reservation.save();

    return res.status(200).json({
      message: "Bukti pembayaran berhasil dikirim",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
=================================================
STAFF - GET ALL RESERVATIONS
=================================================
*/

const getAllReservationsForStaff = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "name email")
      .populate("room")
      .sort({
        createdAt: -1,
      });

    const formatted = reservations.map((item) => ({
      id: item._id,

      guestName: item.user?.name,

      guestEmail: item.user?.email,

      roomType: item.room?.roomType,

      roomNumber: item.room?.roomNumber,

      checkIn: item.checkIn,

      checkOut: item.checkOut,

      paymentMethod: item.paymentMethod,

      paymentStatus: item.paymentStatus,

      status: item.status,

      totalPrice: item.totalPrice,

      durationHours: item.durationHours,

      hasPaymentProof: !!item.paymentProof,
    }));

    return res.status(200).json({
      reservations: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
=================================================
VERIFY PAYMENT
=================================================
*/

const verifyPayment = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservasi tidak ditemukan",
      });
    }

    reservation.paymentStatus = "paid";

    await reservation.save();

    return res.status(200).json({
      message: "Pembayaran diverifikasi",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
=================================================
REJECT PAYMENT
=================================================
*/

const rejectPayment = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservasi tidak ditemukan",
      });
    }

    reservation.paymentStatus = "rejected";

    await reservation.save();

    return res.status(200).json({
      message: "Pembayaran ditolak",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/*
=================================================
UPDATE RESERVATION STATUS
=================================================
*/

const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "checked_in",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status tidak valid",
      });
    }

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        message: "Reservasi tidak ditemukan",
      });
    }

    reservation.status = status;

    // AUTO MARK PAID WHEN CHECK-IN
    if (
      status === "checked_in" &&
      reservation.paymentMethod === "pay_at_checkin"
    ) {
      reservation.paymentStatus = "paid";
    }

    await reservation.save();

    return res.status(200).json({
      message: "Status berhasil diupdate",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  getReservationDetail,
  uploadPaymentProof,

  getAllReservationsForStaff,
  verifyPayment,
  rejectPayment,
  updateReservationStatus,
};
