import PageContainer from "./PageContainer";
import { CalendarDays, MessageSquareText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    to: "/pengurus/dashboard#reservations",
    label: "Reservations",
    icon: CalendarDays,
  },
  {
    to: "/pengurus/dashboard#support",
    label: "Support Tickets",
    icon: MessageSquareText,
  },
];

const DashboardLayout = ({ title, children }) => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen overflow-hidden bg-(--background) text-(--ink)">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute -left-40 -top-48 h-96 w-96 rounded-full bg-[rgba(19,34,63,0.08)] blur-3xl" />
        <div className="absolute -right-48 top-24 h-112 w-md rounded-full bg-[rgba(200,168,106,0.16)] blur-3xl" />
        <div className="absolute inset-0 velora-grid opacity-[0.24]" />
      </div>

      <aside className="fixed left-0 top-1/2 z-40 -translate-y-1/2">
        <div className="ml-2 w-16 rounded-[28px] border border-(--border-soft) bg-[rgba(255,255,255,0.86)] p-2 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:ml-3 sm:w-20 sm:p-3">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === "/pengurus/dashboard"
                  ? location.pathname === "/pengurus/dashboard" &&
                    !location.hash
                  : location.hash === item.to.split("#")[1]?.trim();

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    isActive
                      ? "flex items-center gap-3 rounded-2xl bg-(--navy) px-3 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(15,23,42,0.18)] sm:px-4"
                      : "flex items-center gap-3 rounded-2xl bg-white/70 px-3 py-3 text-sm font-semibold text-(--navy) transition hover:bg-white sm:px-4"
                  }
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-(--border-soft) bg-[rgba(200,168,106,0.12)] text-(--champagne)">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      <PageContainer className="py-8 pl-20 lg:py-10 sm:pl-24 xl:pl-32">
        {title && (
          <div className="mb-6 max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-(--champagne)">
              Velora Hotel Kit
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-(--navy) sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-sm leading-7 text-(--muted) sm:text-base">
              Operations view for reservations, ticket ownership, and daily
              guest service across the property.
            </p>
          </div>
        )}

        {children}
      </PageContainer>
    </div>
  );
};

export default DashboardLayout;
