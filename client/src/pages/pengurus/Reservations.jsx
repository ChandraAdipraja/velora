import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarRange,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Search,
} from "lucide-react";
import PengurusLayout from "../../layouts/PengurusLayout";
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
  checked_in: "navy",
  completed: "gold",
  cancelled: "danger",
};

const paymentTone = {
  paid: "success",
  pending: "warning",
  unpaid: "warning",
  rejected: "danger",
};

const formatStatusLabel = (status) => {
  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    checked_in: "Checked-In",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

const formatPaymentLabel = (status) => {
  const labels = {
    paid: "Paid",
    pending: "Pending",
    unpaid: "Unpaid",
    rejected: "Rejected",
  };
  return labels[status] || status;
};

const formatDateTime = (value) =>
  new Date(value).toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });

const Reservations = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");

  const fetchReservations = async () => {
    try {
      setError("");
      const data = await getAllReservationsForStaff(token);
      setReservations(data.reservations || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data reservasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReservations();
    }
  }, [token]);

  const handleVerifyPayment = async (reservationId) => {
    try {
      setProcessingId(reservationId);
      await verifyPayment(reservationId, token);
      await fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal verifikasi pembayaran");
    } finally {
      setProcessingId("");
    }
  };

  const handleRejectPayment = async (reservationId) => {
    try {
      setProcessingId(reservationId);
      await rejectPayment(reservationId, token);
      await fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menolak pembayaran");
    } finally {
      setProcessingId("");
    }
  };

  const handleUpdateStatus = async (reservationId, status) => {
    try {
      setProcessingId(reservationId);
      await updateReservationStatus(reservationId, status, token);
      await fetchReservations();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memperbarui status");
    } finally {
      setProcessingId("");
    }
  };

  const pendingCount = useMemo(
    () => reservations.filter((item) => item.status === "pending").length,
    [reservations],
  );

  const confirmedCount = useMemo(
    () => reservations.filter((item) => item.status === "confirmed").length,
    [reservations],
  );

  const totalQueue = reservations.length;

  const goToTicketChat = (reservation) => {
    navigate("/pengurus/tickets", {
      state: {
        reservationId: reservation.id,
        guestName: reservation.guestName,
      },
    });
  };

  return (
    <PengurusLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section variants={pageMotion} className="space-y-6">
          <SectionHeader
            label="Reservation Desk"
            title="Reservation management for Pengurus team"
            description="Review pending bookings, track active stays, and coordinate check-in workflows from one page."
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <GlassCard className="p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-(--muted)">
                Pending
              </p>
              <p className="mt-2 text-3xl font-semibold text-(--navy)">
                {pendingCount}
              </p>
              <div className="mt-3 inline-flex rounded-full bg-[rgba(200,168,106,0.14)] p-2 text-(--champagne)">
                <Clock3 className="h-4 w-4" />
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-(--muted)">
                Confirmed
              </p>
              <p className="mt-2 text-3xl font-semibold text-(--navy)">
                {confirmedCount}
              </p>
              <div className="mt-3 inline-flex rounded-full bg-[rgba(18,33,61,0.12)] p-2 text-(--navy)">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-(--muted)">
                Total Queue
              </p>
              <p className="mt-2 text-3xl font-semibold text-(--navy)">
                {totalQueue}
              </p>
              <div className="mt-3 inline-flex rounded-full bg-[rgba(18,33,61,0.12)] p-2 text-(--navy)">
                <CalendarRange className="h-4 w-4" />
              </div>
            </GlassCard>
          </div>

          <GlassCard className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-(--border-soft) px-5 py-4 sm:px-6">
              <h3 className="text-xl font-semibold text-(--navy)">
                Reservations List
              </h3>
              <div className="inline-flex items-center gap-2 rounded-full border border-(--border-soft) bg-white/80 px-3 py-2 text-xs text-(--muted)">
                <Search className="h-3.5 w-3.5" />
                Live queue
              </div>
            </div>

            {loading ? (
              <div className="p-6 text-sm text-(--muted)">Loading...</div>
            ) : error ? (
              <div className="p-6 text-sm text-red-500">{error}</div>
            ) : reservations.length === 0 ? (
              <div className="p-6 text-sm text-(--muted)">
                Belum ada reservasi.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[1100px] w-full text-left text-sm">
                  <thead className="bg-white/80 text-xs uppercase tracking-[0.22em] text-(--muted)">
                    <tr>
                      <th className="px-4 py-3">Reservation</th>
                      <th className="px-4 py-3">Guest</th>
                      <th className="px-4 py-3">Room</th>
                      <th className="px-4 py-3">Stay</th>
                      <th className="px-4 py-3">Payment</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr
                        key={reservation.id}
                        className="border-t border-(--border-soft) bg-white/55"
                      >
                        <td className="px-4 py-4 font-semibold text-(--navy)">
                          {reservation.id}
                        </td>

                        <td className="px-4 py-4 text-(--navy)">
                          <p className="font-medium">{reservation.guestName}</p>
                          <p className="mt-1 text-xs text-(--muted)">
                            {reservation.guestEmail}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-(--muted)">
                          {reservation.roomType} · #{reservation.roomNumber}
                        </td>

                        <td className="px-4 py-4 text-(--muted)">
                          {formatDateTime(reservation.checkIn)} <br />
                          {formatDateTime(reservation.checkOut)}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-2">
                            <div className="text-xs text-(--muted)">
                              {reservation.paymentMethod === "online"
                                ? "Pay Online"
                                : "Pay at Check-In"}
                            </div>

                            <Badge
                              tone={
                                paymentTone[reservation.paymentStatus] ||
                                "neutral"
                              }
                            >
                              {formatPaymentLabel(reservation.paymentStatus)}
                            </Badge>

                            {reservation.hasPaymentProof && (
                              <a
                                href={`http://localhost:5000${reservation.paymentProof}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-(--champagne) underline"
                              >
                                View proof
                              </a>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <Badge
                            tone={statusTone[reservation.status] || "neutral"}
                          >
                            {formatStatusLabel(reservation.status)}
                          </Badge>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            {reservation.paymentMethod === "online" &&
                              reservation.paymentStatus !== "paid" &&
                              reservation.hasPaymentProof && (
                                <>
                                  <button
                                    type="button"
                                    disabled={processingId === reservation.id}
                                    onClick={() =>
                                      handleVerifyPayment(reservation.id)
                                    }
                                    className="rounded-full bg-(--navy) px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                                  >
                                    Verify Payment
                                  </button>

                                  <button
                                    type="button"
                                    disabled={processingId === reservation.id}
                                    onClick={() =>
                                      handleRejectPayment(reservation.id)
                                    }
                                    className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-60"
                                  >
                                    Reject Payment
                                  </button>
                                </>
                              )}

                            {reservation.status === "pending" &&
                              (reservation.paymentMethod === "pay_at_checkin" ||
                                reservation.paymentStatus === "paid") && (
                                <>
                                  <button
                                    type="button"
                                    disabled={processingId === reservation.id}
                                    onClick={() =>
                                      handleUpdateStatus(
                                        reservation.id,
                                        "confirmed",
                                      )
                                    }
                                    className="rounded-full bg-(--navy) px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                                  >
                                    Approve
                                  </button>

                                  <button
                                    type="button"
                                    disabled={processingId === reservation.id}
                                    onClick={() =>
                                      handleUpdateStatus(
                                        reservation.id,
                                        "cancelled",
                                      )
                                    }
                                    className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-60"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}

                            {reservation.status === "confirmed" && (
                              <button
                                type="button"
                                disabled={processingId === reservation.id}
                                onClick={() =>
                                  handleUpdateStatus(
                                    reservation.id,
                                    "checked_in",
                                  )
                                }
                                className="rounded-full border border-(--border-soft) bg-white px-3 py-2 text-xs font-semibold text-(--navy) disabled:opacity-60"
                              >
                                Check-In
                              </button>
                            )}

                            {reservation.status === "checked_in" && (
                              <button
                                type="button"
                                disabled={processingId === reservation.id}
                                onClick={() =>
                                  handleUpdateStatus(
                                    reservation.id,
                                    "completed",
                                  )
                                }
                                className="rounded-full border border-(--border-soft) bg-white px-3 py-2 text-xs font-semibold text-(--navy) disabled:opacity-60"
                              >
                                Check-Out
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => goToTicketChat(reservation)}
                              className="inline-flex items-center gap-2 rounded-full border border-(--border-soft) bg-white px-3 py-2 text-xs font-semibold text-(--navy)"
                            >
                              <MessageSquareText className="h-3.5 w-3.5" />
                              Go to Ticket Chat
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </motion.section>
      </motion.div>
    </PengurusLayout>
  );
};

export default Reservations;
