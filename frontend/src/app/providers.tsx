// src/app/providers.tsx
import React, { Suspense } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";

import { router } from "@/app/routes/route";
import { queryClient } from "@/lib/queryClient";
import { EqualizerLoader } from "@/components/ui/MusicLoadingEffects";

// 1. Import ThemeProvider mới tạo
import { ThemeProvider } from "@/components/providers/theme-provider";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ReduxProvider store={store}>
    <QueryClientProvider client={queryClient}>
      {/* 2. Bọc ThemeProvider vào đây để quản lý Class HTML */}
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        {children}

        {/* {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} */}

        {/* 3. Cập nhật Toaster */}
        {/* Xóa dòng theme="dark" để nó tự ăn theo CSS class của hệ thống */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          // theme="system" // Nếu thư viện sonner bản mới hỗ trợ prop này thì có thể thêm, không thì để mặc định nó sẽ tự theo CSS
        />
      </ThemeProvider>
    </QueryClientProvider>
  </ReduxProvider>
);

export const AppWithRouter = () => (
  <AppProviders>
    <Suspense
      fallback={<EqualizerLoader fullscreen text="Đang tải ứng dụng..." />}
    >
      <RouterProvider router={router} />
    </Suspense>
  </AppProviders>
);
