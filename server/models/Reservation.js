const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    durationHours: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["pay_at_checkin", "online"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "rejected"],
      default: "unpaid",
    },

    paymentProof: {
      type: String,
      default: "",
    },

    paymentProofUploadedAt: {
      type: Date,
      default: null,
    },

    paymentVerifiedAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "checked_in", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

reservationSchema.index({
  room: 1,
  checkIn: 1,
  checkOut: 1,
});

module.exports = mongoose.model("Reservation", reservationSchema);
