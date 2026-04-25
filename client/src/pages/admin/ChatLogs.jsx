import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, MessageSquareText, Search } from "lucide-react";
import * as XLSX from "xlsx";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { useAuth } from "../../context/AuthContext";
import { getChatLogs, getChatLogDetail } from "../../services/adminService";

const statusTone = {
  open: "warning",
  assigned: "navy",
  closed: "gold",
};

const formatDateTime = (value) =>
  new Date(value).toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });

const ChatLogs = () => {
  const { token } = useAuth();

  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await getChatLogs(token);
      setLogs(res.data.logs || []);
    } catch (error) {
      console.error("Failed to load chat logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (id) => {
    try {
      const res = await getChatLogDetail(id, token);
      setSelectedLog(res.data.ticket);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("Failed to load chat detail:", error);
    }
  };

  useEffect(() => {
    if (token) fetchLogs();
  }, [token]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = [
        log.id,
        log.guestName,
        log.guestEmail,
        log.assignedStaff,
        log.room,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase()),
        );

      const matchesStatus =
        statusFilter === "All" || log.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [logs, search, statusFilter]);

  const exportCurrentChat = () => {
    if (!selectedLog || messages.length === 0) return;

    const rows = messages.map((message) => ({
      Ticket: selectedLog._id,
      Sender: message.sender?.name || "-",
      Role: message.senderRole || message.sender?.role || "-",
      Message: message.message,
      Time: formatDateTime(message.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Chat Log");
    XLSX.writeFile(workbook, `chat-log-${selectedLog._id}.xlsx`);
  };

  const totalMessages = logs.reduce(
    (sum, item) => sum + Number(item.messageCount || 0),
    0,
  );

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
            label="Chat Logs"
            title="Support conversation audit center."
            description="Review reservation-based support tickets and export conversation transcripts."
          />
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 md:grid-cols-3"
        >
          {[
            ["Total Tickets", logs.length],
            ["Total Messages", totalMessages],
            [
              "Open Conversations",
              logs.filter((log) => log.status !== "closed").length,
            ],
          ].map(([label, value]) => (
            <GlassCard key={label} className="p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">
                {label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-navy">{value}</p>
            </GlassCard>
          ))}
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid min-h-[650px] gap-6 xl:grid-cols-[0.42fr_0.58fr]"
        >
          <GlassCard className="min-w-0 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-champagne">
                  Ticket list
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-navy">
                  Conversation records
                </h3>
              </div>
              <MessageSquareText className="h-5 w-5 text-champagne" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_0.45fr]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-champagne" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search guest, staff, ticket..."
                  className="w-full rounded-2xl border border-soft bg-white py-3 pl-10 pr-4 text-sm outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-soft bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="All">All</option>
                <option value="open">open</option>
                <option value="assigned">assigned</option>
                <option value="closed">closed</option>
              </select>
            </div>

            <div className="mt-5 max-h-[500px] space-y-3 overflow-y-auto pr-1">
              {loading ? (
                <p className="text-sm text-muted">Loading chat logs...</p>
              ) : filteredLogs.length === 0 ? (
                <p className="text-sm text-muted">No chat logs found.</p>
              ) : (
                filteredLogs.map((log) => (
                  <button
                    key={log.id}
                    type="button"
                    onClick={() => fetchDetail(log.id)}
                    className="w-full rounded-3xl border border-soft bg-white/70 p-4 text-left transition hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-navy">
                          {log.guestName}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          Ticket #{log.id}
                        </p>
                      </div>
                      <Badge tone={statusTone[log.status] || "neutral"}>
                        {log.status}
                      </Badge>
                    </div>

                    <p className="mt-3 text-sm text-muted">{log.room}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-navy">
                      {log.lastMessage}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted">
                      <span>{log.messageCount} messages</span>
                      <span>{formatDateTime(log.lastMessageAt)}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </GlassCard>

          <GlassCard className="flex min-w-0 flex-col p-5">
            {!selectedLog ? (
              <div className="flex h-full items-center justify-center rounded-[28px] border border-soft bg-white/70 p-8 text-center">
                <div>
                  <MessageSquareText className="mx-auto h-10 w-10 text-champagne" />
                  <p className="mt-4 text-lg font-semibold text-navy">
                    Select a ticket log
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Choose a conversation from the left panel to inspect the
                    transcript.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-soft pb-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-champagne">
                      Conversation transcript
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-navy">
                      Ticket #{selectedLog._id}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      Guest: {selectedLog.user?.name || "-"} · Staff:{" "}
                      {selectedLog.assignedStaff?.name || "Unassigned"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={exportCurrentChat}
                    className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white"
                  >
                    <Download className="h-4 w-4" />
                    Export Excel
                  </button>
                </div>

                <div className="mt-5 flex-1 space-y-4 overflow-y-auto rounded-[28px] border border-soft bg-white/70 p-5">
                  {messages.length === 0 ? (
                    <p className="text-sm text-muted">No messages yet.</p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className="rounded-3xl border border-soft bg-white p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-navy">
                              {message.sender?.name || "-"}
                            </p>
                            <p className="text-xs uppercase tracking-[0.2em] text-muted">
                              {message.senderRole || message.sender?.role}
                            </p>
                          </div>
                          <span className="text-xs text-muted">
                            {formatDateTime(message.createdAt)}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-7 text-navy">
                          {message.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </GlassCard>
        </motion.section>
      </motion.div>
    </AdminLayout>
  );
};

export default ChatLogs;
