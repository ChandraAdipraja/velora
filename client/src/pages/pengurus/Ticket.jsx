import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Headset, MessageSquareText, Ticket, UserRound } from "lucide-react";
import PengurusLayout from "../../layouts/PengurusLayout";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { useAuth } from "../../context/AuthContext";
import {
  getMyAssignedTickets,
  getOpenTickets,
  takeTicket,
} from "../../services/ticketService";
import { useNavigate } from "react-router-dom";

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
  const { token } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("open");
  const [openTickets, setOpenTickets] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    try {
      setError("");

      const [openData, assignedData] = await Promise.all([
        getOpenTickets(token),
        getMyAssignedTickets(token),
      ]);

      setOpenTickets(openData.tickets || []);
      setMyTickets(assignedData.tickets || []);
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

  const handleTakeTicket = async (ticketId) => {
    try {
      setProcessingId(ticketId);
      await takeTicket(ticketId, token);
      await fetchTickets();
      setTab("assigned");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil ticket");
    } finally {
      setProcessingId("");
    }
  };

  const currentTickets = useMemo(() => {
    return tab === "open" ? openTickets : myTickets;
  }, [tab, openTickets, myTickets]);

  return (
    <PengurusLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section variants={pageMotion}>
          <SectionHeader
            label="Support Tickets"
            title="Manage open queue and assigned support channels."
            description="Take ownership of guest support requests and continue service within reservation-based ticket workflows."
          />
        </motion.section>

        <motion.section variants={pageMotion}>
          <GlassCard className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setTab("open")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === "open"
                    ? "bg-(--navy) text-white"
                    : "border border-(--border-soft) bg-white/70 text-(--navy)"
                }`}
              >
                Open Queue ({openTickets.length})
              </button>

              <button
                type="button"
                onClick={() => setTab("assigned")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === "assigned"
                    ? "bg-(--navy) text-white"
                    : "border border-(--border-soft) bg-white/70 text-(--navy)"
                }`}
              >
                My Tickets ({myTickets.length})
              </button>
            </div>
          </GlassCard>
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
          ) : currentTickets.length === 0 ? (
            <GlassCard className="p-6">
              <p className="text-lg font-semibold text-(--navy)">
                No tickets found
              </p>
              <p className="mt-2 text-sm leading-7 text-(--muted)">
                {tab === "open"
                  ? "There are no open tickets waiting in the queue."
                  : "You have not taken any tickets yet."}
              </p>
            </GlassCard>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {currentTickets.map((ticket) => {
                const reservation = ticket.reservation;
                const room = reservation?.room;
                const guest = reservation?.user || ticket.user || null;

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
                          Guest
                        </p>
                        <p className="mt-2 font-semibold text-(--navy)">
                          {guest?.name || "-"}
                        </p>
                        <p className="mt-1 text-sm text-(--muted)">
                          {guest?.email || "-"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                          Room
                        </p>
                        <p className="mt-2 font-semibold text-(--navy)">
                          {room?.roomType || "-"} · #{room?.roomNumber || "-"}
                        </p>
                        <p className="mt-1 text-sm text-(--muted)">
                          Reservation linked
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                      <div className="flex items-center gap-2 text-sm text-(--muted)">
                        <Ticket className="h-4 w-4 text-(--champagne)" />
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

                    <div className="mt-4 rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                      <div className="flex items-center gap-2 text-sm text-(--muted)">
                        <UserRound className="h-4 w-4 text-(--champagne)" />
                        Ownership
                      </div>

                      <p className="mt-2 text-sm font-semibold text-(--navy)">
                        {ticket.assignedStaff
                          ? `Assigned to ${ticket.assignedStaff.name || "Staff"}`
                          : "Not assigned yet"}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {tab === "open" && !ticket.assignedStaff && (
                        <button
                          type="button"
                          disabled={processingId === ticket._id}
                          onClick={() => handleTakeTicket(ticket._id)}
                          className="inline-flex items-center gap-2 rounded-full bg-(--navy) px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          <Headset className="h-4 w-4" />
                          {processingId === ticket._id
                            ? "Taking..."
                            : "Take Ticket"}
                        </button>
                      )}

                      {tab === "assigned" && (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/pengurus/tickets/${ticket._id}`)
                          }
                          className="inline-flex items-center gap-2 rounded-full border border-(--border-soft) bg-white px-4 py-3 text-sm font-semibold text-(--navy)"
                        >
                          <MessageSquareText className="h-4 w-4" />
                          Open Chat
                        </button>
                      )}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </motion.section>
      </motion.div>
    </PengurusLayout>
  );
};

export default Tickets;
