const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Room = require("../models/Room");

dotenv.config();
connectDB();

const rooms = [
  {
    roomNumber: "101",
    roomType: "Deluxe",
    pricePerHour: 150000,
    description:
      "Kamar Deluxe nyaman untuk dua tamu dengan interior modern dan suasana tenang.",
    capacity: 2,
    size: "32 m²",
    bedType: "King Bed",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80",
    facilities: ["AC", "WiFi", "TV", "Bathroom", "Breakfast"],
    status: "available",
  },
  {
    roomNumber: "102",
    roomType: "Deluxe",
    pricePerHour: 150000,
    description:
      "Kamar Deluxe nyaman untuk dua tamu dengan interior modern dan suasana tenang.",
    capacity: 2,
    size: "32 m²",
    bedType: "King Bed",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80",
    facilities: ["AC", "WiFi", "TV", "Bathroom", "Breakfast"],
    status: "available",
  },
  {
    roomNumber: "103",
    roomType: "Deluxe",
    pricePerHour: 150000,
    description:
      "Kamar Deluxe nyaman untuk dua tamu dengan interior modern dan suasana tenang.",
    capacity: 2,
    size: "32 m²",
    bedType: "King Bed",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80",
    facilities: ["AC", "WiFi", "TV", "Bathroom", "Breakfast"],
    status: "available",
  },

  {
    roomNumber: "201",
    roomType: "Executive",
    pricePerHour: 220000,
    description:
      "Kamar Executive dengan ruang lebih luas untuk kenyamanan menginap yang lebih premium.",
    capacity: 3,
    size: "45 m²",
    bedType: "Queen Bed",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
    facilities: ["AC", "WiFi", "TV", "Mini Bar", "Bathtub"],
    status: "available",
  },
  {
    roomNumber: "202",
    roomType: "Executive",
    pricePerHour: 220000,
    description:
      "Kamar Executive dengan ruang lebih luas untuk kenyamanan menginap yang lebih premium.",
    capacity: 3,
    size: "45 m²",
    bedType: "Queen Bed",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
    facilities: ["AC", "WiFi", "TV", "Mini Bar", "Bathtub"],
    status: "available",
  },

  {
    roomNumber: "301",
    roomType: "Presidential",
    pricePerHour: 600000,
    description:
      "Presidential Suite eksklusif dengan fasilitas terbaik untuk pengalaman menginap mewah.",
    capacity: 4,
    size: "90 m²",
    bedType: "King Bed",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
    facilities: ["Private Pool", "Jacuzzi", "Butler", "Living Room"],
    status: "available",
  },
];

const importData = async () => {
  try {
    await Room.deleteMany();
    await Room.insertMany(rooms);

    console.log("Rooms seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

importData();
