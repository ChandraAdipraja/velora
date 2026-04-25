import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import UserLayout from "../../layouts/UserLayout";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

import {
  getReservationDetail,
  uploadPaymentProofFile,
} from "../../services/reservationService";

const formatCurrency = (value) =>
  `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const formatDateTime = (value) =>
  new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const normalizePaymentReservation = (reservation) => ({
  id: reservation.id || reservation._id,
  roomType: reservation.roomType || reservation.room?.roomType || "-",
  roomNumber: reservation.roomNumber || reservation.room?.roomNumber || "-",
  checkIn: reservation.checkIn,
  checkOut: reservation.checkOut,
  durationHours: reservation.durationHours,
  totalPrice: reservation.totalPrice || 0,
  paymentMethod: reservation.paymentMethod,
  paymentStatus: reservation.paymentStatus,
});

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [reservation, setReservation] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchReservation = async () => {
    try {
      setError("");

      const data = await getReservationDetail(id, token);

      setReservation(normalizePaymentReservation(data.reservation));
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil data pembayaran",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchReservation();
    }
  }, [token]);

  const handleSelectFile = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Pilih bukti transfer terlebih dahulu");
      return;
    }

    try {
      setUploading(true);
      setError("");

      await uploadPaymentProofFile(reservation.id, selectedFile, token);

      setSuccess("Bukti pembayaran berhasil dikirim");
      await fetchReservation();
    } catch (err) {
      setError(err.response?.data?.message || "Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <p>Loading payment...</p>
      </UserLayout>
    );
  }

  if (!reservation) {
    return (
      <UserLayout>
        <p>Reservation not found.</p>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{
          animate: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        className="space-y-8"
      >
        <motion.section variants={pageMotion}>
          <SectionHeader
            label="Online Payment"
            title="Complete your reservation payment"
            description="Transfer payment and upload your proof for verification."
          />
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <GlassCard className="p-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-champagne">
                Payment summary
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-navy">
                Reservation invoice
              </h3>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-soft bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">
                  Reservation ID
                </p>
                <p className="mt-2 font-semibold text-navy">{reservation.id}</p>
              </div>

              <div className="rounded-2xl border border-soft bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">
                  Payment Status
                </p>

                <Badge
                  tone={
                    reservation.paymentStatus === "paid"
                      ? "success"
                      : reservation.paymentStatus === "pending"
                        ? "warning"
                        : "danger"
                  }
                  className="mt-3"
                >
                  {reservation.paymentStatus}
                </Badge>
              </div>

              <div className="rounded-2xl border border-soft bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">
                  Room
                </p>

                <p className="mt-2 font-semibold text-navy">
                  {reservation.roomType} #{reservation.roomNumber}
                </p>
              </div>

              <div className="rounded-2xl border border-soft bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">
                  Duration
                </p>

                <p className="mt-2 font-semibold text-navy">
                  {reservation.durationHours} Hours
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-soft bg-white/70 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">
                Schedule
              </p>

              <p className="mt-3 text-sm text-navy">
                {formatDateTime(reservation.checkIn)}
              </p>

              <p className="text-sm text-navy">
                to {formatDateTime(reservation.checkOut)}
              </p>

              <p className="mt-5 text-3xl font-semibold text-navy">
                {formatCurrency(reservation.totalPrice)}
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-champagne">
                Transfer instruction
              </p>

              <h3 className="mt-2 text-2xl font-semibold text-navy">
                Pay and upload proof
              </h3>
            </div>

            <div className="mt-6 rounded-3xl border border-soft bg-white/70 p-5">
              <p className="text-sm text-muted">Transfer to:</p>

              <p className="mt-3 text-lg font-semibold text-navy">Bank BCA</p>

              <p className="text-xl font-semibold text-champagne">1234567890</p>

              <p className="mt-2 text-sm text-muted">PT Velora Hospitality</p>
            </div>

            {reservation.paymentStatus === "pending" ? (
              <div className="mt-6 rounded-3xl border border-soft bg-white/70 p-6 text-center">
                <p className="text-xl font-semibold text-navy">
                  Payment proof submitted
                </p>

                <p className="mt-2 text-sm text-muted">
                  Waiting for admin verification.
                </p>

                <button
                  onClick={() => navigate("/user/my-reservations")}
                  className="mt-5 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white"
                >
                  Back to My Reservations
                </button>
              </div>
            ) : (
              <>
                <div className="mt-6">
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.22em] text-muted">
                      Upload payment proof
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelectFile}
                      className="mt-3 block w-full rounded-2xl border border-soft bg-white p-3"
                    />
                  </label>

                  {preview && (
                    <div className="mt-5 overflow-hidden rounded-3xl border border-soft">
                      <img
                        src={preview}
                        alt="preview"
                        className="w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {success && (
                  <div className="mt-4 rounded-2xl bg-green-50 p-4 text-green-700">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="mt-4 rounded-2xl bg-red-50 p-4 text-red-600">
                    {error}
                  </div>
                )}

                <button
                  disabled={uploading}
                  onClick={handleUpload}
                  className="mt-6 w-full rounded-full bg-navy px-5 py-4 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Submit Payment Proof"}
                </button>
              </>
            )}
          </GlassCard>
        </motion.section>
      </motion.div>
    </UserLayout>
  );
};

export default Payment;
