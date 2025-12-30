import { usePlayerPadding } from "@/hooks/usePlayerPadding";
import { Footer } from "@/layouts/client/components/Footer";
import { Header } from "@/layouts/client/components/Header";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  // 1. Gọi hook lấy padding (Ví dụ player cao 90px + khoảng cách an toàn)
  // Lưu ý: Class trả về thường là 'pb-[150px]'
  const playerPaddingClass = usePlayerPadding(120);

  return (
    <div
      className={cn(
        // --- LAYOUT CHUẨN ---
        "relative flex min-h-screen flex-col",

        // --- THEME COLORS (Chuẩn index.css) ---
        "bg-background text-foreground font-sans antialiased",

        // --- PLAYER PADDING ---
        // Áp dụng padding-bottom cho container tổng để Footer không bị Player che
        playerPaddingClass
      )}
    >
      <Header />

      {/* flex-1: Đẩy Footer xuống đáy nếu nội dung ngắn.
        w-full: Đảm bảo content không bị co lại.
      */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />

      {/* Player thường nằm ở đây hoặc render qua Portal */}
    </div>
  );
};

export default ClientLayout;
