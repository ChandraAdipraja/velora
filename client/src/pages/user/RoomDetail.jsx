import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Check,
  Clock3,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Wifi,
} from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { getRoomDetailByType } from "../../services/roomService";

const facilityIcons = {
  AC: Sparkles,
  WiFi: Wifi,
  TV: Sparkles,
  Bathroom: Bath,
  Breakfast: Sparkles,
  "Mini Bar": Sparkles,
  Bathtub: Bath,
  "Private Pool": Sparkles,
  Jacuzzi: Bath,
  Butler: ShieldCheck,
  "Living Room": Heart,
};

const RoomDetail = () => {
  const { roomType } = useParams();
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getRoomDetailByType(roomType);
        setUnits(data.rooms || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [roomType]);

  const room = useMemo(() => {
    if (!units.length) return null;

    const base = units[0];

    return {
      roomType: base.roomType,
      name: `${base.roomType} Room`,
      summary: base.description,
      heroImages: [base.image, base.image, base.image, base.image],
      hourlyPrice: base.pricePerHour,
      availableUnits: units.filter((item) => item.status === "available")
        .length,
      size: base.size,
      occupancy: `${base.capacity} Guests`,
      facilities: base.facilities || [],
      availability: `${units.filter((item) => item.status === "available").length} rooms available`,
    };
  }, [units]);

  if (loading) {
    return (
      <UserLayout>
        <div className="p-6">Loading...</div>
      </UserLayout>
    );
  }

  if (!room) {
    return (
      <UserLayout>
        <div className="p-6">Room not found.</div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section variants={pageMotion}>
          <SectionHeader
            label="Room detail"
            title={room.name}
            description={room.summary}
          />
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"
        >
          <GlassCard className="overflow-hidden p-0">
            <div className="grid gap-3 p-3 sm:grid-cols-[1.4fr_0.6fr]">
              <div className="relative min-h-96 overflow-hidden rounded-3xl">
                <img
                  src={room.heroImages[0]}
                  alt={room.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-br from-[rgba(15,28,52,0.12)] via-[rgba(15,28,52,0.34)] to-[rgba(15,28,52,0.72)]" />
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/88 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--navy) backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-(--champagne)" />
                  {room.availability}
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-3xl border border-white/15 bg-white/12 p-4 text-white backdrop-blur-xl">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-white/65">
                        Hourly from
                      </p>
                      <p className="mt-2 text-3xl font-semibold">
                        Rp {room.hourlyPrice.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <Badge tone="gold">{room.availableUnits} units</Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-rows-3">
                {room.heroImages.slice(1).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative min-h-30 overflow-hidden rounded-3xl"
                  >
                    <img
                      src={image}
                      alt={`${room.name} gallery ${index + 2}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 lg:sticky lg:top-6 lg:self-start">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                  Booking summary
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-(--navy)">
                  Book this room in minutes
                </h2>
              </div>
              <Badge tone="success">Available</Badge>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                  Size
                </p>
                <p className="mt-2 text-lg font-semibold text-(--navy)">
                  {room.size}
                </p>
              </div>
              <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                  Occupancy
                </p>
                <p className="mt-2 text-lg font-semibold text-(--navy)">
                  {room.occupancy}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-(--border-soft) bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                Availability
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="font-semibold text-(--navy)">
                  {room.availableUnits} rooms available
                </span>
                <Clock3 className="h-5 w-5 text-(--champagne)" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="gold">Hourly booking</Badge>
                <Badge tone="navy">Premium stay</Badge>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/user/reservation", {
                  state: {
                    room: {
                      roomType: room.roomType,
                      roomName: room.name,
                      startingPrice: room.hourlyPrice,
                      availableUnits: room.availableUnits,
                      summary: room.summary,
                    },
                  },
                })
              }
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-(--champagne) px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(212,175,55,0.24)] transition hover:-translate-y-0.5"
            >
              Reserve now
              <ArrowRight className="h-4 w-4" />
            </button>
          </GlassCard>
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
        >
          <GlassCard className="p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
              Facilities
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
              Premium amenities and service points
            </h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {room.facilities.map((facility) => {
                const Icon = facilityIcons[facility] || Check;

                return (
                  <div
                    key={facility}
                    className="flex items-center gap-3 rounded-2xl border border-(--border-soft) bg-white/70 px-4 py-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(212,175,55,0.12)] text-(--champagne)">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-(--navy)">
                      {facility}
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
              Service detail
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
              Why this room feels premium
            </h3>
            <div className="mt-6 space-y-4 text-sm leading-7 text-(--muted)">
              <p>
                The layout is quiet, intuitive, and visually calm, which keeps
                the booking experience aligned with a luxury hospitality tone.
              </p>
              <p>
                The booking call-to-action stays visible on larger screens so
                the user can move from inspiration to reservation without extra
                taps.
              </p>
            </div>
          </GlassCard>
        </motion.section>
      </motion.div>
    </UserLayout>
  );
};

export default RoomDetail;
