import React from "react";
import { Sparkles } from "lucide-react";
import { APP_CONFIG } from "@/config/constants";

// Components
import { GenreCard } from "@/features/genre/components/GenreCard"; // Đảm bảo bạn có UI Card xịn xò cho Genre
import MusicResult from "@/components/ui/Result";
import Pagination from "@/utils/pagination";
import CardSkeleton from "@/components/ui/CardSkeleton";

// Hooks & Types
import { useGenreParams } from "@/features/genre/hooks/useGenreParams";
import { useGenresQuery } from "@/features/genre/hooks/useGenresQuery";
import { PublicGenreFilter } from "@/features/genre/components/PublicGenreFilters";

const GenrePage = () => {
  // --- 1. STATE QUẢN LÝ QUA URL ---
  // Tăng số lượng item/trang lên 24 (bội số của 2, 3, 4, 6) để lưới luôn đầy đặn
  const {
    filterParams,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    clearFilters,
  } = useGenreParams(24);

  // --- 2. DATA FETCHING (Public API) ---
  const { data, isLoading, isError } = useGenresQuery(filterParams);

  const genres = data?.genres || [];
  const meta = data?.meta || {
    totalPages: 1,
    totalItems: 0,
    page: 1,
    pageSize: 24,
  };

  // Xác định trạng thái đang lọc (để hiện nút Xóa bộ lọc nếu mảng rỗng)
  const isFiltering =
    !!filterParams.keyword ||
    (filterParams.sort && filterParams.sort !== "priority") ||
    filterParams.isTrending !== undefined;

  // --- 3. ERROR STATE ---
  if (isError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="min-h-[70vh] flex items-center justify-center ">
          <MusicResult
            status="error"
            title="Không thể tải danh sách Genre"
            description="Đã có lỗi xảy ra từ máy chủ. Vui lòng kiểm tra đường truyền và thử lại."
            secondaryAction={{
              label: "Tải lại trang",
              onClick: () => window.location.reload(),
            }}
          />
        </div>
      </div>
    );
  }

  // --- 4. RENDER UI CAO CẤP ---
  return (
    <div className="relative min-h-screen pb-24">
      {/* ================= BACKGROUND GRADIENT ================= */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-primary/10 via-background/80 to-background pointer-events-none -z-10" />

      {/* ================= HERO HEADER ================= */}
      <header className="container mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="flex flex-col gap-3 max-w-2xl animate-in slide-in-from-bottom-4 fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="size-3.5" />
            <span>Khám phá</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            Thể loại & Tâm trạng
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium">
            Tìm kiếm giai điệu hoàn hảo cho mọi khoảnh khắc. Từ Pop sôi động đến
            Lofi nhẹ nhàng, tất cả đều có ở đây.
          </p>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="container mx-auto px-4 sm:px-6 space-y-8">
        {/* --- STICKY FILTERS --- */}
        <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40 transition-all">
          <PublicGenreFilter
            params={filterParams}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onReset={clearFilters}
          />
        </div>

        {/* --- GENRE GRID --- */}
        <div className="min-h-[50vh]">
          {isLoading ? (
            // 🔥 UX: Grid Skeleton khớp chuẩn 100% với Grid dữ liệu thật
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              <CardSkeleton count={meta.pageSize} />
            </div>
          ) : genres.length === 0 ? (
            // Trạng thái trống (Empty State)
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-dashed border-border shadow-sm animate-in fade-in duration-500">
              <MusicResult
                status="empty"
                title="Không tìm thấy Thể loại nào"
                description={
                  filterParams.keyword
                    ? `Không có kết quả nào phù hợp với tìm kiếm "${filterParams.keyword}".`
                    : "Hiện tại hệ thống chưa có dữ liệu thể loại phù hợp với tiêu chí của bạn."
                }
                secondaryAction={
                  isFiltering
                    ? { label: "Xóa tìm kiếm", onClick: clearFilters }
                    : undefined
                }
              />
            </div>
          ) : (
            // Lưới hiển thị thật (Data Grid)
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {genres.map((genre, index) => (
                <div
                  key={genre._id}
                  // Hiệu ứng "Thác nước": Mục sau xuất hiện trễ hơn mục trước 30ms (Nhanh hơn album vì genre card thường nhỏ)
                  style={{ animationDelay: `${index * 30}ms` }}
                  className="animate-in zoom-in-95 fade-in duration-500 fill-mode-both"
                >
                  <GenreCard genre={genre} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- PAGINATION --- */}
        {!isLoading && genres.length > 0 && (
          <div className="pt-6">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
              totalItems={meta.totalItems}
              itemsPerPage={meta.pageSize || APP_CONFIG.PAGINATION_LIMIT}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default GenrePage;
