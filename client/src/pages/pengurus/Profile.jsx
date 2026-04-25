import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Mail, ShieldCheck, Ticket, UserRound } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import PengurusLayout from "../../layouts/PengurusLayout";
import {
  GlassCard,
  MetricCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { getAllReservationsForStaff } from "../../services/reservationService";
import {
  getMyAssignedTickets,
  getOpenTickets,
} from "../../services/ticketService";

const Profile = () => {
  const { authUser, token } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [openTickets, setOpenTickets] = useState([]);
  const [myTickets, setMyTickets] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [reservationData, openTicketData, myTicketData] =
          await Promise.all([
            getAllReservationsForStaff(token),
            getOpenTickets(token),
            getMyAssignedTickets(token),
          ]);

        setReservations(reservationData.reservations || []);
        setOpenTickets(openTicketData.tickets || []);
        setMyTickets(myTicketData.tickets || []);
      } catch (error) {
        console.error("Failed to load pengurus profile:", error);
      }
    };

    if (token) fetchProfileData();
  }, [token]);

  const pendingReservations = useMemo(
    () => reservations.filter((item) => item.status === "pending"),
    [reservations],
  );

  const activeReservations = useMemo(
    () =>
      reservations.filter((item) =>
        ["confirmed", "checked_in"].includes(item.status),
      ),
    [reservations],
  );

  const staffName = authUser?.name || "Pengurus";
  const staffEmail = authUser?.email || "-";

  const profileHighlights = [
    {
      label: "Staff Name",
      value: staffName,
      icon: Crown,
    },
    {
      label: "Role",
      value: authUser?.role || "pengurus",
      icon: ShieldCheck,
    },
    {
      label: "Email",
      value: staffEmail,
      icon: Mail,
    },
    {
      label: "Assigned Tickets",
      value: myTickets.length,
      icon: Ticket,
    },
  ];

  return (
    <PengurusLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section variants={pageMotion}>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-(--muted)">
                  Staff details
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-(--navy)">
                  Profile essentials
                </h3>
              </div>
              <UserRound className="h-5 w-5 text-(--champagne)" />
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

            <div className="mt-6 rounded-2xl border border-(--border-soft) bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-(--muted)">
                Contact
              </p>

              <div className="mt-3 flex items-center gap-2 text-sm text-(--muted)">
                <Mail className="h-4 w-4 text-(--champagne)" />
                {staffEmail}
              </div>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 md:grid-cols-3"
        >
          <MetricCard
            label="Pending reservations"
            value={pendingReservations.length}
            detail="Need staff approval"
          />

          <MetricCard
            label="Active reservations"
            value={activeReservations.length}
            detail="Confirmed or checked-in guests"
          />

          <MetricCard
            label="Open queue tickets"
            value={openTickets.length}
            detail="Waiting for staff ownership"
          />
        </motion.section>
      </motion.div>
    </PengurusLayout>
  );
};

export default Profile;
