import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-4 md:max-w-2xl md:px-6 lg:max-w-6xl lg:px-8">
        <div className="flex flex-col">
          <Link
            to={getDashboardPath()}
            className="text-lg font-bold text-slate-900"
          >
            Velora Hotel
          </Link>
          <span className="text-xs text-slate-500">
            Reservation Management System
          </span>
        </div>

        <div className="flex items-center gap-3">
          {authUser ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-800">
                  {authUser.name}
                </p>
                <p className="text-xs capitalize text-slate-500">
                  {authUser.role}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-slate-700">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              >
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
