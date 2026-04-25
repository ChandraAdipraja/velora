import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CreditCard,
  DoorClosed,
  ReceiptText,
  TimerReset,
  UserRound,
} from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { useAuth } from "../../context/AuthContext";
import {
  getReservationDetail,
  uploadPaymentProof,
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

const formatPaymentLabel = (payment) => {
  const labels = {
    paid: "Paid",
    pending: "Pending",
    unpaid: "Unpaid",
    rejected: "Rejected",
  };
  return labels[payment] || payment;
};

const formatDateTime = (value) =>
  new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const Receipt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paymentProof, setPaymentProof] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const data = await getReservationDetail(id, token);
        setReceipt(data.reservation);
      } catch (err) {
        setError(
          err.response?.data?.message || "Gagal mengambil detail reservasi",
        );
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchReceipt();
    }
  }, [id, token]);

  const handleUploadProof = async () => {
    if (!paymentProof.trim()) {
      setUploadMessage("Bukti pembayaran wajib diisi.");
      return;
    }

    try {
      setUploading(true);
      setUploadMessage("");

      await uploadPaymentProof(
        receipt.id,
        {
          paymentProof,
        },
        token,
      );

      setUploadMessage(
        "Bukti pembayaran berhasil dikirim. Menunggu verifikasi.",
      );

      const refreshed = await getReservationDetail(receipt.id, token);
      setReceipt(refreshed.reservation);
      setPaymentProof("");
    } catch (err) {
      setUploadMessage(
        err.response?.data?.message || "Gagal mengunggah bukti pembayaran",
      );
    } finally {
      setUploading(false);
    }
  };

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
            label="Receipt"
            title="Reservation receipt and stay summary."
            description="Review your booking information, assigned room, and payment details."
          />
        </motion.section>

        {loading && (
          <motion.section variants={pageMotion}>
            <GlassCard className="p-6">
              <p className="text-sm text-(--muted)">Loading receipt...</p>
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

        {!loading && !error && receipt && (
          <motion.section
            variants={pageMotion}
            className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
          >
            <GlassCard className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                    Reservation receipt
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-(--navy)">
                    #{receipt.id}
                  </h2>
                </div>

                <div className="flex flex-col gap-2">
                  <Badge tone={statusTone[receipt.status] || "neutral"}>
                    {formatStatusLabel(receipt.status)}
                  </Badge>
                  <Badge tone={paymentTone[receipt.paymentStatus] || "neutral"}>
                    {formatPaymentLabel(receipt.paymentStatus)}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                  <div className="flex items-center gap-2 text-sm text-(--muted)">
                    <UserRound className="h-4 w-4 text-(--champagne)" />
                    Guest
                  </div>
                  <p className="mt-2 font-semibold text-(--navy)">
                    {receipt.userName}
                  </p>
                  <p className="mt-1 text-sm text-(--muted)">
                    {receipt.userEmail}
                  </p>
                </div>

                <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                  <div className="flex items-center gap-2 text-sm text-(--muted)">
                    <DoorClosed className="h-4 w-4 text-(--champagne)" />
                    Room
                  </div>
                  <p className="mt-2 font-semibold text-(--navy)">
                    {receipt.roomType} Room
                  </p>
                  <p className="mt-1 text-sm text-(--muted)">
                    Assigned room #{receipt.roomNumber}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                  <div className="flex items-center gap-2 text-sm text-(--muted)">
                    <CalendarDays className="h-4 w-4 text-(--champagne)" />
                    Check-in
                  </div>
                  <p className="mt-2 font-semibold text-(--navy)">
                    {formatDateTime(receipt.checkIn)}
                  </p>
                </div>

                <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                  <div className="flex items-center gap-2 text-sm text-(--muted)">
                    <CalendarDays className="h-4 w-4 text-(--champagne)" />
                    Check-out
                  </div>
                  <p className="mt-2 font-semibold text-(--navy)">
                    {formatDateTime(receipt.checkOut)}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                  <div className="flex items-center gap-2 text-sm text-(--muted)">
                    <TimerReset className="h-4 w-4 text-(--champagne)" />
                    Duration
                  </div>
                  <p className="mt-2 font-semibold text-(--navy)">
                    {receipt.durationHours} hours
                  </p>
                </div>

                <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                  <div className="flex items-center gap-2 text-sm text-(--muted)">
                    <CreditCard className="h-4 w-4 text-(--champagne)" />
                    Payment method
                  </div>
                  <p className="mt-2 font-semibold text-(--navy)">
                    {receipt.paymentMethod === "online"
                      ? "Pay Online"
                      : "Pay at Check-In"}
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 lg:sticky lg:top-6 lg:self-start">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                    Payment summary
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                    Total charge
                  </h3>
                </div>
                <ReceiptText className="h-5 w-5 text-(--champagne)" />
              </div>

              <div className="mt-6 rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-(--muted)">Reservation ID</span>
                  <span className="font-semibold text-(--navy)">
                    #{receipt.id}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-(--muted)">Payment status</span>
                  <Badge tone={paymentTone[receipt.paymentStatus] || "neutral"}>
                    {formatPaymentLabel(receipt.paymentStatus)}
                  </Badge>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-(--muted)">Reservation status</span>
                  <Badge tone={statusTone[receipt.status] || "neutral"}>
                    {formatStatusLabel(receipt.status)}
                  </Badge>
                </div>

                <div className="mt-5 border-t border-(--border-soft) pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-(--muted)">Total price</span>
                    <span className="text-2xl font-semibold text-(--navy)">
                      Rp {receipt.totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {receipt.paymentMethod === "online" &&
                receipt.paymentStatus !== "paid" && (
                  <div className="mt-6 rounded-3xl border border-(--border-soft) bg-white/70 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                      Payment proof
                    </p>

                    <h4 className="mt-2 text-lg font-semibold text-(--navy)">
                      Upload transfer proof
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-(--muted)">
                      Paste your proof image URL (temporary demo flow).
                    </p>

                    <input
                      value={paymentProof}
                      onChange={(e) => setPaymentProof(e.target.value)}
                      placeholder="https://..."
                      className="mt-4 w-full rounded-2xl border border-(--border-soft) bg-white px-4 py-3 text-sm outline-none focus:border-(--champagne)"
                    />

                    {uploadMessage && (
                      <div className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
                        {uploadMessage}
                      </div>
                    )}

                    <button
                      onClick={handleUploadProof}
                      disabled={uploading}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-(--champagne) px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {uploading ? "Submitting..." : "Submit Payment Proof"}
                    </button>
                  </div>
                )}

              {receipt.paymentMethod === "online" &&
                receipt.paymentStatus === "paid" && (
                  <div className="mt-6 rounded-2xl bg-green-50 px-4 py-4 text-sm text-green-700">
                    Payment verified successfully.
                  </div>
                )}

              <button
                type="button"
                onClick={() => navigate("/user/my-reservations")}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-(--navy) px-4 py-3 text-sm font-semibold text-white"
              >
                Back to reservations
              </button>
            </GlassCard>
          </motion.section>
        )}
      </motion.div>
    </UserLayout>
  );
};

export default Receipt;
