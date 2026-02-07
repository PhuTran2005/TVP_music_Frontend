// src/layouts/RootLayout.tsx
import { Outlet } from "react-router-dom";
import { useInitAuth } from "@/features/auth";
import { PulseLoader } from "@/components/ui/MusicLoadingEffects";
import { MusicPlayer } from "@/features/player/components/MusicPlayer";
import { useAppSelector } from "@/store/hooks";

const RootLayout = () => {
  const { isAuthChecking } = useAppSelector((state) => state.auth);
  useInitAuth();

  if (isAuthChecking)
    return <PulseLoader fullscreen text="Đang tải dữ liệu..." />;

  return (
    <>
      <Outlet />
      {/* Player luôn nằm đè lên tất cả (position fixed trong component) */}
      <MusicPlayer />
    </>
  );
};

export default RootLayout;
