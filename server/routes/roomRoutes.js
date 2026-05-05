const router = require("express").Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  getAllRooms,
  getGroupedRoomsByType,
  getRoomUnitsByType,
  checkRoomAvailabilityByType,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

router.get("/grouped/by-type", getGroupedRoomsByType);
router.get("/type/:roomType", getRoomUnitsByType);
router.get("/type/:roomType/availability", checkRoomAvailabilityByType);
router.get("/", getAllRooms);

router.post("/", protect, adminOnly, createRoom);
router.patch("/:id", protect, adminOnly, updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);

module.exports = router;
