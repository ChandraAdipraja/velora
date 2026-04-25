import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Sparkles, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import UserLayout from "../../layouts/UserLayout";
import {
  Badge,
  GlassCard,
  pageMotion,
} from "../../components/velora/PlatformKit";
import {
  dashboardActions,
  dashboardSummary,
  dashboardTimeline,
  promoOffer,
} from "../../data/userDemo";

const Dashboard = () => {
  const { authUser } = useAuth();
  const guestName = authUser?.name || "Chandra";
  const initials = guestName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <UserLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section variants={pageMotion}>
          <GlassCard className="overflow-hidden p-0">
            <div>
              <div className="relative flex h-full flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="max-w-xl">
                    <Badge tone="gold">Welcome back</Badge>
                    <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[0.95] sm:text-5xl">
                      Welcome back, {guestName}
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7  sm:text-base">
                      Manage every stay with a calm premium dashboard that keeps
                      bookings, messages, and room discovery in one place.
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-lg font-semibold backdrop-blur-xl">
                    {initials || "CH"}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {dashboardSummary.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.5rem] border border-neutral-700 bg-white/10 p-4 backdrop-blur-xl"
                    >
                      <p className="text-[11px] uppercase tracking-[0.24em] text-(--navy)">
                        {item.label}
                      </p>
                      <p className="mt-3 text-3xl font-semibold text-(--navy)">
                        {item.value}
                      </p>
                      <p className="mt-2 text-xs leading-6 text-(--navy)">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section variants={pageMotion}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                Quick actions
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-(--navy)">
                Move through the booking flow
              </h2>
            </div>
            <Badge tone="gold">Fast access</Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {dashboardActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link key={action.label} to={action.to}>
                  <GlassCard className="h-full p-5 transition hover:-translate-y-1">
                    <div className="flex h-full flex-col justify-between gap-6">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(212,175,55,0.12)] text-(--champagne)">
                          <Icon className="h-5 w-5" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-(--muted)" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-(--navy)">
                          {action.label}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-(--muted)">
                          {action.detail}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </motion.section>

        <motion.section variants={pageMotion} className="grid gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                  Recent reservation status
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                  Timeline overview
                </h3>
              </div>
              <CalendarDays className="h-5 w-5 text-(--champagne)" />
            </div>

            <div className="mt-6 space-y-3">
              {dashboardTimeline.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-(--border-soft) bg-white/70 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-(--navy)">
                        {item.value}
                      </p>
                    </div>
                    <Badge tone={item.tone}>{item.label}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.section>
      </motion.div>
    </UserLayout>
  );
};

export default Dashboard;
