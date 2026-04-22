import DashboardLayout from "../../layouts/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard Pengurus">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Reservasi Masuk
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Pantau reservasi baru dan lakukan update status reservasi.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Chat Room</h2>
          <p className="mt-2 text-sm text-slate-500">
            Layani pertanyaan pelanggan dan komunikasi setelah reservasi.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Layanan Pelanggan
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Bantu pelanggan terkait permintaan tambahan dan informasi kamar.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
