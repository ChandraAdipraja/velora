import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CircleDollarSign,
  CreditCard,
  MapPin,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { useAuth } from "../../context/AuthContext";
import { createReservation } from "../../services/reservationService";

const formatCurrency = (value) => `Rp ${value.toLocaleString("id-ID")}`;

const Reservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();

  const room = location.state?.room;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const durationHours = useMemo(() => {
    if (!checkIn || !checkOut) return 3;

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const hours = Math.max(0, Math.ceil((end - start) / (1000 * 60 * 60)));

    return Math.max(3, hours || 3);
  }, [checkIn, checkOut]);

  const subtotal = durationHours * (room?.startingPrice || 0);
  const serviceCharge = Math.round(subtotal * 0.08);
  const total = subtotal + serviceCharge;

  const paymentOptions = [
    {
      id: "online",
      label: "Pay Online",
      note: "Pay now and upload your proof of payment for verification.",
    },
    {
      id: "pay_at_checkin",
      label: "Pay at Check-In",
      note: "Pay directly at the hotel when you arrive.",
    },
  ];

  const handleReserve = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await createReservation(
        {
          roomType: room.roomType,
          checkIn,
          checkOut,
          paymentMethod,
        },
        token,
      );

      if (paymentMethod === "online") {
        navigate(`/user/payment/${result.reservation._id}`, {
          state: { reservation: result },
        });
      } else {
        navigate("/user/my-reservations");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create reservation");
    } finally {
      setLoading(false);
    }
  };

  if (!room) {
    return (
      <UserLayout>
        <div className="p-6 text-sm text-(--muted)">No room data found.</div>
      </UserLayout>
    );
  }

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
            label="Booking"
            title="Reserve your stay with clear pricing and a low-friction form."
            description="The form keeps the booking flow concise on mobile and readable on desktop, with a sticky summary for confirmation."
          />
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]"
        >
          <GlassCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                  Booking form
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                  Hourly reservation details
                </h3>
              </div>
              <Badge tone="gold">Minimum 3 hours</Badge>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">
                  Check-in datetime
                </span>
                <input
                  type="datetime-local"
                  value={checkIn}
                  onChange={(event) => setCheckIn(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-(--border-soft) bg-white/80 px-4 py-3 text-sm outline-none focus:border-(--champagne)"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">
                  Check-out datetime
                </span>
                <input
                  type="datetime-local"
                  value={checkOut}
                  onChange={(event) => setCheckOut(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-(--border-soft) bg-white/80 px-4 py-3 text-sm outline-none focus:border-(--champagne)"
                />
              </label>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                  Duration
                </p>
                <p className="mt-2 text-2xl font-semibold text-(--navy)">
                  {durationHours} hours
                </p>
                <p className="mt-1 text-sm text-(--muted)">
                  Auto-calculated with a 3-hour minimum.
                </p>
              </div>

              <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                  Selected room
                </p>
                <p className="mt-2 text-2xl font-semibold text-(--navy)">
                  {room.roomName}
                </p>
                <p className="mt-1 text-sm text-(--muted)">
                  {formatCurrency(room.startingPrice)} / hour
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--muted)">
                Payment method
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {paymentOptions.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      paymentMethod === method.id
                        ? "border-(--champagne) bg-[rgba(212,175,55,0.12)]"
                        : "border-(--border-soft) bg-white/70 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-(--navy)">
                        {method.label}
                      </span>
                      <CreditCard className="h-4 w-4 text-(--champagne)" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-(--muted)">
                      {method.note}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                  Arrival summary
                </p>
                <p className="mt-2 font-semibold text-(--navy)">
                  {room.roomName}
                </p>
                <p className="mt-1 text-sm text-(--muted)">
                  {room.availableUnits} rooms available
                </p>
              </div>

              <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                  Location
                </p>
                <p className="mt-2 flex items-center gap-2 font-semibold text-(--navy)">
                  <MapPin className="h-4 w-4 text-(--champagne)" />
                  Sky tower, premium floor
                </p>
              </div>
            </div>
          </GlassCard>

          <div className="space-y-6">
            <GlassCard className="p-6 lg:sticky lg:top-6 lg:self-start">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                    Price breakdown
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                    Reservation summary
                  </h3>
                </div>
                <CircleDollarSign className="h-5 w-5 text-(--champagne)" />
              </div>

              <div className="mt-6 space-y-3">
                {[
                  [
                    "Room rate",
                    `${formatCurrency(room.startingPrice)} × ${durationHours} hours`,
                  ],
                  ["Subtotal", formatCurrency(subtotal)],
                  ["Service charge", formatCurrency(serviceCharge)],
                  ["Total", formatCurrency(total)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-(--border-soft) bg-white/70 px-4 py-3 text-sm"
                  >
                    <span className="text-(--muted)">{label}</span>
                    <span className="font-semibold text-(--navy)">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Badge tone="success">
                  <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                  Secure payment
                </Badge>
                <Badge tone="gold">
                  <Sparkles className="mr-2 h-3.5 w-3.5" />
                  Luxury checkout
                </Badge>
              </div>

              <button
                onClick={handleReserve}
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-(--champagne) px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(212,175,55,0.24)] transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {loading ? "Creating reservation..." : "Reserve room"}
                <TimerReset className="h-4 w-4" />
              </button>
            </GlassCard>
          </div>
        </motion.section>
      </motion.div>
    </UserLayout>
  );
};

export default Reservation;
