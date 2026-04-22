import Navbar from "./Navbar";
import PageContainer from "./PageContainer";

const DashboardLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <PageContainer className="py-6">
        {title && (
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Kelola aktivitas hotel dengan lebih mudah
            </p>
          </div>
        )}

        {children}
      </PageContainer>
    </div>
  );
};

export default DashboardLayout;
