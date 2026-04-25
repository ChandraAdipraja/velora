import { Link } from "react-router-dom";
import { ArrowUpRight, BedDouble, Sparkles, Users2 } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { Badge } from "../velora/PlatformKit";

const RoomCard = ({ room }) => {
  const price = room.hourlyPrice ?? room.price ?? 0;
  const badges = room.badges ?? room.features ?? [];
  const detailPath = room.detailPath || "/user/reservation";
  const bookingPath = room.bookingPath || "/user/reservation";

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="group overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl"
    >
      <Link to={detailPath} className="relative block h-72 overflow-hidden">
        <img
          src={room.image || room.img}
          alt={room.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/88 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-champagne" />
          {room.status || room.tag || room.name}
        </div>

        <div className="absolute right-4 top-4 rounded-full border border-white/50 bg-[rgba(19,34,63,0.85)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
          {room.availableUnits
            ? `${room.availableUnits} rooms available`
            : room.occupancy || "2 guests"}
        </div>

        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(to top, rgba(19,34,63,0.78), rgba(19,34,63,0.08), transparent)",
          }}
        />

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/70">
              Starting from
            </p>
            <p className="mt-1 text-3xl font-semibold">
              Rp {price.toLocaleString("id-ID")}
            </p>
          </div>
          <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur">
            / hour
          </span>
        </div>
      </Link>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold text-navy">{room.name}</h3>
            <Badge tone="gold">
              {room.availableUnits
                ? `${room.availableUnits} open`
                : room.tag || "Suite"}
            </Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-champagne" />
              {room.size || room.capacity || "Premium suite"}
            </span>
            <span className="inline-flex items-center gap-2">
              <BedDouble className="h-4 w-4 text-champagne" />
              {room.occupancy || room.bed || "2 guests"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {badges.map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-soft bg-white/70 px-3 py-1 text-xs text-muted"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-soft pt-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Users2 className="h-4 w-4 text-champagne" />
              <span>
                {room.description ||
                  "Luxury hospitality with a calm booking flow"}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to={detailPath}>
              <Button variant="ghost" className="gap-2 px-4 py-2">
                Details
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to={bookingPath}>
              <Button variant="dark" className="gap-2 px-4 py-2">
                Book now
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
