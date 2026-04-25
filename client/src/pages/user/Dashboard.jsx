import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  MessageSquareText,
  ReceiptText,
  Search,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import UserLayout from "../../layouts/UserLayout";
import {
  Badge,
  GlassCard,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { getMyReservations } from "../../services/reservationService";
import { getMyTickets } from "../../services/ticketService";

const statusTone = {
  pending: "warning",
  confirmed: "success",
  checked_in: "navy",
  completed: "gold",
  cancelled: "danger",
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

const Dashboard = () => {
  const { authUser, token } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const guestName = authUser?.name || "Guest";

  const initials = guestName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [reservationData, ticketData] = await Promise.all([
          getMyReservations(token),
          getMyTickets(token),
        ]);

        if (!isMounted) return;

        setReservations(reservationData.reservations || []);
        setTickets(ticketData.tickets || []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  const activeReservations = useMemo(() => {
    return reservations.filter((item) =>
      ["pending", "confirmed", "checked_in"].includes(item.status),
    );
  }, [reservations]);

  const pendingReservations = useMemo(() => {
    return reservations.filter((item) => item.status === "pending");
  }, [reservations]);

  const openTickets = useMemo(() => {
    return tickets.filter((item) => item.status !== "closed");
  }, [tickets]);

  const dashboardSummary = [
    {
      label: "Active Reservations",
      value: activeReservations.length,
      detail: "Pending, confirmed, or checked-in bookings.",
    },
    {
      label: "Pending Reservations",
      value: pendingReservations.length,
      detail: "Waiting for staff confirmation.",
    },
    {
      label: "Support Tickets",
      value: openTickets.length,
      detail: "Reservation-linked support channels.",
    },
  ];

  const dashboardActions = [
    {
      label: "Find Rooms",
      detail: "Browse available room types and start a new reservation.",
      to: "/user/rooms",
      icon: Search,
    },
    {
      label: "My Reservations",
      detail: "Track booking status, payment, and assigned room number.",
      to: "/user/my-reservations",
      icon: ReceiptText,
    },
    {
      label: "Support Tickets",
      detail: "Open your reservation-based chat with hotel staff.",
      to: "/user/tickets",
      icon: MessageSquareText,
    },
  ];

  const recentTimeline = reservations.slice(0, 3);

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
          <GlassCard className="overflow-hidden p-6">
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="flex items-start justify-between gap-4">
                <div className="max-w-xl">
                  <Badge tone="gold">Welcome back</Badge>

                  <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[0.95] text-(--navy) sm:text-5xl">
                    Welcome back, {guestName}
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-(--muted) sm:text-base">
                    Manage your reservations, payment status, and support
                    tickets from one calm premium dashboard.
                  </p>
                </div>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-(--border-soft) bg-white/70 text-lg font-semibold text-(--navy)">
                  {initials || "GU"}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {dashboardSummary.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.5rem] border border-(--border-soft) bg-white/70 p-4"
                  >
                    <p className="text-[11px] uppercase tracking-[0.24em] text-(--muted)">
                      {item.label}
                    </p>

                    <p className="mt-3 text-3xl font-semibold text-(--navy)">
                      {loading ? "..." : item.value}
                    </p>

                    <p className="mt-2 text-xs leading-6 text-(--muted)">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section variants={pageMotion}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                Quick actions
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-(--navy)">
                Move through the booking flow
              </h2>
            </div>

            <Badge tone="gold">Fast access</Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {dashboardActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link key={action.label} to={action.to}>
                  <GlassCard className="h-full p-5 transition hover:-translate-y-1">
                    <div className="flex h-full flex-col justify-between gap-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(212,175,55,0.12)] text-(--champagne)">
                          <Icon className="h-5 w-5" />
                        </div>

                        <ArrowUpRight className="h-5 w-5 text-(--muted)" />
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-(--navy)">
                          {action.label}
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-(--muted)">
                          {action.detail}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </motion.section>

        <motion.section variants={pageMotion} className="grid gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                  Recent reservation status
                </p>

                <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                  Timeline overview
                </h3>
              </div>

              <CalendarDays className="h-5 w-5 text-(--champagne)" />
            </div>

            <div className="mt-6 space-y-3">
              {loading ? (
                <p className="text-sm text-(--muted)">Loading timeline...</p>
              ) : recentTimeline.length === 0 ? (
                <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                  <div className="flex items-center gap-3">
                    <BedDouble className="h-5 w-5 text-(--champagne)" />

                    <p className="text-sm font-semibold text-(--navy)">
                      No reservations yet.
                    </p>
                  </div>

                  <p className="mt-2 text-sm text-(--muted)">
                    Start by browsing available rooms.
                  </p>
                </div>
              ) : (
                recentTimeline.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-(--border-soft) bg-white/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                          {item.room}
                        </p>

                        <p className="mt-2 text-sm font-semibold text-(--navy)">
                          Room #{item.roomNumber} · {item.schedule}
                        </p>
                      </div>

                      <Badge tone={statusTone[item.status] || "neutral"}>
                        {formatStatusLabel(item.status)}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.section>
      </motion.div>
    </UserLayout>
  );
};

export default Dashboard;
