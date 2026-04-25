import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Bot,
  MessageCircleHeart,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { preBookingQuestions, roomListings } from "../../data/veloraDemo";

const quickReplies = [
  "Harga deluxe?",
  "Executive tersedia?",
  "Fasilitas Executive apa saja?",
  "Late checkout bisa?",
];

const assistantGreeting = {
  role: "assistant",
  text: "Halo, saya Velora Assistant. Tanyakan harga kamar, ketersediaan, fasilitas, late checkout, atau durasi reservasi.",
};

const matchAssistantReply = (message) => {
  const query = message.toLowerCase();

  if (/(harga|rate|price|biaya|deluxe)/.test(query) && /deluxe/.test(query)) {
    return {
      title: "Deluxe pricing",
      text: "Harga Deluxe Room mulai Rp150.000 per jam. Minimal reservasi 3 jam.",
    };
  }

  if (
    (/(harga|rate|price|biaya)/.test(query) && /executive/.test(query)) ||
    /executive/.test(query)
  ) {
    return {
      title: "Executive availability",
      text: "Saat ini Executive Room tersedia 2 unit.",
    };
  }

  if (/(fasilitas|facilities|facility)/.test(query)) {
    return {
      title: "Executive facilities",
      text: "Executive Room dilengkapi work desk premium, lounge access, rain shower, dan Wi‑Fi cepat.",
    };
  }

  if (/(late checkout|checkout)/.test(query)) {
    return {
      title: "Late checkout",
      text: "Late checkout dapat diajukan sesuai ketersediaan kamar.",
    };
  }

  if (/(durasi|minimal|minimum|jam|hours|duration)/.test(query)) {
    return {
      title: "Reservation duration",
      text: "Minimal reservasi adalah 3 jam untuk semua room type.",
    };
  }

  if (/(paket|package|special)/.test(query)) {
    return {
      title: "Special packages",
      text: "Tersedia paket kamar tertentu yang bisa mencakup breakfast, early check-in, dan late checkout.",
    };
  }

  if (
    /(tersedia|available|available room|ketersediaan)/.test(query) &&
    /deluxe/.test(query)
  ) {
    return {
      title: "Deluxe availability",
      text: "Saat ini Deluxe Room tersedia 3 unit.",
    };
  }

  return {
    title: "Assistant note",
    text: "Saya bisa bantu harga, ketersediaan, fasilitas, late checkout, dan aturan durasi reservasi.",
  };
};

const HotelAssistantWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([assistantGreeting]);
  const [typing, setTyping] = useState(false);
  const timerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const selectedQuestion = useMemo(
    () => messages[messages.length - 1],
    [messages],
  );

  useEffect(() => {
    if (!open) setTyping(false);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, typing, open]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const sendMessage = (text) => {
    const trimmed = text.trim();

    if (!trimmed) return;

    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    const reply = matchAssistantReply(trimmed);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { role: "assistant", title: reply.title, text: reply.text },
      ]);
      setTyping(false);
    }, 700);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed bottom-4 right-4 z-50 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(212,175,55,0.22)] bg-[linear-gradient(135deg,#d4af37,#b8914d)] text-white shadow-[0_18px_40px_rgba(212,175,55,0.34)] transition hover:-translate-y-1 ${open ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
        aria-label="Open Velora assistant"
      >
        <MessageCircleHeart className="h-7 w-7" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="fixed bottom-4 left-4 right-4 z-50 overflow-hidden rounded-[28px] border border-white/70 bg-[rgba(255,255,255,0.92)] shadow-[0_28px_90px_rgba(15,23,42,0.24)] backdrop-blur-2xl sm:left-auto sm:right-6 sm:w-96"
          >
            <div className="flex items-center justify-between gap-4 border-b border-(--border-soft) bg-[linear-gradient(135deg,rgba(19,34,63,0.98),rgba(30,46,78,0.9))] px-4 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(212,175,55,0.16)] text-(--champagne)">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                    Velora concierge
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">
                    Pre-booking assistant
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/15"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70svh] space-y-4 overflow-y-auto px-4 py-4 sm:max-h-128">
              <div className="rounded-3xl border border-(--border-soft) bg-white/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(212,175,55,0.14)] text-(--navy)">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-(--navy)">
                      Ask about rooms, rates, and booking rules
                    </p>
                    <p className="text-xs text-(--muted)">
                      Guided pre-booking only. No human inbox.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}-${message.text}`}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-7 ${message.role === "user" ? "bg-(--navy) text-white shadow-[0_18px_36px_rgba(15,23,42,0.2)]" : "border border-(--border-soft) bg-white text-(--navy)"}`}
                    >
                      {message.role === "assistant" && (
                        <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-(--champagne)">
                          {message.title || "Assistant"}
                        </p>
                      )}
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex justify-start">
                    <div className="rounded-3xl border border-(--border-soft) bg-white px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-(--champagne)" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-(--champagne) [animation-delay:120ms]" />
                        <span className="h-2 w-2 animate-pulse rounded-full bg-(--champagne) [animation-delay:240ms]" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--muted)">
                  Quick replies
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => sendMessage(reply)}
                      className="rounded-full border border-(--border-soft) bg-white/80 px-3 py-2 text-xs font-medium text-(--navy) transition hover:bg-white"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-(--border-soft) bg-white/96 px-4 py-4"
            >
              <div className="flex items-center gap-3 rounded-full border border-(--border-soft) bg-white px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Type your hotel question..."
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-(--navy) outline-none placeholder:text-(--muted)"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-(--champagne) text-white transition hover:scale-[1.02]"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default HotelAssistantWidget;
