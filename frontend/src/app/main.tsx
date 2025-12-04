import { createRoot } from "react-dom/client";
import { store } from "@/store/store";
import { injectStore } from "@/lib/axios"; // <--- Đổi hàm này
import React from "react";
import { AppWithRouter } from "@/app/providers.tsx";
import "@/index.css";
// ✅ Inject toàn bộ Store vào Axios (Cung cấp cả dispatch và getState)
injectStore(store);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>
);
