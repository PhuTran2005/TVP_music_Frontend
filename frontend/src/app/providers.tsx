// src/app/providers.tsx
import React, { Suspense } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";

import { router } from "@/app/routes/route"; // ✅ Import router object mới
import { queryClient } from "@/lib/queryClient";
import { EqualizerLoader } from "@/components/ui/MusicLoadingEffects";
import { Toaster } from "sonner";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      {/* 2. ĐẶT TOASTER Ở ĐÂY (Nên đặt cuối cùng để đè lên mọi thứ) */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="dark" // App bạn màu tối nên để theme dark cho đẹp
      />
    </QueryClientProvider>
  </ReduxProvider>
);

export const AppWithRouter = () => (
  <AppProviders>
    <Suspense
      fallback={<EqualizerLoader fullscreen text="Đang tải ứng dụng..." />}
    >
      {/* ✅ RouterProvider nhận router object, không phải component */}
      <RouterProvider router={router} />
    </Suspense>
  </AppProviders>
);
