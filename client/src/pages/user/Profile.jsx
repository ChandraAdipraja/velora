import { motion } from "framer-motion";
import {
  Crown,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  WalletCards,
} from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import {
  Badge,
  GlassCard,
  MetricCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { guestProfile, profileHighlights } from "../../data/veloraDemo";

const Profile = () => {
  return (
    <UserLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section variants={pageMotion}>
          <SectionHeader label="Profile" />
        </motion.section>

        <motion.section variants={pageMotion} className="grid gap-6 ">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                  Account details
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                  Profile essentials
                </h3>
              </div>
              <Crown className="h-5 w-5 text-(--champagne)" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {profileHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-(--border-soft) bg-white/70 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(212,175,55,0.12)] text-(--champagne)">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-(--navy)">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                  Contact
                </p>
                <div className="mt-3 space-y-2 text-sm text-(--muted)">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-(--champagne)" />
                    chandra@velora.com
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-(--champagne)" />
                    +62 812 3456 7890
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-(--champagne)" />
                    Jakarta, Indonesia
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-(--border-soft) bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                  Payment method
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="font-semibold text-(--navy)">
                    Visa ending 2048
                  </span>
                  <WalletCards className="h-5 w-5 text-(--champagne)" />
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 md:grid-cols-3"
        >
          <MetricCard
            label="Support chats"
            value="18"
            detail="Messages this month"
          />
          <MetricCard
            label="Saved stays"
            value="04"
            detail="Preferred room types"
          />
          <MetricCard
            label="Repeat bookings"
            value="72%"
            detail="Return guest rate"
          />
        </motion.section>
      </motion.div>
    </UserLayout>
  );
};

export default Profile;
