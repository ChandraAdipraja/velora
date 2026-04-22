const express = require("express");
const {
  register,
  login,
  getMe,
  createUserByAdmin,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/me", protect, getMe);

// Admin only
router.post(
  "/create-user",
  protect,
  authorizeRoles("admin"),
  createUserByAdmin,
);

module.exports = router;
