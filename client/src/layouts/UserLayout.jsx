import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BedDouble,
  CalendarDays,
  LayoutGrid,
  LogOut,
  MessageSquareText,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PageContainer from "./PageContainer";

const navItems = [
  { to: "/user/dashboard", label: "Home", icon: LayoutGrid },
  { to: "/user/rooms", label: "Rooms", icon: BedDouble },
  { to: "/user/my-reservations", label: "Reservations", icon: CalendarDays },
  { to: "/user/tickets", label: "Chat", icon: MessageSquareText },
  { to: "/user/profile", label: "Profile", icon: UserRound },
];

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const { authUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f1e8] text-[#12213d]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[18rem] flex-col border-r border-white/70 bg-[#0f1c34] px-5 py-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.24)] md:flex">
        <div className="flex items-center gap-3 border-b border-white/10 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4af37] text-white shadow-[0_16px_30px_rgba(212,175,55,0.28)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#e2cf9f]">
              Velora Hotel
            </p>
            <h1 className="mt-1 text-xl font-semibold">Guest Suite</h1>
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
                            ? "border-[#d4af37]/30 bg-[#d4af37] text-white"
                            : "border-white/10 bg-white/5 text-[#e2cf9f] group-hover:bg-white/10",
                        ].join(" ")}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{item.label}</span>
                    </span>
                    <span className="h-2 w-2 rounded-full bg-white/20" />
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
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#e2cf9f] transition">
                <LogOut className="h-4 w-4" />
              </span>
              <span>Logout</span>
            </span>
          </button>
        </div>
      </aside>

      <div className="md:pl-72">
        <main className="pb-28 pt-6 md:pb-10 md:pt-8">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/70 bg-[rgba(255,255,255,0.92)] px-3 py-2 shadow-[0_-10px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition",
                    isActive
                      ? "bg-[#0f1c34] text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)]"
                      : "text-[#667085]",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default UserLayout;
