import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CircleDollarSign,
  CreditCard,
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
import DateTimePicker from "../../components/ui/DateTimePicker";
import { useAuth } from "../../context/AuthContext";
import { createReservation } from "../../services/reservationService";
import { getRoomAvailabilityByType } from "../../services/roomService";

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
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availability, setAvailability] = useState(null);
  const [error, setError] = useState("");

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    // Jika ada menit, round up ke jam berikutnya
    const nextHour = now.getMinutes() > 0 ? now.getHours() + 1 : now.getHours();
    const nextHourFormatted = String(nextHour).padStart(2, "0");

    // Format: YYYY-MM-DDTHH:00
    return `${year}-${month}-${date}T${nextHourFormatted}:00`;
  };

  const getMinCheckOutDateTime = () => {
    if (!checkIn) return "";

    const checkInDate = new Date(checkIn);
    return new Date(checkInDate.getTime() + 3 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);
  };

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

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!room?.roomType || !checkIn || !checkOut) {
        setAvailability(null);
        return;
      }

      try {
        setAvailabilityLoading(true);
        const data = await getRoomAvailabilityByType(
          room.roomType,
          checkIn,
          checkOut,
        );

        setAvailability(data);
      } catch (err) {
        setAvailability(null);
        console.error(err);
      } finally {
        setAvailabilityLoading(false);
      }
    };

    fetchAvailability();
  }, [room?.roomType, checkIn, checkOut]);

  const isRangeAvailable = availability?.isAvailable ?? true;
  const canReserve =
    !!checkIn && !!checkOut && !availabilityLoading && isRangeAvailable;

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
          className="max-w-3xl mx-auto w-full"
        >
          <GlassCard className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                  {room.roomName}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                  Book your stay
                </h3>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                  Rate per hour
                </p>
                <p className="text-2xl font-semibold text-(--champagne)">
                  {formatCurrency(room.startingPrice)}
                </p>
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="relative z-10 space-y-4">
              <h4 className="text-sm font-semibold text-(--navy) mb-4">
                Select your dates and times
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <DateTimePicker
                  value={checkIn}
                  onChange={setCheckIn}
                  label="Check-in"
                  placeholder="Select date and time"
                  minDateTime={getCurrentDateTime()}
                  type="checkin"
                />

                <DateTimePicker
                  value={checkOut}
                  onChange={setCheckOut}
                  label="Check-out"
                  placeholder="Select date and time"
                  minDateTime={getMinCheckOutDateTime()}
                  type="checkout"
                />
              </div>
            </div>

            {/* Duration Info */}
            {checkIn && checkOut && (
              <div className="mt-6 rounded-2xl border border-(--champagne) bg-[rgba(212,175,55,0.08)] p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                      Duration
                    </p>
                    <p className="mt-2 text-xl font-semibold text-(--navy)">
                      {durationHours}h
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                      Subtotal
                    </p>
                    <p className="mt-2 text-xl font-semibold text-(--navy)">
                      {formatCurrency(subtotal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                      Service charge
                    </p>
                    <p className="mt-2 text-xl font-semibold text-(--navy)">
                      {formatCurrency(serviceCharge)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t border-(--champagne) pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-(--muted)">
                      Total amount
                    </span>
                    <span className="text-2xl font-semibold text-(--champagne)">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {checkIn && checkOut && (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                  availabilityLoading
                    ? "border-(--border-soft) bg-white/70 text-(--muted)"
                    : isRangeAvailable
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {availabilityLoading
                  ? "Checking room availability for your selected time..."
                  : isRangeAvailable
                    ? `Available: ${availability?.availableUnits || 0} of ${availability?.totalUnits || 0} rooms are free for this time range.`
                    : "No rooms are available for this time range."}
              </div>
            )}

            {/* Payment Method */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-(--navy) mb-3">
                Choose payment method
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
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

            {/* Reserve Button */}
            <button
              onClick={handleReserve}
              disabled={loading || !canReserve}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-(--champagne) px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(212,175,55,0.24)] transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating reservation..."
                : checkIn && checkOut && availabilityLoading
                  ? "Checking availability..."
                  : !isRangeAvailable && checkIn && checkOut
                    ? "No rooms available"
                    : "Confirm & Reserve"}
              <TimerReset className="h-4 w-4" />
            </button>
          </GlassCard>
        </motion.section>
      </motion.div>
    </UserLayout>
  );
};

export default Reservation;
