import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import {
  Badge,
  GlassCard,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { getGroupedRooms } from "../../services/roomService";
import { Link } from "react-router-dom";

const Rooms = () => {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesQuery = [
        room.roomType,
        room.description,
        ...(room.facilities || []),
      ].some((value) => value.toLowerCase().includes(query.toLowerCase()));

      const matchesType =
        selectedType === "All" || room.roomType === selectedType;

      return matchesQuery && matchesType;
    });
  }, [rooms, query, selectedType]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getGroupedRooms();
        setRooms(data.rooms || data.groupedRooms || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <UserLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section
          variants={pageMotion}
          className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
        >
          <div>
            <Badge tone="gold">Room discovery</Badge>
          </div>
        </motion.section>

        <motion.section variants={pageMotion} className="w-full">
          <GlassCard className="w-full p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-(--muted)">
                  Search and filter
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-(--navy)">
                  Refine the collection
                </h2>
              </div>
              <Filter className="h-5 w-5 text-(--champagne)" />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search Deluxe, Executive, or Presidential"
                className="w-full rounded-2xl border border-(--border-soft) bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-(--champagne)"
              />

              <select
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
                className="rounded-2xl border border-(--border-soft) bg-white/80 px-4 py-3 text-sm outline-none"
              >
                {["All", "Deluxe", "Executive", "Presidential"].map((type) => (
                  <option key={type} value={type}>
                    {type === "All" ? "All" : `${type} Room`}
                  </option>
                ))}
              </select>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section variants={pageMotion}>
          {loading ? (
            <div className="text-sm text-(--muted)">Loading rooms...</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredRooms.map((room) => (
                <GlassCard key={room.roomType} className="overflow-hidden p-0">
                  <img
                    src={room.image}
                    alt={room.roomType}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold text-(--navy)">
                          {room.roomType} Room
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-(--muted)">
                          {room.description}
                        </p>
                      </div>
                      <Badge tone="gold">{room.availableUnits} units</Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {(room.facilities || []).slice(0, 3).map((facility) => (
                        <span
                          key={facility}
                          className="rounded-full bg-[rgba(212,175,55,0.12)] px-3 py-1 text-xs text-(--navy)"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-(--muted)">
                          Hourly from
                        </p>
                        <p className="text-lg font-semibold text-(--navy)">
                          Rp{" "}
                          {Number(room.pricePerHour || 0).toLocaleString(
                            "id-ID",
                          )}
                          <span className="text-sm font-normal text-(--muted)">
                            {" "}
                            / hour
                          </span>
                        </p>
                      </div>

                      <Link
                        to={`/user/rooms/${room.roomType}`}
                        className="rounded-full bg-(--champagne) px-4 py-2 text-sm font-semibold text-white"
                      >
                        View detail
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </motion.section>
      </motion.div>
    </UserLayout>
  );
};

export default Rooms;
