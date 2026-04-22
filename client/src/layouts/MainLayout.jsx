import Navbar from "./Navbar";
import PageContainer from "./PageContainer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <PageContainer>{children}</PageContainer>
    </div>
  );
};

export default MainLayout;
