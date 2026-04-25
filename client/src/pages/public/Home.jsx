import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Users2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../layouts/MainLayout";
import BookingBar from "../../components/home/BookingBar";
import RoomCard from "../../components/home/RoomCard";
import SectionLabel from "../../components/ui/SectionLabel";
import Button from "../../components/ui/Button";
import {
  Badge,
  GlassCard,
  MiniBars,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import {
  analyticsSummary,
  bookingQueue,
  heroStats,
  roomListings,
  testimonials,
  trustSignals,
} from "../../data/veloraDemo";

const Home = () => {
  const { authUser } = useAuth();

  return (
    <MainLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="pb-16 pt-8 sm:pt-12 lg:pt-16"
      >
        <motion.section
          variants={pageMotion}
          className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
        >
          <div>
            <SectionLabel>Velora Hotel Kit</SectionLabel>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
              Luxury minimalist booking platform
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl leading-[0.95] text-(--navy) sm:text-6xl lg:text-7xl">
              Aman-inspired stays, wrapped in a premium SaaS command center.
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-(--muted) sm:text-base">
              Velora Hotel Kit blends a refined landing experience, room
              discovery, reservation tracking, guest insights, and revenue
              analytics into one calm, editorial interface.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {authUser ? (
                <Link to="/redirect">
                  <Button variant="dark" className="gap-2">
                    Open dashboard
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="gold" className="gap-2">
                      Reserve now
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="ghost">Access account</Button>
                  </Link>
                </>
              )}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {heroStats.map((stat) => (
                <GlassCard key={stat.label} className="p-4" hover={false}>
                  <p className="text-2xl font-semibold text-navy">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted">
                    {stat.label}
                  </p>
                </GlassCard>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted">
              {trustSignals.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-soft bg-white/70 px-3 py-2"
                >
                  <ShieldCheck className="h-4 w-4 text-champagne" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <GlassCard className="overflow-hidden p-0">
              <div className="relative" style={{ minHeight: "34rem" }}>
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1400&q=80"
                  alt="Velora Hotel"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom right, rgba(19,34,63,0.2), rgba(19,34,63,0.48), rgba(19,34,63,0.78))",
                  }}
                />

                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--navy) backdrop-blur">
                  <Sparkles className="h-4 w-4 text-champagne" />
                  Curated collection
                </div>

                <div className="absolute inset-x-4 bottom-4 grid gap-4 sm:grid-cols-2">
                  <GlassCard
                    className="bg-[rgba(255,255,255,0.88)] p-4"
                    hover={false}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--muted)">
                      Next available suite
                    </p>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xl font-semibold text-navy">
                          Grand Horizon
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          Ocean front · butler service
                        </p>
                      </div>
                      <BadgeCheck className="h-6 w-6 text-champagne" />
                    </div>
                  </GlassCard>

                  <GlassCard
                    className="bg-[rgba(255,255,255,0.88)] p-4"
                    hover={false}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                          Guest flow
                        </p>
                        <p className="mt-2 text-xl font-semibold text-navy">
                          Check-in to suite in 3 steps
                        </p>
                      </div>
                      <Users2 className="h-6 w-6 text-champagne" />
                    </div>
                  </GlassCard>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.section>

        <section className="relative z-10  my-10">
          <BookingBar />
        </section>

        <motion.section variants={pageMotion} className="">
          <SectionHeader
            label="Hotel Room Listings"
            title="A curated room collection designed for calm decision-making."
            description="Premium room cards surface pricing, occupancy, and amenities without visual noise, so guests can compare options quickly and book with confidence."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {roomListings.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </motion.section>

        <motion.section variants={pageMotion} className="pt-16 sm:pt-20">
          <SectionHeader
            label="Booking Management Dashboard"
            title="Operations stay composed, even when occupancy peaks."
            description="A booking desk view presents status indicators, task queues, and revenue signals in a compact glass panel layout for staff review."
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <GlassCard>
              <div className="flex items-center justify-between gap-4 border-b border-soft pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                    Today’s desk
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-navy">
                    Front office queue
                  </h3>
                </div>
                <Badge tone="gold">Live</Badge>
              </div>

              <div className="mt-5 space-y-3">
                {bookingQueue.map((booking) => (
                  <div
                    key={booking.name}
                    className="flex flex-col gap-3 rounded-2xl border border-soft bg-white/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-navy">{booking.name}</p>
                      <p className="mt-1 text-sm text-muted">
                        {booking.room} · {booking.dates}
                      </p>
                    </div>
                    <Badge tone={booking.tone}>{booking.status}</Badge>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--muted)">
                    Revenue pulse
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                    Monthly performance
                  </h3>
                </div>
                <Badge tone="navy">Analytics</Badge>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {analyticsSummary.slice(0, 2).map((item) => (
                  <GlassCard key={item.label} className="p-4" hover={false}>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted">
                      {item.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-navy">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm text-muted">{item.detail}</p>
                  </GlassCard>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-soft bg-white/70 p-4">
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>Revenue trend</span>
                  <span>Last 12 months</span>
                </div>
                <div className="mt-4">
                  <MiniBars
                    values={[22, 34, 28, 40, 52, 48, 60, 66, 58, 72, 74, 84]}
                    accent
                  />
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.section>

        <motion.section variants={pageMotion} className="pt-16 sm:pt-20">
          <SectionHeader
            label="Testimonials"
            title="Subtle trust signals carry the booking decision."
            description="Editorial spacing and restrained tone keep the guest voice front and center while reinforcing credibility through the interface."
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <GlassCard key={item.name} className="p-6" hover={false}>
                <div className="flex items-center justify-between">
                  <Badge tone="gold">Guest review</Badge>
                  <span className="text-sm text-muted">{item.origin}</span>
                </div>
                <p className="mt-5 text-sm leading-8 text-muted">
                  “{item.text}”
                </p>
                <p className="mt-5 text-sm font-semibold text-navy">
                  {item.name}
                </p>
              </GlassCard>
            ))}
          </div>
        </motion.section>

        <footer className="mt-20 border-t border-soft pt-8 text-sm text-muted">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>Velora Hotel Kit · luxury hotel management platform concept</p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/rooms"
                className="inline-flex items-center gap-2 rounded-full border border-soft bg-white/70 px-4 py-2 text-navy"
              >
                Explore rooms
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/admin/analytics"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-white"
              >
                Open analytics
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </footer>
      </motion.div>
    </MainLayout>
  );
};

export default Home;
