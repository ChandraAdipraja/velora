import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  BellRing,
  CalendarRange,
  Clock3,
  DollarSign,
  Sparkles,
  UserRound,
  Warehouse,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Badge,
  GlassCard,
  MetricCard,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { getAllReservationsForStaff } from "../../services/reservationService";
import { getAllRooms } from "../../services/roomService";
import {
  getOpenTickets,
  getMyAssignedTickets,
} from "../../services/ticketService";
import { useAuth } from "../../context/AuthContext";

const statusTone = {
  pending: "warning",
  confirmed: "success",
  checked_in: "gold",
  completed: "navy",
  cancelled: "danger",
};

const formatCurrency = (value) =>
  `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const formatStatus = (status) => {
  const labels = {
    pending: "Pending",
    confirmed: "Confirmed",
    checked_in: "Checked-In",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

const formatDateTime = (value) =>
  new Date(value).toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });

const getLastSevenDays = () => {
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    return {
      date,
      name: date.toLocaleDateString("id-ID", { weekday: "short" }),
    };
  });
};

const Dashboard = () => {
  const { token } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [openTickets, setOpenTickets] = useState([]);
  const [assignedTickets, setAssignedTickets] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [reservationData, roomData, openTicketData, assignedTicketData] =
          await Promise.all([
            getAllReservationsForStaff(token),
            getAllRooms(),
            getOpenTickets(token),
            getMyAssignedTickets(token),
          ]);

        setReservations(reservationData.reservations || []);
        setRooms(roomData.data?.rooms || []);
        setOpenTickets(openTicketData.tickets || []);
        setAssignedTickets(assignedTicketData.tickets || []);
      } catch (error) {
        console.error("Failed to load admin dashboard:", error);
      }
    };

    if (token) fetchDashboard();
  }, [token]);

  const totalBookings = reservations.length;

  const activeGuests = reservations.filter(
    (item) => item.status === "checked_in",
  ).length;

  const availableRooms = rooms.filter(
    (room) => room.status === "available",
  ).length;

  const maintenanceRooms = rooms.filter(
    (room) => room.status === "maintenance",
  ).length;

  const inactiveRooms = rooms.filter(
    (room) => room.status === "inactive",
  ).length;

  const paidRevenue = reservations
    .filter((item) => item.paymentStatus === "paid")
    .reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);

  const recentReservations = reservations.slice(0, 6);

  const occupancyChart = useMemo(() => {
    const days = getLastSevenDays();

    return days.map(({ date, name }) => {
      const dateKey = date.toDateString();

      const dayReservations = reservations.filter((item) => {
        const itemDate = new Date(item.checkIn).toDateString();
        return itemDate === dateKey;
      });

      const dayRevenue = dayReservations
        .filter((item) => item.paymentStatus === "paid")
        .reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);

      return {
        name,
        occupancy: dayReservations.length,
        revenue: Math.round(dayRevenue / 100000),
      };
    });
  }, [reservations]);

  const notifications = [
    {
      title: "Pending reservations",
      body: `${reservations.filter((item) => item.status === "pending").length} bookings need approval.`,
      tone: "warning",
    },
    {
      title: "Open ticket queue",
      body: `${openTickets.length} support tickets are waiting for ownership.`,
      tone: "gold",
    },
    {
      title: "Room maintenance",
      body: `${maintenanceRooms} rooms are currently under maintenance.`,
      tone: maintenanceRooms > 0 ? "danger" : "success",
    },
  ];

  const roomStatusOverview = [
    {
      label: "Available",
      value: availableRooms,
      tone: "success",
    },
    {
      label: "Maintenance",
      value: maintenanceRooms,
      tone: "warning",
    },
    {
      label: "Inactive",
      value: inactiveRooms,
      tone: "danger",
    },
    {
      label: "Total Rooms",
      value: rooms.length,
      tone: "navy",
    },
  ];

  const adminNavSummary = [
    {
      label: "Reservations",
      value: totalBookings,
      delta: "Live",
    },
    {
      label: "Open Tickets",
      value: openTickets.length,
      delta: "Queue",
    },
    {
      label: "Assigned Tickets",
      value: assignedTickets.length,
      delta: "Handled",
    },
    {
      label: "Paid Revenue",
      value: formatCurrency(paidRevenue),
      delta: "Paid",
    },
  ];

  return (
    <AdminLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section
          variants={pageMotion}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          <MetricCard
            label="Total bookings"
            value={totalBookings}
            detail="All reservation records"
            icon={CalendarRange}
            trend="Live database"
          />
          <MetricCard
            label="Active guests"
            value={activeGuests}
            detail="Currently checked-in guests"
            icon={UserRound}
            trend="Checked-in status"
          />
          <MetricCard
            label="Available rooms"
            value={availableRooms}
            detail={`${maintenanceRooms} rooms under maintenance`}
            icon={Warehouse}
            trend={`${rooms.length} total rooms`}
          />
          <MetricCard
            label="Revenue"
            value={formatCurrency(paidRevenue)}
            detail="Paid reservations only"
            icon={DollarSign}
            trend="Verified payments"
          />
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]"
        >
          <GlassCard className="min-w-0">
            <div className="flex flex-col gap-4 border-b border-soft pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                  Occupancy analytics
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-navy">
                  Weekly bookings and paid revenue trend
                </h2>
              </div>
              <Badge tone="gold">Live sync</Badge>
            </div>

            <div className="mt-6 h-88 rounded-[28px] border border-soft bg-white/70 p-4 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyChart}>
                  <defs>
                    <linearGradient
                      id="occupancyFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#12213d"
                        stopOpacity={0.28}
                      />
                      <stop
                        offset="95%"
                        stopColor="#12213d"
                        stopOpacity={0.03}
                      />
                    </linearGradient>
                    <linearGradient
                      id="revenueFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#c8a86a"
                        stopOpacity={0.42}
                      />
                      <stop
                        offset="95%"
                        stopColor="#c8a86a"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7dcc8" />
                  <XAxis
                    dataKey="name"
                    stroke="#7d8ba1"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#7d8ba1" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 18, borderColor: "#e5d7bd" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="occupancy"
                    stroke="#12213d"
                    fill="url(#occupancyFill)"
                    strokeWidth={3}
                    name="Bookings"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#c8a86a"
                    fill="url(#revenueFill)"
                    strokeWidth={2.5}
                    name="Revenue /100k"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="min-w-0 space-y-6">
            <GlassCard className="min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                    Alerts
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-navy">
                    Operational notifications
                  </h3>
                </div>
                <BellRing className="h-5 w-5 text-champagne" />
              </div>

              <div className="mt-5 space-y-3">
                {notifications.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-soft bg-white/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-navy">{item.title}</p>
                        <p className="mt-1 text-sm text-muted">{item.body}</p>
                      </div>
                      <Badge tone={item.tone}>{item.tone}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                    Quick actions
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-navy">
                    Admin shortcuts
                  </h3>
                </div>
                <Sparkles className="h-5 w-5 text-champagne" />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Manage rooms",
                  "Review reservations",
                  "View tickets",
                  "Export report",
                ].map((action) => (
                  <button
                    key={action}
                    className="rounded-full border border-soft bg-white/80 px-4 py-2 text-sm font-medium text-navy transition hover:bg-white"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.section>

        <motion.section variants={pageMotion} className="w-full">
          <GlassCard className="min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                  Recent reservations
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-navy">
                  Booking queue
                </h3>
              </div>
              <Badge tone="navy">Latest</Badge>
            </div>

            <div className="mt-5 overflow-x-auto rounded-[28px] border border-soft bg-white/70">
              <table className="min-w-180 w-full text-left text-sm">
                <thead className="bg-white/80 text-xs uppercase tracking-[0.22em] text-muted">
                  <tr>
                    <th className="px-4 py-3">Guest</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Stay</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="border-t border-soft transition hover:bg-white/70"
                    >
                      <td className="px-4 py-4">
                        <p className="font-semibold text-navy">
                          {reservation.guestName}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {reservation.id}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {reservation.roomType} #{reservation.roomNumber}
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {formatDateTime(reservation.checkIn)} -{" "}
                        {formatDateTime(reservation.checkOut)}
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          tone={statusTone[reservation.status] || "neutral"}
                        >
                          {formatStatus(reservation.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-navy">
                        {formatCurrency(reservation.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="flex flex-col gap-6 lg:flex-row"
        >
          <GlassCard className="min-w-0 h-full flex-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                  Room status
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-navy">
                  Inventory overview
                </h3>
              </div>
              <Clock3 className="h-5 w-5 text-champagne" />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {roomStatusOverview.map((room) => (
                <div
                  key={room.label}
                  className="rounded-2xl border border-soft bg-white/70 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">
                    {room.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-navy">
                    {room.value}
                  </p>
                  <Badge tone={room.tone} className="mt-3">
                    {room.label}
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="min-w-0 h-full flex-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                  System stats
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-navy">
                  Current admin pulse
                </h3>
              </div>
              <AlertCircle className="h-5 w-5 text-champagne" />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {adminNavSummary.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-soft bg-white/70 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-muted">
                    {stat.label}
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <p className="text-2xl font-semibold text-navy">
                      {stat.value}
                    </p>
                    <span className="text-xs font-semibold text-champagne">
                      {stat.delta}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.section>
      </motion.div>
    </AdminLayout>
  );
};

export default Dashboard;
