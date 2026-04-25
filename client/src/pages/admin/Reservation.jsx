import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { useAuth } from "../../context/AuthContext";
import {
  getAllReservationsForStaff,
  updateReservationStatus,
  verifyPayment,
  rejectPayment,
} from "../../services/reservationService";

const statusTone = {
  pending: "warning",
  confirmed: "success",
  checked_in: "gold",
  completed: "navy",
  cancelled: "danger",
};

const paymentTone = {
  unpaid: "warning",
  pending: "warning",
  paid: "success",
  rejected: "danger",
};

const formatStatus = (status) => {
  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    checked_in: "Checked-In",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return labels[status] || status;
};

const formatPayment = (status) => {
  const labels = {
    unpaid: "Unpaid",
    pending: "Pending",
    paid: "Paid",
    rejected: "Rejected",
  };

  return labels[status] || status;
};

const formatDateTime = (value) =>
  new Date(value).toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });

const formatCurrency = (value) =>
  `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const Reservation = () => {
  const { token } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");

  const fetchReservations = async () => {
    try {
      setError("");
      const data = await getAllReservationsForStaff(token);
      setReservations(data.reservations || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data reservasi");
    }
  };

  useEffect(() => {
    if (token) fetchReservations();
  }, [token]);

  const checkedInToday = useMemo(() => {
    const today = new Date().toDateString();

    return reservations.filter((item) => {
      return (
        item.status === "checked_in" &&
        new Date(item.checkIn).toDateString() === today
      );
    });
  }, [reservations]);

  const pendingApproval = useMemo(
    () => reservations.filter((item) => item.status === "pending"),
    [reservations],
  );

  const cancelledReservations = useMemo(
    () => reservations.filter((item) => item.status === "cancelled"),
    [reservations],
  );

  const handleUpdateStatus = async (id, status) => {
    try {
      setProcessingId(id);
      await updateReservationStatus(id, status, token);
      await fetchReservations();

      setSelectedReservation((prev) =>
        prev && prev.id === id ? { ...prev, status } : prev,
      );
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui status");
    } finally {
      setProcessingId("");
    }
  };

  const handleVerifyPayment = async (id) => {
    try {
      setProcessingId(id);
      await verifyPayment(id, token);
      await fetchReservations();

      setSelectedReservation((prev) =>
        prev && prev.id === id ? { ...prev, paymentStatus: "paid" } : prev,
      );
    } catch (err) {
      setError(err.response?.data?.message || "Gagal verifikasi pembayaran");
    } finally {
      setProcessingId("");
    }
  };

  const handleRejectPayment = async (id) => {
    try {
      setProcessingId(id);
      await rejectPayment(id, token);
      await fetchReservations();

      setSelectedReservation((prev) =>
        prev && prev.id === id ? { ...prev, paymentStatus: "rejected" } : prev,
      );
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menolak pembayaran");
    } finally {
      setProcessingId("");
    }
  };

  return (
    <AdminLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section variants={pageMotion}>
          <SectionHeader
            label="Reservations"
            title="Reservation monitoring and operational control."
            description="Review every booking, payment state, and room assignment across the hotel system."
          />
        </motion.section>

        {error && (
          <motion.section variants={pageMotion}>
            <GlassCard className="p-4">
              <p className="text-sm text-rose-600">{error}</p>
            </GlassCard>
          </motion.section>
        )}

        <motion.section
          variants={pageMotion}
          className="grid gap-6 md:grid-cols-3"
        >
          {[
            ["Checked-in today", checkedInToday.length],
            ["Pending approval", pendingApproval.length],
            ["Cancelled total", cancelledReservations.length],
          ].map(([label, value]) => (
            <GlassCard key={label} className="p-4" hover={false}>
              <p className="text-xs uppercase tracking-[0.24em] text-muted">
                {label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-navy">{value}</p>
            </GlassCard>
          ))}
        </motion.section>

        <motion.section variants={pageMotion} className="grid gap-8">
          <GlassCard>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                  Reservation table
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-navy">
                  Booking statuses
                </h3>
              </div>
              <Badge tone="gold">Live data</Badge>
            </div>

            <div className="mt-5 overflow-x-auto rounded-[28px] border border-soft bg-white/70">
              <table className="min-w-220 w-full text-left text-sm">
                <thead className="bg-white/80 text-xs uppercase tracking-[0.2em] text-muted">
                  <tr>
                    <th className="px-4 py-3">Reservation</th>
                    <th className="px-4 py-3">Guest</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {reservations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-muted">
                        Belum ada reservasi.
                      </td>
                    </tr>
                  ) : (
                    reservations.map((reservation) => (
                      <tr
                        key={reservation.id}
                        className="border-t border-soft transition hover:bg-white/70"
                      >
                        <td className="px-4 py-4">
                          <p className="font-semibold text-navy">
                            {reservation.id}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {formatDateTime(reservation.checkIn)} →{" "}
                            {formatDateTime(reservation.checkOut)}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-muted">
                          <p className="font-semibold text-navy">
                            {reservation.guestName || "-"}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {reservation.guestEmail || "-"}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-muted">
                          {reservation.roomType} #{reservation.roomNumber}
                        </td>

                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            <Badge
                              tone={
                                paymentTone[reservation.paymentStatus] ||
                                "neutral"
                              }
                            >
                              {formatPayment(reservation.paymentStatus)}
                            </Badge>
                            <p className="text-xs text-muted">
                              {reservation.paymentMethod === "online"
                                ? "Pay Online"
                                : "Pay at Check-In"}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <Badge
                            tone={statusTone[reservation.status] || "neutral"}
                          >
                            {formatStatus(reservation.status)}
                          </Badge>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <button
                            onClick={() => setSelectedReservation(reservation)}
                            className="inline-flex items-center gap-2 rounded-full border border-soft bg-white px-3 py-2 text-xs font-semibold text-navy"
                          >
                            Details <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.section>

        {selectedReservation && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/25 p-4 backdrop-blur-sm">
            <div className="h-full w-full max-w-xl overflow-y-auto rounded-4xl border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
              <div className="flex items-start justify-between gap-4 border-b border-soft pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                    Booking detail drawer
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-navy">
                    {selectedReservation.id}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedReservation(null)}
                  className="rounded-full border border-soft bg-white p-2 text-navy"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-soft bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    Guest
                  </p>
                  <p className="mt-2 text-lg font-semibold text-navy">
                    {selectedReservation.guestName || "-"}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {selectedReservation.guestEmail || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-soft bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    Room
                  </p>
                  <p className="mt-2 text-lg font-semibold text-navy">
                    {selectedReservation.roomType} #
                    {selectedReservation.roomNumber}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Duration: {selectedReservation.durationHours} hours
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-soft bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">
                      Check-in
                    </p>
                    <p className="mt-2 font-semibold text-navy">
                      {formatDateTime(selectedReservation.checkIn)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-soft bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">
                      Check-out
                    </p>
                    <p className="mt-2 font-semibold text-navy">
                      {formatDateTime(selectedReservation.checkOut)}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-soft bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">
                    Payment
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge
                      tone={
                        paymentTone[selectedReservation.paymentStatus] ||
                        "neutral"
                      }
                    >
                      {formatPayment(selectedReservation.paymentStatus)}
                    </Badge>

                    <Badge tone="gold">
                      {selectedReservation.paymentMethod === "online"
                        ? "Pay Online"
                        : "Pay at Check-In"}
                    </Badge>
                  </div>

                  <p className="mt-3 text-lg font-semibold text-navy">
                    {formatCurrency(selectedReservation.totalPrice)}
                  </p>

                  {selectedReservation.hasPaymentProof && (
                    <p className="mt-2 text-sm text-muted">
                      Payment proof uploaded and waiting for review.
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    tone={statusTone[selectedReservation.status] || "neutral"}
                  >
                    {formatStatus(selectedReservation.status)}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {selectedReservation.paymentMethod === "online" &&
                  selectedReservation.paymentStatus !== "paid" &&
                  selectedReservation.hasPaymentProof && (
                    <>
                      <button
                        disabled={processingId === selectedReservation.id}
                        onClick={() =>
                          handleVerifyPayment(selectedReservation.id)
                        }
                        className="rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        Verify Payment
                      </button>

                      <button
                        disabled={processingId === selectedReservation.id}
                        onClick={() =>
                          handleRejectPayment(selectedReservation.id)
                        }
                        className="rounded-full border border-soft bg-white px-4 py-3 text-sm font-semibold text-rose-700 disabled:opacity-60"
                      >
                        Reject Payment
                      </button>
                    </>
                  )}

                {selectedReservation.status === "pending" &&
                  (selectedReservation.paymentMethod === "pay_at_checkin" ||
                    selectedReservation.paymentStatus === "paid") && (
                    <>
                      <button
                        disabled={processingId === selectedReservation.id}
                        onClick={() =>
                          handleUpdateStatus(
                            selectedReservation.id,
                            "confirmed",
                          )
                        }
                        className="rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        Confirm
                      </button>

                      <button
                        disabled={processingId === selectedReservation.id}
                        onClick={() =>
                          handleUpdateStatus(
                            selectedReservation.id,
                            "cancelled",
                          )
                        }
                        className="rounded-full border border-soft bg-white px-4 py-3 text-sm font-semibold text-rose-700 disabled:opacity-60"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                {selectedReservation.status === "confirmed" && (
                  <button
                    disabled={processingId === selectedReservation.id}
                    onClick={() =>
                      handleUpdateStatus(selectedReservation.id, "checked_in")
                    }
                    className="rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    Check in
                  </button>
                )}

                {selectedReservation.status === "checked_in" && (
                  <button
                    disabled={processingId === selectedReservation.id}
                    onClick={() =>
                      handleUpdateStatus(selectedReservation.id, "completed")
                    }
                    className="rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    Check out
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default Reservation;
