const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    roomType: {
      type: String,
      required: true,
      enum: ["Deluxe", "Executive", "Presidential"],
    },
    pricePerHour: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    size: {
      type: String,
      default: "",
    },
    bedType: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    facilities: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["available", "maintenance", "inactive"],
      default: "available",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Room", roomSchema);
