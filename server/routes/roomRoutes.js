const router = require("express").Router();

const protect = require("../middleware/authMiddleware");

const adminOnly = require("../middleware/adminMiddleware");

const {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

router.get("/", getAllRooms);

/* admin only */

router.post("/", protect, adminOnly, createRoom);

router.patch("/:id", protect, adminOnly, updateRoom);

router.delete("/:id", protect, adminOnly, deleteRoom);

module.exports = router;
