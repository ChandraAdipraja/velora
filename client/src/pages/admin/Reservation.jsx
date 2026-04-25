import { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarRange,
  ChevronRight,
  Clock3,
  ScrollText,
  X,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { reservationRecords } from "../../data/adminData";

const toneByStatus = {
  Confirmed: "success",
  "Awaiting payment": "warning",
  "Check-in today": "gold",
  Cancelled: "danger",
};

const timeline = [
  { label: "Booking confirmed", value: "12 Apr 2026, 10:14" },
  { label: "Payment review", value: "12 Apr 2026, 10:18" },
  { label: "Guest requested late checkout", value: "12 Apr 2026, 10:22" },
  { label: "Concierge acknowledged", value: "12 Apr 2026, 10:25" },
];

const Reservation = () => {
  const [selectedReservation, setSelectedReservation] = useState(
    reservationRecords[0],
  );

  return (
    <AdminLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.section variants={pageMotion}>
          <SectionHeader label="Reservations" />
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 md:grid-cols-3"
        >
          {[
            ["Checked-in today", "19"],
            ["Pending approval", "08"],
            ["Cancelled this week", "04"],
          ].map(([label, value]) => (
            <GlassCard key={label} className="p-4" hover={false}>
              <p className="text-xs uppercase tracking-[0.24em] text-muted">
                {label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-navy">{value}</p>
            </GlassCard>
          ))}
        </motion.section>

        <motion.section variants={pageMotion} className="grid gap-8 mt-6">
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
              <Badge tone="gold">Today</Badge>
            </div>
            <div className="mt-5 overflow-hidden rounded-[28px] border border-soft bg-white/70">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/80 text-xs uppercase tracking-[0.2em] text-muted">
                  <tr>
                    <th className="px-4 py-3">Reservation</th>
                    <th className="px-4 py-3">Guest</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reservationRecords.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="border-t border-soft transition hover:bg-white/70"
                    >
                      <td className="px-4 py-4">
                        <p className="font-semibold text-navy">
                          {reservation.id}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {reservation.checkIn} → {reservation.checkOut}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {reservation.guest}
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {reservation.room}
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          tone={toneByStatus[reservation.status] || "neutral"}
                        >
                          {reservation.status}
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
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.section>

        {selectedReservation && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/25 p-4 backdrop-blur-sm">
            <div className="h-full w-full max-w-xl rounded-4xl border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
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
                    {selectedReservation.guest}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {selectedReservation.room}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-soft bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">
                      Check-in
                    </p>
                    <p className="mt-2 font-semibold text-navy">
                      {selectedReservation.checkIn}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-soft bg-white/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">
                      Check-out
                    </p>
                    <p className="mt-2 font-semibold text-navy">
                      {selectedReservation.checkOut}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    tone={toneByStatus[selectedReservation.status] || "neutral"}
                  >
                    {selectedReservation.status}
                  </Badge>
                  <Badge tone="gold">Guest note</Badge>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <button className="rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white">
                  Check in
                </button>
                <button className="rounded-full border border-soft bg-white px-4 py-3 text-sm font-semibold text-navy">
                  Check out
                </button>
                <button className="rounded-full border border-soft bg-white px-4 py-3 text-sm font-semibold text-rose-700">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default Reservation;
