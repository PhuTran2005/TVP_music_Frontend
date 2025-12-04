import { Footer } from "@/layouts/client/components/Footer";
import { Header } from "@/layouts/client/components/Header";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pb-24">
          <Outlet />
        </main>
        <Footer />
        <MusicPlayer />
      </div>
    </>
  );
};
export default ClientLayout;
