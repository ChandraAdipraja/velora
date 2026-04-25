const express = require("express");
const {
  getAllRooms,
  getGroupedRoomsByType,
  getRoomUnitsByType,
} = require("../controllers/roomController");

const router = express.Router();

router.get("/grouped/by-type", getGroupedRoomsByType);
router.get("/type/:roomType", getRoomUnitsByType);
router.get("/", getAllRooms);

module.exports = router;
