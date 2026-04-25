import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FlagTriangleRight,
  Search,
  ShieldAlert,
  SquareArrowOutUpRight,
  Users2,
  X,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { chatLogs } from "../../data/adminData";

const ChatLogs = () => {
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState(chatLogs[0]);
  const activeChat = selectedChat ?? chatLogs[0];

  const visibleChats = useMemo(() => {
    return chatLogs.filter((chat) =>
      [chat.guest, chat.room, chat.reservationId, chat.manager].some((value) =>
        value.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search]);

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
            label="Chat logs"
            title="Post-reservation conversation review with export and moderation tools."
            description="Search conversations by reservation ID, guest, room, or manager without losing traceability."
          />
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]"
        >
          <GlassCard>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-champagne" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search user, room, reservation ID"
                className="w-full rounded-2xl border border-soft bg-white/80 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-champagne"
              />
            </div>
            <div className="mt-5 space-y-3">
              {visibleChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full rounded-3xl border p-4 text-left transition ${selectedChat?.id === chat.id ? "border-[#12213d] bg-[#12213d] text-white" : "border-soft bg-white/70 text-navy hover:bg-white"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{chat.guest}</p>
                      <p
                        className={`mt-1 text-xs ${selectedChat?.id === chat.id ? "text-white/70" : "text-muted"}`}
                      >
                        {chat.room} · {chat.reservationId}
                      </p>
                    </div>
                    {chat.flagged ? (
                      <Badge tone="warning">Flagged</Badge>
                    ) : (
                      <Badge tone="success">Reviewed</Badge>
                    )}
                  </div>
                  <p
                    className={`mt-3 text-sm leading-7 ${selectedChat?.id === chat.id ? "text-white/80" : "text-muted"}`}
                  >
                    {chat.excerpt}
                  </p>
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between gap-4 border-b border-soft pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                  Thread viewer
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-navy">
                  {activeChat.guest}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-full border border-soft bg-white px-3 py-2 text-xs font-semibold text-navy">
                  <SquareArrowOutUpRight className="mr-2 inline h-3.5 w-3.5" />
                  Export
                </button>
                <button className="rounded-full border border-soft bg-white px-3 py-2 text-xs font-semibold text-rose-700">
                  <FlagTriangleRight className="mr-2 inline h-3.5 w-3.5" />
                  Flag
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-soft bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">
                  Reservation
                </p>
                <p className="mt-2 font-semibold text-navy">
                  {activeChat.reservationId}
                </p>
              </div>
              <div className="rounded-2xl border border-soft bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted">
                  Manager
                </p>
                <p className="mt-2 font-semibold text-navy">
                  {activeChat.manager}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 rounded-[28px] border border-soft bg-white/70 p-5">
              {activeChat.messages.map((message) => (
                <div
                  key={`${message.author}-${message.text}`}
                  className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-7 ${message.author === "Manager" ? "ml-auto bg-[#12213d] text-white" : "bg-white text-navy"}`}
                >
                  <p className="text-[11px] uppercase tracking-[0.2em] opacity-60">
                    {message.author}
                  </p>
                  <p className="mt-1">{message.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge tone="gold">
                <Users2 className="mr-2 h-3.5 w-3.5" />
                Linked to booking
              </Badge>
              <Badge tone={activeChat.flagged ? "warning" : "success"}>
                {activeChat.flagged
                  ? "Moderation needed"
                  : "No moderation issues"}
              </Badge>
            </div>
          </GlassCard>
        </motion.section>

        {selectedChat && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/20 p-4 backdrop-blur-sm">
            <div className="h-full w-full max-w-lg rounded-4xl border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
              <div className="flex items-start justify-between gap-4 border-b border-soft pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                    Chat detail modal
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-navy">
                    Conversation record
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedChat(null)}
                  className="rounded-full border border-soft bg-white p-2 text-navy"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 space-y-3 text-sm text-muted">
                <p>Guest: {activeChat.guest}</p>
                <p>Room: {activeChat.room}</p>
                <p>Reservation: {activeChat.reservationId}</p>
                <p>
                  Transcript can be exported for compliance and post-stay
                  review.
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button className="rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white">
                  Export transcript
                </button>
                <button className="rounded-full border border-soft bg-white px-4 py-3 text-sm font-semibold text-rose-700">
                  Report issue
                </button>
              </div>
              {activeChat.flagged && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <ShieldAlert className="mb-2 h-4 w-4" />
                  This thread is flagged for moderation review.
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default ChatLogs;
