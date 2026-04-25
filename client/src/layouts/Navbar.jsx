import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CalendarDays, LogOut, Sparkles } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const { authUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!authUser) return "/";
    if (authUser.role === "admin") return "/admin/dashboard";
    if (authUser.role === "pengurus") return "/pengurus/dashboard";
    return "/user/dashboard";
  };

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/70 px-4 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.1)] backdrop-blur-2xl sm:px-5">
        <div className="flex items-center gap-4">
          <Link to={getDashboardPath()} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--navy)] text-white shadow-[0_12px_24px_rgba(19,34,63,0.2)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-[0.24em] text-[var(--navy)] uppercase">
                Velora
              </span>
              <span className="block text-xs text-[var(--muted)]">
                Hotel Kit
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 lg:flex">
            <Link
              to="/rooms"
              className="rounded-full px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--champagne-soft)] hover:text-[var(--navy)]"
            >
              Rooms
            </Link>
            <Link
              to="/booking"
              className="rounded-full px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--champagne-soft)] hover:text-[var(--navy)]"
            >
              Booking Desk
            </Link>
            <Link
              to="/profile"
              className="rounded-full px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--champagne-soft)] hover:text-[var(--navy)]"
            >
              Guest Profile
            </Link>
            <Link
              to="/admin/analytics"
              className="rounded-full px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--champagne-soft)] hover:text-[var(--navy)]"
            >
              Analytics
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {authUser ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-[var(--navy)]">
                  {authUser.name}
                </p>
                <p className="text-xs capitalize text-[var(--muted)]">
                  {authUser.role}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#0f1c34]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full bg-[var(--champagne)] px-4 py-2 text-sm font-medium text-white shadow-[0_18px_40px_rgba(200,168,106,0.24)] transition hover:-translate-y-0.5 hover:bg-[#b8914d]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-white/70 px-4 py-2 text-sm font-medium text-[var(--navy)] transition hover:bg-white"
              >
                <CalendarDays className="h-4 w-4" />
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
