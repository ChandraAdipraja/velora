import * as XLSX from "xlsx";
import { X } from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Download,
  FileBarChart2,
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
import { useAuth } from "../../context/AuthContext";
import { getAllReservationsForStaff } from "../../services/reservationService";

const COLORS = ["#12213d", "#c8a86a", "#d8c09a"];

const paymentTone = {
  paid: "success",
  pending: "warning",
  unpaid: "warning",
  rejected: "danger",
};

const formatCurrency = (value) =>
  `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const formatDate = (value) =>
  new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getLastSevenDays = () => {
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));

    return {
      key: date.toDateString(),
      name: date.toLocaleDateString("id-ID", { weekday: "short" }),
    };
  });
};

const Reports = () => {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);

  const [exportFilter, setExportFilter] = useState({
    startDate: "",
    endDate: "",
    paymentStatus: "All",
    paymentMethod: "All",
    reservationStatus: "All",
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllReservationsForStaff(token);
        setReservations(data.reservations || []);
      } catch (error) {
        console.error("Failed to load reports:", error);
      }
    };

    if (token) fetchReports();
  }, [token]);

  const grossRevenue = useMemo(() => {
    return reservations.reduce(
      (sum, item) => sum + Number(item.totalPrice || 0),
      0,
    );
  }, [reservations]);

  const paidRevenue = useMemo(() => {
    return reservations
      .filter((item) => item.paymentStatus === "paid")
      .reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
  }, [reservations]);

  const pendingPayment = useMemo(() => {
    return reservations
      .filter((item) => ["pending", "unpaid"].includes(item.paymentStatus))
      .reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
  }, [reservations]);

  const avgTicket = useMemo(() => {
    if (reservations.length === 0) return 0;
    return grossRevenue / reservations.length;
  }, [grossRevenue, reservations.length]);

  const completedCount = reservations.filter(
    (item) => item.status === "completed",
  ).length;

  const occupancyRate =
    reservations.length > 0
      ? Math.round((completedCount / reservations.length) * 100)
      : 0;

  const revenueSeries = useMemo(() => {
    const days = getLastSevenDays();

    return days.map((day) => {
      const dayReservations = reservations.filter(
        (item) => new Date(item.checkIn).toDateString() === day.key,
      );

      const revenue = dayReservations
        .filter((item) => item.paymentStatus === "paid")
        .reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);

      return {
        name: day.name,
        revenue,
      };
    });
  }, [reservations]);

  const paymentMethods = useMemo(() => {
    const online = reservations.filter(
      (item) => item.paymentMethod === "online",
    ).length;

    const checkIn = reservations.filter(
      (item) => item.paymentMethod === "pay_at_checkin",
    ).length;

    return [
      { name: "Pay Online", value: online },
      { name: "Pay at Check-In", value: checkIn },
    ].filter((item) => item.value > 0);
  }, [reservations]);

  const financialSummary = [
    {
      label: "Paid revenue",
      value: formatCurrency(paidRevenue),
      delta: "Verified transactions",
    },
    {
      label: "Pending payment",
      value: formatCurrency(pendingPayment),
      delta: "Unpaid or waiting review",
    },
    {
      label: "Transactions",
      value: reservations.length,
      delta: "Total reservation records",
    },
    {
      label: "Completed stays",
      value: completedCount,
      delta: "Finished reservations",
    },
  ];

  const transactionRows = reservations.slice(0, 8);

  const filteredExportRows = useMemo(() => {
    return reservations.filter((item) => {
      const checkInDate = new Date(item.checkIn);

      const matchesStart =
        !exportFilter.startDate ||
        checkInDate >= new Date(exportFilter.startDate);

      const matchesEnd =
        !exportFilter.endDate || checkInDate <= new Date(exportFilter.endDate);

      const matchesPaymentStatus =
        exportFilter.paymentStatus === "All" ||
        item.paymentStatus === exportFilter.paymentStatus;

      const matchesPaymentMethod =
        exportFilter.paymentMethod === "All" ||
        item.paymentMethod === exportFilter.paymentMethod;

      const matchesReservationStatus =
        exportFilter.reservationStatus === "All" ||
        item.status === exportFilter.reservationStatus;

      return (
        matchesStart &&
        matchesEnd &&
        matchesPaymentStatus &&
        matchesPaymentMethod &&
        matchesReservationStatus
      );
    });
  }, [reservations, exportFilter]);

  const handleExportExcel = () => {
    const rows = filteredExportRows.map((item) => ({
      "Reservation ID": item.id,
      Guest: item.guestName || "-",
      Email: item.guestEmail || "-",
      Room: `${item.roomType} #${item.roomNumber}`,
      "Check In": formatDate(item.checkIn),
      "Check Out": formatDate(item.checkOut),
      "Duration Hours": item.durationHours,
      "Payment Method":
        item.paymentMethod === "online" ? "Pay Online" : "Pay at Check-In",
      "Payment Status": item.paymentStatus,
      "Reservation Status": item.status,
      "Total Price": item.totalPrice,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Reservation Report");

    XLSX.writeFile(workbook, "velora-reservation-report.xlsx");

    setShowExportModal(false);
  };

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
            description="Monitor reservation revenue, payment channels, and transaction status from real database records."
          />
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          <MetricCard
            label="Gross revenue"
            value={formatCurrency(grossRevenue)}
            detail="All reservation totals"
            icon={WalletCards}
            trend="Live data"
          />
          <MetricCard
            label="Paid revenue"
            value={formatCurrency(paidRevenue)}
            detail="Verified paid reservations"
            icon={TrendingUp}
            trend="Payment confirmed"
          />
          <MetricCard
            label="Completion rate"
            value={`${occupancyRate}%`}
            detail="Completed stays ratio"
            icon={Percent}
            trend={`${completedCount} completed`}
          />
          <MetricCard
            label="Avg ticket"
            value={formatCurrency(avgTicket)}
            detail="Average reservation value"
            icon={FileBarChart2}
            trend={`${reservations.length} transactions`}
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
                  Weekly paid revenue trend
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
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
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#12213d"
                    fill="url(#revenueSeriesFill)"
                    strokeWidth={3}
                    name="Paid revenue"
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
                <Badge tone="gold">Live</Badge>
              </div>

              <div className="mt-6 h-[18rem] rounded-[28px] border border-soft bg-white/70 p-4">
                {paymentMethods.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-muted">
                    No payment data yet.
                  </div>
                ) : (
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
                )}
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
              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white"
              >
                <ArrowUpRight className="h-4 w-4" />
                Export report
              </button>
            </div>

            <div className="mt-5 overflow-x-auto rounded-[28px] border border-soft bg-white/70">
              <table className="min-w-220 w-full text-left text-sm">
                <thead className="bg-white/80 text-xs uppercase tracking-[0.2em] text-muted">
                  <tr>
                    <th className="px-4 py-3">Transaction</th>
                    <th className="px-4 py-3">Guest</th>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionRows.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-muted">
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    transactionRows.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-t border-soft transition hover:bg-white/70"
                      >
                        <td className="px-4 py-4 font-semibold text-navy">
                          {transaction.id}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {transaction.guestName || "-"}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {transaction.roomType} #{transaction.roomNumber}
                        </td>
                        <td className="px-4 py-4 text-muted">
                          {formatDate(transaction.checkIn)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-navy">
                          {formatCurrency(transaction.totalPrice)}
                        </td>
                        <td className="px-4 py-4">
                          <Badge
                            tone={
                              paymentTone[transaction.paymentStatus] ||
                              "neutral"
                            }
                          >
                            {transaction.paymentStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.section>
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/20 p-4 backdrop-blur-sm">
            <div className="h-full max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-4xl border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
              <div className="flex items-start justify-between gap-4 border-b border-soft pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                    Export report
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-navy">
                    Filter reservation report
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="rounded-full border border-soft bg-white p-2 text-navy"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Start date
                  </span>
                  <input
                    type="date"
                    value={exportFilter.startDate}
                    onChange={(e) =>
                      setExportFilter((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    End date
                  </span>
                  <input
                    type="date"
                    value={exportFilter.endDate}
                    onChange={(e) =>
                      setExportFilter((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none"
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Payment status
                  </span>
                  <select
                    value={exportFilter.paymentStatus}
                    onChange={(e) =>
                      setExportFilter((prev) => ({
                        ...prev,
                        paymentStatus: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none"
                  >
                    <option value="All">All</option>
                    <option value="paid">paid</option>
                    <option value="pending">pending</option>
                    <option value="unpaid">unpaid</option>
                    <option value="rejected">rejected</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Payment method
                  </span>
                  <select
                    value={exportFilter.paymentMethod}
                    onChange={(e) =>
                      setExportFilter((prev) => ({
                        ...prev,
                        paymentMethod: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none"
                  >
                    <option value="All">All</option>
                    <option value="online">Pay Online</option>
                    <option value="pay_at_checkin">Pay at Check-In</option>
                  </select>
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Reservation status
                  </span>
                  <select
                    value={exportFilter.reservationStatus}
                    onChange={(e) =>
                      setExportFilter((prev) => ({
                        ...prev,
                        reservationStatus: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none"
                  >
                    <option value="All">All</option>
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="checked_in">checked_in</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </label>
              </div>

              <div className="mt-5 rounded-2xl border border-soft bg-white/70 p-4">
                <p className="text-sm text-muted">
                  Total data yang akan diexport:
                </p>
                <p className="mt-2 text-2xl font-semibold text-navy">
                  {filteredExportRows.length} transaksi
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  disabled={filteredExportRows.length === 0}
                  className="rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Export Excel
                </button>

                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="rounded-full border border-soft bg-white px-4 py-3 text-sm font-semibold text-navy"
                >
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

export default Reports;
