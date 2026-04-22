import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../layouts/MainLayout";

const Home = () => {
  const { authUser } = useAuth();

  return (
    <MainLayout>
      <section className="py-10">
        <div className="rounded-3xl bg-white p-6 shadow-sm lg:p-10">
          <p className="text-sm font-medium text-slate-500">
            Selamat Datang di
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 lg:text-5xl">
            Velora Hotel
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 lg:text-base">
            Sistem reservasi hotel berbasis web dengan pengaturan waktu check-in
            dan check-out yang fleksibel, fitur chat layanan, dan pengelolaan
            reservasi yang terintegrasi.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {authUser ? (
              <Link
                to="/redirect"
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
              >
                Masuk ke Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
