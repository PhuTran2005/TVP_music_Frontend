import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/store";

import { useInitAuth } from "@/features/auth";
import { PulseLoader } from "@/components/ui/MusicLoadingEffects";
const RootLayout = () => {
  const { isAuthChecking } = useAppSelector((state) => state.auth);
  useInitAuth();

  if (isAuthChecking) {
    return <PulseLoader fullscreen text="Đang xác thực người dùng..." />;
  }
  return <Outlet />;
};

export default RootLayout;
