import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  ChevronRight,
  Clock3,
  CreditCard,
  Headset,
  Hotel,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../layouts/MainLayout";
import RoomCard from "../../components/home/RoomCard";
import SectionLabel from "../../components/ui/SectionLabel";
import Button from "../../components/ui/Button";

import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";

import {
  heroStats,
  roomListings,
  testimonials,
  trustSignals,
} from "../../data/veloraDemo";

const bookingSteps = [
  {
    title: "Choose your room",
    detail: "Browse curated room types and pick the stay that fits your plan.",
    icon: Hotel,
  },
  {
    title: "Set your stay time",
    detail: "Select check-in and check-out time with hourly-based pricing.",
    icon: Clock3,
  },
  {
    title: "Confirm payment",
    detail: "Pay online with proof upload or choose pay at check-in.",
    icon: CreditCard,
  },
];

const whyVelora = [
  {
    title: "Hourly reservation",
    detail: "More flexible than traditional nightly booking.",
    icon: CalendarCheck,
  },
  {
    title: "Secure payment flow",
    detail: "Online proof verification keeps transactions traceable.",
    icon: ShieldCheck,
  },
  {
    title: "Support ticket chat",
    detail: "Every booking gets a dedicated support channel.",
    icon: Headset,
  },
];

const Home = () => {
  const { authUser } = useAuth();

  const dashboardLink = authUser ? "/redirect" : "/login";
  const reserveLink = authUser ? "/user/rooms" : "/register";

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
            <SectionLabel>Velora Hotel</SectionLabel>

            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
              Premium hourly hotel reservation
            </p>

            <h1 className="mt-4 max-w-4xl text-5xl leading-[0.95] text-(--navy) sm:text-6xl lg:text-7xl">
              Book elegant rooms with flexible stay hours.
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-(--muted) sm:text-base">
              Velora helps guests discover rooms, create hourly reservations,
              choose online payment or pay at check-in, and get support through
              reservation-based chat tickets.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={reserveLink}>
                <Button variant="gold" className="gap-2">
                  Reserve now
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link to={dashboardLink}>
                <Button variant="ghost" className="gap-2">
                  {authUser ? "Open dashboard" : "Access account"}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
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
              <div className="relative min-h-[34rem]">
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1400&q=80"
                  alt="Velora Hotel"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(19,34,63,0.2),rgba(19,34,63,0.48),rgba(19,34,63,0.78))]" />

                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-(--navy) backdrop-blur">
                  <Sparkles className="h-4 w-4 text-champagne" />
                  Curated rooms
                </div>

                <div className="absolute inset-x-4 bottom-4 grid gap-4 sm:grid-cols-2">
                  <GlassCard
                    className="bg-[rgba(255,255,255,0.88)] p-4"
                    hover={false}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--muted)">
                      Flexible booking
                    </p>
                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xl font-semibold text-navy">
                          Hourly stay
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          Minimum 3 hours
                        </p>
                      </div>
                      <BadgeCheck className="h-6 w-6 text-champagne" />
                    </div>
                  </GlassCard>

                  <GlassCard
                    className="bg-[rgba(255,255,255,0.88)] p-4"
                    hover={false}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                      Guest support
                    </p>
                    <p className="mt-2 text-xl font-semibold text-navy">
                      Ticket chat after booking
                    </p>
                  </GlassCard>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.section>

        <motion.section
          id="rooms"
          variants={pageMotion}
          className="pt-16 sm:pt-20"
        >
          <SectionHeader
            label="Room preview"
            title="Explore our curated room collection."
            description="Preview room types before signing in. Login is required to check availability and create a reservation."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {roomListings.slice(0, 3).map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link to={reserveLink}>
              <Button variant="dark" className="gap-2">
                View available rooms
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.section>

        <motion.section
          id="booking-flow"
          variants={pageMotion}
          className="pt-16 sm:pt-20"
        >
          <SectionHeader
            label="Booking flow"
            title="A simple reservation journey from room discovery to support."
            description="Velora keeps the process clear for guests while giving staff enough information to manage every stay."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {bookingSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <GlassCard key={step.title} className="p-6" hover={false}>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(212,175,55,0.12)] text-champagne">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge tone="gold">0{index + 1}</Badge>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-navy">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {step.detail}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </motion.section>

        <motion.section variants={pageMotion} className="pt-16 sm:pt-20">
          <SectionHeader
            label="Why Velora"
            title="Built for modern hotel reservation workflows."
            description="The platform combines guest booking, online payment verification, and post-reservation support in one structured experience."
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {whyVelora.map((item) => {
              const Icon = item.icon;

              return (
                <GlassCard key={item.title} className="p-6" hover={false}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(18,33,61,0.08)] text-navy">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {item.detail}
                  </p>
                </GlassCard>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          id="testimonials"
          variants={pageMotion}
          className="pt-16 sm:pt-20"
        >
          <SectionHeader
            label="Testimonials"
            title="Guest confidence starts before the first click."
            description="A calm reservation experience helps guests understand what to expect before booking."
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

        <motion.section variants={pageMotion} className="pt-16 sm:pt-20">
          <GlassCard className="p-8 text-center" hover={false}>
            <Badge tone="gold">Ready to stay?</Badge>

            <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold leading-tight text-navy">
              Start your reservation with a flexible hourly booking system.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted">
              Create an account to view room availability, reserve your stay,
              upload online payment proof, and access your support ticket.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to={reserveLink}>
                <Button variant="gold" className="gap-2">
                  Start reservation
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link to={authUser ? "/redirect" : "/login"}>
                <Button variant="ghost">
                  {authUser ? "Open dashboard" : "Login"}
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.section>

        <footer className="mt-20 border-t border-soft pt-8 text-sm text-muted">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>Velora Hotel · premium reservation platform</p>

            <div className="flex flex-wrap gap-3">
              <Link
                to={authUser ? "/redirect" : "/login"}
                className="inline-flex items-center gap-2 rounded-full border border-soft bg-white/70 px-4 py-2 text-navy"
              >
                Explore rooms
                <ChevronRight className="h-4 w-4" />
              </Link>

              <Link
                to={reserveLink}
                className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-white"
              >
                Start reservation
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
