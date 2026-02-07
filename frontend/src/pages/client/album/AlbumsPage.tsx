import { APP_CONFIG } from "@/config/constants";

// Components
import PageHeader from "@/components/ui/PageHeader";
import AlbumFilter from "@/features/album/components/AlbumFilter";
import PublicAlbumCard from "@/features/album/components/PublicAlbumCard";
import MusicResult from "@/components/ui/Result";
import Pagination from "@/utils/pagination";
import CardSkeleton from "@/components/ui/CardSkeleton";

// Hooks & Types
import { useAlbumParams } from "@/features/album/hooks/useAlbumParams";
import { useAlbumsQuery } from "@/features/album/hooks/useAlbumsQuery";

const AlbumPage = () => {
  // --- 1. STATE MANAGEMENT (URL Source of Truth) ---
  // Client luôn mặc định chỉ xem được public, hoặc tùy backend xử lý
  const {
    filterParams,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    clearFilters,
  } = useAlbumParams(APP_CONFIG.PAGINATION_LIMIT || 12);

  // --- 2. DATA FETCHING ---
  const { data, isLoading } = useAlbumsQuery({
    ...filterParams,
    // Nếu API public/albums riêng thì không cần dòng này
    // Nếu dùng chung API getAll, cần ép buộc chỉ lấy public
    isPublic: true,
  });

  // Safe Access Data
  const albums = data?.albums || [];
  const meta = data?.meta || {
    totalPages: 1,
    totalItems: 0,
    page: 1,
    pageSize: 12,
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Khám phá Albums"
          subtitle="Tuyển tập những album hot nhất đang chờ bạn thưởng thức."
        />

        {/* --- FILTER --- */}
        <AlbumFilter
          params={filterParams}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onReset={clearFilters}
        />
      </div>

      {/* --- CONTENT SECTION --- */}
      <section className="min-h-[400px]">
        {isLoading ? (
          // 🔥 Skeleton Grid phải khớp hoàn toàn với Grid thật bên dưới
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
            <CardSkeleton count={12} />
          </div>
        ) : albums.length > 0 ? (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 animate-in fade-in duration-500">
            {albums.map((album) => (
              <PublicAlbumCard
                key={album._id}
                album={album}
                // Có thể thêm prop như aspect-ratio nếu PublicAlbumCard hỗ trợ
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="py-20 bg-muted/10 rounded-3xl border border-dashed border-border/50">
            <MusicResult
              status="empty"
              title="Không tìm thấy album nào"
              description="Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn xem sao."
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={clearFilters}
                className="text-primary hover:underline text-sm font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}
      </section>

      {/* --- PAGINATION --- */}
      {!isLoading && albums.length > 0 && (
        <div className="pt-6 border-t border-border">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
            totalItems={meta.totalItems}
            itemsPerPage={meta.pageSize || APP_CONFIG.PAGINATION_LIMIT}
          />
        </div>
      )}
    </div>
  );
};

export default AlbumPage;
