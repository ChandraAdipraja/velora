import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Sparkles, Ticket, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import PengurusLayout from "../../layouts/PengurusLayout";
import {
  GlassCard,
  MetricCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { getAllReservationsForStaff } from "../../services/reservationService";
import {
  getMyAssignedTickets,
  getOpenTickets,
} from "../../services/ticketService";

const formatTime = (value) =>
  new Date(value).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

const Dashboard = () => {
  const { authUser, token } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [openTickets, setOpenTickets] = useState([]);
  const [myTickets, setMyTickets] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [reservationData, openTicketData, myTicketData] =
          await Promise.all([
            getAllReservationsForStaff(token),
            getOpenTickets(token),
            getMyAssignedTickets(token),
          ]);

        setReservations(reservationData.reservations || []);
        setOpenTickets(openTicketData.tickets || []);
        setMyTickets(myTicketData.tickets || []);
      } catch (error) {
        console.error("Failed to load pengurus dashboard:", error);
      }
    };

    if (token) fetchDashboard();
  }, [token]);

  const todayCheckIns = useMemo(() => {
    const today = new Date().toDateString();

    return reservations.filter((item) => {
      const checkInDate = new Date(item.checkIn).toDateString();
      return checkInDate === today && item.status === "confirmed";
    });
  }, [reservations]);

  const pendingReservations = useMemo(
    () => reservations.filter((item) => item.status === "pending"),
    [reservations],
  );

  const confirmedReservations = useMemo(
    () => reservations.filter((item) => item.status === "confirmed"),
    [reservations],
  );

  const quickCards = [
    [
      "Pending Reservations",
      pendingReservations.length,
      "Booking requests waiting for staff approval.",
    ],
    [
      "Open Ticket Queue",
      openTickets.length,
      "Support tickets waiting to be taken by staff.",
    ],
    [
      "My Assigned Tickets",
      myTickets.length,
      "Guest support tickets currently assigned to you.",
    ],
  ];

  return (
    <PengurusLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section variants={pageMotion} className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Check-In Today"
              value={todayCheckIns.length}
              detail="Confirmed guests arriving today"
              icon={CalendarDays}
            />

            <MetricCard
              label="Pending Reservations"
              value={pendingReservations.length}
              detail="Waiting for approval"
              icon={Sparkles}
            />

            <MetricCard
              label="Open Tickets"
              value={openTickets.length}
              detail="Available in support queue"
              icon={Ticket}
            />

            <MetricCard
              label="Shift Lead"
              value={authUser?.name || "Pengurus"}
              detail={authUser?.role || "pengurus"}
              icon={UserRound}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <GlassCard className="p-5 sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-(--muted)">
                Today check-in focus
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                Arrival coordination board
              </h3>

              <div className="mt-6 overflow-hidden rounded-[28px] border border-(--border-soft) bg-white/75">
                <div className="grid grid-cols-[1.1fr_0.8fr_1fr] gap-3 border-b border-(--border-soft) px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-(--muted)">
                  <span>Guest</span>
                  <span>Room</span>
                  <span>Notes</span>
                </div>

                <div className="divide-y divide-(--border-soft)">
                  {todayCheckIns.length === 0 ? (
                    <div className="px-4 py-4 text-sm text-(--muted)">
                      No confirmed check-ins for today.
                    </div>
                  ) : (
                    todayCheckIns.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-[1.1fr_0.8fr_1fr] gap-3 px-4 py-4 text-sm"
                      >
                        <p className="font-semibold text-(--navy)">
                          {item.guestName}
                        </p>
                        <p className="text-(--muted)">
                          {item.roomType} #{item.roomNumber}
                        </p>
                        <p className="text-(--muted)">
                          Check-in at {formatTime(item.checkIn)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5 sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-(--muted)">
                Shift priorities
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                Concierge operating notes
              </h3>

              <div className="mt-6 space-y-3">
                {quickCards.map(([label, value, detail]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-(--border-soft) bg-white/70 p-4"
                  >
                    <p className="text-[11px] uppercase tracking-[0.22em] text-(--muted)">
                      {label}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-(--navy)">
                      {value}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-(--muted)">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.section>
      </motion.div>
    </PengurusLayout>
  );
};

export default Dashboard;
