import Navbar from "./Navbar";
import PageContainer from "./PageContainer";
import HotelAssistantWidget from "../components/home/HotelAssistantWidget";

const MainLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-(--background) text-(--ink)">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute -left-48 -top-40 h-104 w-104 rounded-full bg-[rgba(200,168,106,0.18)] blur-3xl" />
        <div className="absolute -right-40 top-32 h-96 w-96 rounded-full bg-[rgba(19,34,63,0.09)] blur-3xl" />
        <div className="absolute inset-0 velora-grid opacity-[0.34]" />
      </div>
      <Navbar />
      <PageContainer>{children}</PageContainer>
      <HotelAssistantWidget />
    </div>
  );
};

export default MainLayout;
