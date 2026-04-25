const express = require("express");
const {
  createReservation,
  getMyReservations,
  getReservationDetail,
  uploadPaymentProof,
  getAllReservationsForStaff,
  verifyPayment,
  rejectPayment,
  updateReservationStatus,
  getReservationById,
} = require("../controllers/reservationController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const uploadPaymentProofFile = require("../middleware/paymentUpload");

const router = express.Router();

/*
USER
*/
router.get("/my", protect, authorizeRoles("user"), getMyReservations);

router.post("/", protect, authorizeRoles("user"), createReservation);

router.get("/:id", protect, authorizeRoles("user"), getReservationById);

router.post(
  "/:id/payment-proof",
  protect,
  authorizeRoles("user"),
  uploadPaymentProofFile.single("paymentProof"),
  uploadPaymentProof,
);

/*
STAFF / ADMIN
*/
router.get(
  "/staff/all",
  protect,
  authorizeRoles("pengurus", "admin"),
  getAllReservationsForStaff,
);

router.patch(
  "/:id/verify-payment",
  protect,
  authorizeRoles("pengurus", "admin"),
  verifyPayment,
);

router.patch(
  "/:id/reject-payment",
  protect,
  authorizeRoles("pengurus", "admin"),
  rejectPayment,
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("pengurus", "admin"),
  updateReservationStatus,
);

/*
DETAIL USER
taruh di bawah supaya tidak bentrok dengan /staff/all
*/
router.get("/:id", protect, authorizeRoles("user"), getReservationDetail);

module.exports = router;
