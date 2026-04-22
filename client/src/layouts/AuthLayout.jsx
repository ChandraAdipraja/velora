import PageContainer from "./PageContainer";

const AuthLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <PageContainer className="max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-500 mt-1">
              Selamat datang di Velora Hotel
            </p>
          </div>

          {children}
        </div>
      </PageContainer>
    </div>
  );
};

export default AuthLayout;
