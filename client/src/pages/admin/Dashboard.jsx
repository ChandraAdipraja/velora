import DashboardLayout from "../../layouts/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard Admin">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Kelola Kamar
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Tambah, ubah, dan hapus data kamar hotel.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Kelola User
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Atur akun user, pengurus, dan admin sesuai hak akses.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Laporan & Log
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Pantau transaksi dan log chat untuk evaluasi layanan hotel.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
