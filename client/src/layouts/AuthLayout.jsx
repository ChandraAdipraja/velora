import PageContainer from "./PageContainer";

const AuthLayout = ({ title, children }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-4 py-10 text-[var(--ink)]">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute left-[-8rem] top-[-8rem] h-[20rem] w-[20rem] rounded-full bg-[rgba(200,168,106,0.16)] blur-3xl" />
        <div className="absolute right-[-10rem] bottom-[-10rem] h-[24rem] w-[24rem] rounded-full bg-[rgba(19,34,63,0.1)] blur-3xl" />
      </div>
      <PageContainer className="max-w-xl">
        <div className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-8">
          <div className="mb-6 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--champagne)]">
              Velora Hotel Kit
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--navy)] sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Premium access for guests, concierge staff, and administrators.
            </p>
          </div>

          {children}
        </div>
      </PageContainer>
    </div>
  );
};

export default AuthLayout;
