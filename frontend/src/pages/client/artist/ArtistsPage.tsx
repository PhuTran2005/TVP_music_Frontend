import { Sparkles } from "lucide-react";

// --- Components ---
import Pagination from "@/utils/pagination";
import MusicResult from "@/components/ui/Result";
import CardSkeleton from "@/components/ui/CardSkeleton";
import PublicArtistCard from "@/features/artist/components/PublicArtistCard";
// Giả định bạn có bộ lọc dành riêng cho public (nhẹ nhàng hơn admin)

// --- Hooks ---
import { useArtistParams } from "@/features/artist/hooks/useArtistParams";
import { useArtistsQuery } from "@/features/artist/hooks/useArtistsQuery";
import { PublicArtistFilters } from "@/features/artist/components/PublicArtistFilters";
import { APP_CONFIG } from "@/config/constants";

const ArtistPage = () => {
  // --- 1. STATE QUẢN LÝ QUA URL (Chuẩn SEO & UX) ---
  // Mặc định load 24 nghệ sĩ 1 trang cho user tha hồ lướt
  const {
    filterParams,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    clearFilters,
  } = useArtistParams(APP_CONFIG.PAGINATION_LIMIT);

  // --- 2. DATA FETCHING (Public API) ---
  // Sử dụng hook query public (chỉ lấy nghệ sĩ isPublic/isActive)
  const { data, isLoading, isError } = useArtistsQuery(filterParams);
  console.log(data);
  // Bóc tách data an toàn
  const artists = data?.artists || [];
  const meta = data?.meta || {
    totalPages: 1,
    totalItems: 0,
    page: 1,
    pageSize: 24,
  };

  // --- 3. ERROR STATE ---
  if (isError) {
    return (
      <div className="container mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="min-h-[70vh] flex items-center justify-center ">
          <MusicResult
            status="error"
            title="Không thể tải danh sách Artist"
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

  return (
    <div className="relative min-h-screen pb-24">
      {/* ================= BACKGROUND GRADIENT (Vibe Âm nhạc) ================= */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] bg-gradient-to-b from-primary/10 via-background/80 to-background pointer-events-none -z-10" />

      {/* ================= HERO HEADER ================= */}
      <header className="container mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="flex flex-col gap-3 max-w-2xl animate-in slide-in-from-bottom-4 fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary w-fit text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="size-3.5" />
            <span>Khám phá</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            Nghệ sĩ nổi bật
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium">
            Tìm kiếm, theo dõi và lắng nghe những giọng ca hàng đầu đang định
            hình xu hướng âm nhạc thế giới.
          </p>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="container mx-auto px-4 sm:px-6 space-y-8">
        {/* --- FILTERS --- */}
        <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40">
          {/* Note: PublicArtistFilters nên thiết kế mỏng gọn hơn AdminFilters (chỉ gồm Search, Thể loại, Sắp xếp) */}
          <PublicArtistFilters
            params={filterParams}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onReset={clearFilters}
          />
        </div>

        {/* --- ARTISTS GRID --- */}
        <div className="min-h-[50vh]">
          {isLoading ? (
            // 🔥 UX: Skeleton phải được bọc trong Grid giống hệt đồ thật để không bị giật Layout
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {/* Artist card thường có hình tròn, nếu CardSkeleton của bạn là hình vuông thì update CSS cho tròn nhé */}
              <CardSkeleton
                count={meta.pageSize}
                className="rounded-full aspect-square"
              />
            </div>
          ) : artists.length === 0 ? (
            // Trạng thái trống
            <div className="flex flex-col items-center justify-center bg-muted/20 rounded-3xl border border-dashed border-border/50">
              <MusicResult
                status="empty"
                title="Không tìm thấy nghệ sĩ nào"
                description={`Không có kết quả nào phù hợp với tìm kiếm "${filterParams.keyword || "hiện tại"}".`}
              />
            </div>
          ) : (
            // Lưới dữ liệu thật
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 animate-in fade-in duration-700">
              {artists.map((artist, index) => (
                <div
                  key={artist._id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-in zoom-in-95 fill-mode-both"
                >
                  <PublicArtistCard artist={artist} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- PAGINATION --- */}
        {!isLoading && artists.length > 0 && (
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

export default ArtistPage;
