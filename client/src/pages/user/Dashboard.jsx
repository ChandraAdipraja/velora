import DashboardLayout from "../../layouts/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard User">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Cari Kamar</h2>
          <p className="mt-2 text-sm text-slate-500">
            Temukan kamar sesuai waktu check-in dan check-out yang kamu
            inginkan.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Reservasi Saya
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Lihat status reservasi dan histori pemesanan kamar kamu.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Chat Layanan
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Hubungi pengurus hotel untuk bantuan sebelum atau sesudah reservasi.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
