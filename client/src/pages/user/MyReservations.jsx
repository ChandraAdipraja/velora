import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CalendarDays, MessageSquareText, ReceiptText } from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { useAuth } from "../../context/AuthContext";
import { getMyReservations } from "../../services/reservationService";

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

const formatPaymentLabel = (payment) => {
  const labels = {
    paid: "Paid",
    pending: "Pending",
    unpaid: "Unpaid",
    rejected: "Rejected",
  };

  return labels[payment] || payment;
};

const MyReservations = () => {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getMyReservations(token);
        setReservations(data.reservations || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Gagal mengambil data reservasi",
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchReservations();
    }
  }, [token]);

  return (
    <UserLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section variants={pageMotion}>
          <SectionHeader
            label="Reservations"
            title="A calm archive of every booking, room number, and payment state."
            description="Review each stay at a glance and jump straight into chat when you need support."
          />
        </motion.section>

        {loading && (
          <motion.section variants={pageMotion}>
            <GlassCard className="p-6">
              <p className="text-sm text-(--muted)">Loading reservations...</p>
            </GlassCard>
          </motion.section>
        )}

        {error && (
          <motion.section variants={pageMotion}>
            <GlassCard className="p-6">
              <p className="text-sm text-red-500">{error}</p>
            </GlassCard>
          </motion.section>
        )}

        {!loading && !error && reservations.length === 0 && (
          <motion.section variants={pageMotion}>
            <GlassCard className="p-6">
              <p className="text-lg font-semibold text-(--navy)">
                No reservations yet
              </p>
              <p className="mt-2 text-sm leading-7 text-(--muted)">
                Your reservation history will appear here after you successfully
                create a booking.
              </p>
            </GlassCard>
          </motion.section>
        )}

        {!loading && !error && reservations.length > 0 && (
          <motion.section
            variants={pageMotion}
            className="grid gap-6 lg:grid-cols-2"
          >
            {reservations.map((booking) => (
              <GlassCard key={booking.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                      Room booked
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                      {booking.room}
                    </h3>
                  </div>

                  <Badge tone={statusTone[booking.status] || "neutral"}>
                    {formatStatusLabel(booking.status)}
                  </Badge>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                      Assigned room number
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-(--navy)">
                      #{booking.roomNumber}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                      Payment status
                    </p>
                    <Badge
                      tone={paymentTone[booking.payment] || "neutral"}
                      className="mt-3"
                    >
                      {formatPaymentLabel(booking.payment)}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                  <div className="flex items-center gap-2 text-sm text-(--muted)">
                    <CalendarDays className="h-4 w-4 text-(--champagne)" />
                    Booking schedule
                  </div>
                  <p className="mt-2 text-base font-semibold text-(--navy)">
                    {booking.schedule}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-(--muted)">Payment method</span>
                    <span className="font-semibold text-(--navy)">
                      {booking.paymentMethod === "online"
                        ? "Pay Online"
                        : "Pay at Check-In"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-(--muted)">Total price</span>
                    <span className="font-semibold text-(--navy)">
                      Rp {booking.totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/user/tickets" className="inline-flex">
                    <button className="inline-flex items-center gap-2 rounded-full bg-(--navy) px-4 py-3 text-sm font-semibold text-white">
                      <MessageSquareText className="h-4 w-4" />
                      Open chat
                    </button>
                  </Link>

                  <Link
                    to={`/user/receipt/${booking.id}`}
                    className="inline-flex"
                  >
                    <button className="inline-flex items-center gap-2 rounded-full border border-(--border-soft) bg-white/70 px-4 py-3 text-sm font-semibold text-(--navy)">
                      <ReceiptText className="h-4 w-4 text-(--champagne)" />
                      View receipt
                    </button>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </motion.section>
        )}
      </motion.div>
    </UserLayout>
  );
};

export default MyReservations;
