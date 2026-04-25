import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarDays,
  MessageSquareText,
  Ticket,
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
import { getMyTickets } from "../../services/ticketService";

const ticketTone = {
  open: "warning",
  assigned: "navy",
  closed: "gold",
};

const formatTicketStatus = (status) => {
  const labels = {
    open: "Open",
    assigned: "Assigned",
    closed: "Closed",
  };

  return labels[status] || status;
};

const formatDateTime = (value) =>
  new Date(value).toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });

const Tickets = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      setError("");
      const data = await getMyTickets(token);
      setTickets(data.tickets || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTickets();
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
            label="Support Tickets"
            title="Your reservation-based support channels."
            description="Open a ticket conversation to contact hotel staff regarding your booking and stay."
          />
        </motion.section>

        <motion.section variants={pageMotion}>
          {loading ? (
            <GlassCard className="p-6">
              <p className="text-sm text-(--muted)">Loading tickets...</p>
            </GlassCard>
          ) : error ? (
            <GlassCard className="p-6">
              <p className="text-sm text-red-500">{error}</p>
            </GlassCard>
          ) : tickets.length === 0 ? (
            <GlassCard className="p-6">
              <p className="text-lg font-semibold text-(--navy)">
                No support tickets yet
              </p>
              <p className="mt-2 text-sm leading-7 text-(--muted)">
                Your support channels will appear after you create a
                reservation.
              </p>
            </GlassCard>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {tickets.map((ticket) => {
                const reservation = ticket.reservation;
                const room = reservation?.room;

                return (
                  <GlassCard key={ticket._id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                          Ticket
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                          #{ticket._id}
                        </h3>
                      </div>

                      <Badge tone={ticketTone[ticket.status] || "neutral"}>
                        {formatTicketStatus(ticket.status)}
                      </Badge>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                          Room
                        </p>
                        <p className="mt-2 font-semibold text-(--navy)">
                          {room?.roomType || "-"} · #{room?.roomNumber || "-"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                          Assigned Staff
                        </p>
                        <p className="mt-2 font-semibold text-(--navy)">
                          {ticket.assignedStaff?.name || "Waiting for staff"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                      <div className="flex items-center gap-2 text-sm text-(--muted)">
                        <CalendarDays className="h-4 w-4 text-(--champagne)" />
                        Stay schedule
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-6 text-(--navy)">
                        {reservation?.checkIn
                          ? formatDateTime(reservation.checkIn)
                          : "-"}
                        <br />
                        {reservation?.checkOut
                          ? formatDateTime(reservation.checkOut)
                          : "-"}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/user/tickets/${ticket._id}`)}
                        className="inline-flex items-center gap-2 rounded-full bg-(--navy) px-4 py-3 text-sm font-semibold text-white"
                      >
                        <MessageSquareText className="h-4 w-4" />
                        Open Chat
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </motion.section>
      </motion.div>
    </UserLayout>
  );
};

export default Tickets;
