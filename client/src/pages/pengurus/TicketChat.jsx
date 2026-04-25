import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Headset, Send, Ticket, UserRound } from "lucide-react";
import PengurusLayout from "../../layouts/PengurusLayout";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { useAuth } from "../../context/AuthContext";
import {
  getTicketDetail,
  getTicketMessages,
  sendMessage,
} from "../../services/ticketService";
import socket from "../../socket";

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
    dateStyle: "medium",
    timeStyle: "short",
  });

const TicketChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, authUser } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatData = async () => {
    try {
      setError("");

      const [ticketRes, messageRes] = await Promise.all([
        getTicketDetail(id, token),
        getTicketMessages(id, token),
      ]);

      setTicket(ticketRes.ticket);
      setMessages(messageRes.messages || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat chat ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && id) {
      fetchChatData();
    }
  }, [id, token]);

  useEffect(() => {
    if (!id) return;

    socket.connect();

    socket.on("connect", () => {
      socket.emit("join_ticket", id);
    });

    socket.emit("join_ticket", id);

    socket.on("receive_message", (incomingMessage) => {
      if (incomingMessage.ticketId !== id) return;

      setMessages((prev) => {
        const exists = prev.some(
          (msg) =>
            msg._id && incomingMessage._id && msg._id === incomingMessage._id,
        );

        if (exists) return prev;
        return [...prev, incomingMessage];
      });
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!draftMessage.trim()) return;

    try {
      setSending(true);

      const response = await sendMessage(id, draftMessage, token);
      const newMessage = response.chat;

      setMessages((prev) => [...prev, newMessage]);

      socket.emit("send_message", {
        ...newMessage,
        ticketId: id,
      });

      setDraftMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengirim pesan");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <PengurusLayout>
        <div className="p-6 text-sm text-(--muted)">Loading chat...</div>
      </PengurusLayout>
    );
  }

  if (error && !ticket) {
    return (
      <PengurusLayout>
        <div className="p-6 text-sm text-red-500">{error}</div>
      </PengurusLayout>
    );
  }

  const guest = ticket?.reservation?.user || ticket?.user;
  const room = ticket?.reservation?.room;

  return (
    <PengurusLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="flex h-[calc(100vh-4rem)] min-h-0 flex-col overflow-hidden"
      >
        <motion.section variants={pageMotion} className="mb-4 shrink-0">
          <SectionHeader
            label="Ticket Chat"
            title={`Support conversation for ticket #${ticket?._id}`}
            description="Communicate directly with the guest within a reservation-linked support channel."
          />
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[0.38fr_0.62fr]"
        >
          <GlassCard className="flex h-full min-h-0 flex-col overflow-hidden p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                  Ticket Detail
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                  Reservation-linked support
                </h3>
              </div>
              <Ticket className="h-5 w-5 text-(--champagne)" />
            </div>

            <div className="mt-5 space-y-4 overflow-y-auto pr-1">
              <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                  Ticket Status
                </p>
                <Badge
                  tone={ticketTone[ticket?.status] || "neutral"}
                  className="mt-3"
                >
                  {formatTicketStatus(ticket?.status)}
                </Badge>
              </div>

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
              </div>

              <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                  Stay Schedule
                </p>
                <p className="mt-2 text-sm font-semibold leading-6 text-(--navy)">
                  {ticket?.reservation?.checkIn
                    ? formatDateTime(ticket.reservation.checkIn)
                    : "-"}
                  <br />
                  {ticket?.reservation?.checkOut
                    ? formatDateTime(ticket.reservation.checkOut)
                    : "-"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/pengurus/tickets")}
                className="inline-flex items-center gap-2 rounded-full border border-(--border-soft) bg-white px-4 py-3 text-sm font-semibold text-(--navy)"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Tickets
              </button>
            </div>
          </GlassCard>

          <GlassCard className="flex h-full min-h-0 flex-col overflow-hidden p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-(--border-soft) pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                  Conversation Room
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                  Ticket #{ticket?._id}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <Badge tone={ticketTone[ticket?.status] || "neutral"}>
                  {formatTicketStatus(ticket?.status)}
                </Badge>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-(--navy) text-sm font-semibold text-white">
                  PG
                </div>
              </div>
            </div>

            <div className="mt-6 flex min-h-0 flex-1 flex-col rounded-[28px] border border-(--border-soft) bg-white/70">
              <div className="hide-scrollbar flex-1 min-h-0 space-y-4 overflow-y-auto p-5">
                {messages.map((message, index) => {
                  const senderId =
                    typeof message.sender === "object"
                      ? message.sender?._id
                      : message.sender;

                  const isMine = senderId === authUser?._id;

                  return (
                    <div
                      key={message._id || index}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[72%] rounded-3xl px-4 py-3 text-sm leading-7 ${
                          isMine
                            ? "bg-(--navy) text-white"
                            : "bg-white text-(--navy)"
                        }`}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                              isMine
                                ? "bg-white/15 text-white"
                                : "bg-[rgba(212,175,55,0.14)] text-(--navy)"
                            }`}
                          >
                            {isMine ? (
                              <Headset className="h-4 w-4" />
                            ) : (
                              <UserRound className="h-4 w-4" />
                            )}
                          </div>

                          <p className="text-[11px] uppercase tracking-[0.2em] opacity-60">
                            {typeof message.sender === "object"
                              ? message.sender?.name
                              : message.senderRole}
                          </p>
                        </div>

                        <p>{message.message}</p>
                      </div>
                    </div>
                  );
                })}

                <div ref={bottomRef} />
              </div>

              <div className="sticky bottom-0 border-t border-(--border-soft) bg-white px-4 py-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={draftMessage}
                    onChange={(e) => setDraftMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    placeholder="Type your response..."
                    className="h-12 w-full rounded-full border border-(--border-soft) bg-white px-5 text-sm outline-none focus:border-(--champagne)"
                  />

                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={sending}
                    className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-(--champagne) px-6 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>
      </motion.div>
    </PengurusLayout>
  );
};

export default TicketChat;
