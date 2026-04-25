import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, BedDouble, Search, Users2 } from "lucide-react";
import Button from "../ui/Button";
import { GlassCard } from "../velora/PlatformKit";

const BookingBar = () => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const later = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(later);
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState("all");

  const fieldClass =
    "mt-2 w-full rounded-2xl border border-[var(--border-soft)] bg-white/85 px-4 py-3 text-sm text-(--ink) outline-none transition placeholder:text-slate-400 focus:border-[var(--champagne)] focus:ring-4 focus:ring-[rgba(200,168,106,0.16)]";

  const labelClass =
    "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-(--muted)";

  return (
    <GlassCard className="p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
            Availability search
          </p>
          <h3 className="mt-2 text-xl font-semibold text-(--navy)">
            Find the right room before you arrive.
          </h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-soft bg-white/70 px-3 py-2 text-xs font-medium text-muted">
          <Search className="h-4 w-4 text-champagne" />
          Live availability
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <label className={labelClass}>Check-in</label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-champagne" />
            <input
              type="date"
              className={`${fieldClass} pl-10`}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Check-out</label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-champagne" />
            <input
              type="date"
              className={`${fieldClass} pl-10`}
              min={checkIn}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Guests</label>
          <div className="relative">
            <Users2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-champagne" />
            <select
              className={`${fieldClass} pl-10`}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} Guests
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Room type</label>
          <div className="relative">
            <BedDouble className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-champagne" />
            <select
              className={`${fieldClass} pl-10`}
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="all">All suites</option>
              <option value="deluxe">Aurora Suite</option>
              <option value="grand">Grand Horizon</option>
              <option value="executive">Executive Twin</option>
              <option value="presidential">Presidential Villa</option>
            </select>
          </div>
        </div>

        <div className="flex items-end">
          <Link to="/rooms" className="w-full">
            <Button variant="gold" className="w-full gap-2">
              <Search className="h-4 w-4" />
              Search rooms
            </Button>
          </Link>
        </div>
      </div>
    </GlassCard>
  );
};

export default BookingBar;
