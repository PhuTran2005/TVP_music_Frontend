import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
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
export default DefaultLayout;
