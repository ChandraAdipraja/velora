import { motion } from "framer-motion";
import { CalendarDays, Sparkles, UserRound } from "lucide-react";
import PengurusLayout from "../../layouts/PengurusLayout";
import {
  GlassCard,
  MetricCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import {
  quickCards,
  staffProfile,
  todayCheckIns,
} from "../../data/pengurusData";

const Dashboard = () => {
  return (
    <PengurusLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section variants={pageMotion} className="space-y-8">
          <SectionHeader
            label="Luxury Hospitality Operations"
            title="Pengurus overview dashboard"
            description="Daily operations snapshot for concierge coordination, check-in timing, and shift priorities."
          />

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              label="Check-In Today"
              value={todayCheckIns.length}
              detail="Front desk and housekeeping alignment"
              icon={CalendarDays}
            />
            <MetricCard
              label="Shift Lead"
              value={staffProfile.name}
              detail={staffProfile.role}
              icon={UserRound}
            />
            <MetricCard
              label="Active Priorities"
              value={quickCards.length}
              detail="Operational cards under monitoring"
              icon={Sparkles}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <GlassCard className="p-5 sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-(--muted)">
                Today check-in focus
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                Arrival coordination board
              </h3>

              <div className="mt-6 overflow-hidden rounded-[28px] border border-(--border-soft) bg-white/75">
                <div className="grid grid-cols-[1.1fr_0.8fr_1fr] gap-3 border-b border-(--border-soft) px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-(--muted)">
                  <span>Guest</span>
                  <span>Room</span>
                  <span>Notes</span>
                </div>
                <div className="divide-y divide-(--border-soft)">
                  {todayCheckIns.map(([guest, room, note]) => (
                    <div
                      key={`${guest}-${room}`}
                      className="grid grid-cols-[1.1fr_0.8fr_1fr] gap-3 px-4 py-4 text-sm"
                    >
                      <p className="font-semibold text-(--navy)">{guest}</p>
                      <p className="text-(--muted)">{room}</p>
                      <p className="text-(--muted)">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5 sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.3em] text-(--muted)">
                Shift priorities
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                Concierge operating notes
              </h3>

              <div className="mt-6 space-y-3">
                {quickCards.map(([label, value, detail]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-(--border-soft) bg-white/70 p-4"
                  >
                    <p className="text-[11px] uppercase tracking-[0.22em] text-(--muted)">
                      {label}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-(--navy)">
                      {value}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-(--muted)">
                      {detail}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.section>
      </motion.div>
    </PengurusLayout>
  );
};

export default Dashboard;
