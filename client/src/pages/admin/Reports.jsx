import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Download,
  FileBarChart2,
  Filter,
  Percent,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
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
  financialSummary,
  paymentMethods,
  revenueSeries,
  transactionRows,
} from "../../data/adminData";

const COLORS = ["#12213d", "#c8a86a", "#d8c09a"];

const Reports = () => {
  return (
    <AdminLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section variants={pageMotion}>
          <SectionHeader
            label="Transaction reports"
            title="Revenue and financial reporting for hospitality operations."
            description="Date filters, export actions, and summary cards keep the report surface high-end and usable."
          />
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          <MetricCard
            label="Gross revenue"
            value="Rp 4.8B"
            detail="Luxury stays and services"
            icon={WalletCards}
            trend="+18.2%"
          />
          <MetricCard
            label="Net revenue"
            value="Rp 3.9B"
            detail="After refunds and promos"
            icon={TrendingUp}
            trend="+15.1%"
          />
          <MetricCard
            label="Occupancy"
            value="88%"
            detail="Weekend demand remains high"
            icon={Percent}
            trend="+4.1%"
          />
          <MetricCard
            label="Avg ticket"
            value="Rp 2.6M"
            detail="Room and ancillary spend"
            icon={FileBarChart2}
            trend="+9.3%"
          />
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"
        >
          <GlassCard>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                  Revenue charts
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-navy">
                  Monthly revenue by room class
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-full border border-soft bg-white px-4 py-2 text-sm font-semibold text-navy">
                  <Filter className="mr-2 inline h-4 w-4" />
                  Date
                </button>
                <button className="rounded-full border border-soft bg-white px-4 py-2 text-sm font-semibold text-navy">
                  <Download className="mr-2 inline h-4 w-4" />
                  PDF
                </button>
                <button className="rounded-full border border-soft bg-white px-4 py-2 text-sm font-semibold text-navy">
                  <Download className="mr-2 inline h-4 w-4" />
                  Excel
                </button>
              </div>
            </div>

            <div className="mt-6 h-[22rem] rounded-[28px] border border-soft bg-white/70 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueSeries}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueSeriesFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#12213d"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor="#12213d"
                        stopOpacity={0.04}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eadfca" />
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
                    dataKey="revenue"
                    stroke="#12213d"
                    fill="url(#revenueSeriesFill)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <div className="space-y-6">
            <GlassCard>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                Financial summary
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {financialSummary.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-soft bg-white/70 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-muted">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-navy">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm text-champagne">{item.delta}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                    Payment mix
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-navy">
                    Transaction channel share
                  </h3>
                </div>
                <Badge tone="gold">Updated hourly</Badge>
              </div>
              <div className="mt-6 h-[18rem] rounded-[28px] border border-soft bg-white/70 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 18,
                        borderColor: "#e5d7bd",
                      }}
                    />
                    <Legend />
                    <Pie
                      data={paymentMethods}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={52}
                      outerRadius={82}
                      paddingAngle={4}
                    >
                      {paymentMethods.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </motion.section>

        <motion.section variants={pageMotion}>
          <GlassCard>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                  Transactions
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-navy">
                  Recent financial activity
                </h3>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white">
                <ArrowUpRight className="h-4 w-4" /> Export report
              </button>
            </div>
            <div className="mt-5 overflow-hidden rounded-[28px] border border-soft bg-white/70">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/80 text-xs uppercase tracking-[0.2em] text-muted">
                  <tr>
                    <th className="px-4 py-3">Transaction</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionRows.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-t border-soft transition hover:bg-white/70"
                    >
                      <td className="px-4 py-4 font-semibold text-navy">
                        {transaction.id}
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {transaction.room}
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {transaction.date}
                      </td>
                      <td className="px-4 py-4 font-semibold text-navy">
                        {transaction.amount}
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          tone={
                            transaction.status === "Paid"
                              ? "success"
                              : "warning"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.section>
      </motion.div>
    </AdminLayout>
  );
};

export default Reports;
