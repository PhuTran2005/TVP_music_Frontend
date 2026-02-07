/**
 * @file providers.tsx
 * @description Wrapper Component chứa toàn bộ các Global Providers của ứng dụng.
 * @architecture
 * - ReduxProvider: State Management.
 * - PersistGate: Chặn render UI cho đến khi State được khôi phục từ LocalStorage (F5 không mất nhạc).
 * - QueryClientProvider: Server State (TanStack Query).
 * - SocketProvider: Realtime Connection.
 * - ThemeProvider: Dark/Light mode.
 */

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

// --- Internal Modules ---
import { store, persistor } from "@/store/store";
import { queryClient } from "@/lib/queryClient";

// --- Components ---
import { EqualizerLoader } from "@/components/ui/MusicLoadingEffects";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SocketProvider } from "@/app/provider/SocketProvider";

// ============================================================================
// 1. APP PROVIDERS (Global Context Wrappers)
// ============================================================================

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ReduxProvider store={store}>
    {/**
     * @component PersistGate
     * @ux Hiển thị EqualizerLoader trong lúc chờ Redux lấy dữ liệu từ LocalStorage.
     * Điều này ngăn chặn việc UI bị "nháy" (FOUC) hoặc hiển thị sai trạng thái login/player.
     */}
    <PersistGate
      loading={<EqualizerLoader fullscreen text="Đang khôi phục dữ liệu..." />}
      persistor={persistor}
    >
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          {/* ThemeProvider quản lý Class 'dark'/'light' trên thẻ HTML */}
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {children}
            {/* Toast Notification global setting */}
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
        </SocketProvider>
      </QueryClientProvider>
    </PersistGate>
  </ReduxProvider>
);
