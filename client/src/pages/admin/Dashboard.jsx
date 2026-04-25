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
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import {
  adminNavSummary,
  notifications,
  occupancyChart,
  recentReservations,
  roomStatusOverview,
} from "../../data/adminData";

const statusTone = {
  Confirmed: "success",
  "Awaiting payment": "warning",
  "Check-in today": "gold",
  Cancelled: "danger",
};

const Dashboard = () => {
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
            value="1,284"
            detail="Across active stay windows"
            icon={CalendarRange}
            trend="+12.4% this month"
          />
          <MetricCard
            label="Active guests"
            value="248"
            detail="In-house and checked in"
            icon={UserRound}
            trend="+6.8% vs yesterday"
          />
          <MetricCard
            label="Available rooms"
            value="34"
            detail="12 rooms in hold status"
            icon={Warehouse}
            trend="12 rooms under review"
          />
          <MetricCard
            label="Revenue"
            value="Rp 4.8B"
            detail="Luxury rooms and F&B"
            icon={DollarSign}
            trend="+18.2% vs last month"
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
                  Weekly occupancy and revenue trend
                </h2>
              </div>
              <Badge tone="gold">Live sync</Badge>
            </div>
            <div className="mt-6 h-88 rounded-[28px] border border-soft bg-white/70 p-4 sm:h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={occupancyChart}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
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
                    name="Occupancy %"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#c8a86a"
                    fill="url(#revenueFill)"
                    strokeWidth={2.5}
                    name="Revenue (B)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="space-y-6 min-w-0">
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
                  "Create hold",
                  "Adjust price",
                  "Message guest",
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
              <Badge tone="navy">Today</Badge>
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
                          {reservation.guest}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {reservation.id}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {reservation.room}
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {reservation.stay}
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          tone={statusTone[reservation.status] || "neutral"}
                        >
                          {reservation.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-navy">
                        {reservation.amount}
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
          <GlassCard className="min-w-0 flex-1 h-full">
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

          <GlassCard className="min-w-0 flex-1 h-full">
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
            <div className="mt-5 grid gap-3 grid-cols-1 sm:grid-cols-2">
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
