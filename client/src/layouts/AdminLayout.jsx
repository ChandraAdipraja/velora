import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ChevronRight,
  Home,
  MessageSquareText,
  LogOut,
  PanelLeft,
  Users2,
  Building2,
  CalendarRange,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Home },
  { to: "/admin/users", label: "User Management", icon: Users2 },
  { to: "/admin/rooms", label: "Rooms Management", icon: Building2 },
  { to: "/admin/reservations", label: "Reservations", icon: CalendarRange },
  { to: "/admin/reports", label: "Transaction Reports", icon: BarChart3 },
  { to: "/admin/chat", label: "Chat Logs", icon: MessageSquareText },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f1e8] text-[#12213d]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[16rem] border-r border-white/70 bg-[#0f1c34] px-5 py-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.25)] md:flex md:flex-col">
        <div className="flex items-center gap-3 border-b border-white/10 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c8a86a] text-white shadow-[0_16px_30px_rgba(200,168,106,0.3)]">
            <PanelLeft className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#d4c09c]">
              Velora Hotel
            </p>
            <h1 className="mt-1 text-xl font-semibold">Admin Control</h1>
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-2 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-white/12 text-white shadow-[0_16px_30px_rgba(0,0,0,0.14)]"
                      : "text-white/72 hover:bg-white/8 hover:text-white",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">
                      <span
                        className={[
                          "flex h-9 w-9 items-center justify-center rounded-xl border transition",
                          isActive
                            ? "border-[#d6b87a]/30 bg-[#c8a86a] text-white"
                            : "border-white/10 bg-white/5 text-[#d4c09c] group-hover:bg-white/10",
                        ].join(" ")}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{item.label}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-white" />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10 hover:text-white"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#d4c09c] transition group-hover:bg-white/10">
                <LogOut className="h-4 w-4" />
              </span>
              <span>Logout</span>
            </span>
            <ChevronRight className="h-4 w-4 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-white" />
          </button>
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 border-b border-white/70 bg-[rgba(246,241,232,0.8)] backdrop-blur-xl">
          <div className="flex justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8b7a58]">
                Luxury hospitality operations
              </p>
              <p className="mt-1 max-w-2xl text-sm text-[#5e6b81]">
                Admin workspace for bookings, users, rooms, and revenue.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start xl:self-auto">
              <div className="hidden rounded-full border border-[#e5d7bd] bg-white/80 px-4 py-2 text-sm text-[#12213d] shadow-sm md:block">
                April 2026 · Live property sync
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#12213d] text-white shadow-[0_16px_30px_rgba(15,23,42,0.18)]">
                VH
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
