import { useState, useEffect } from "react";
import { APP_CONFIG } from "@/config/constants";

// Components
import CardSkeleton from "@/components/ui/CardSkeleton";
import PageHeader from "@/components/ui/PageHeader";
import AlbumFilter from "@/features/album/components/AlbumFilter";

import MusicResult from "@/components/ui/Result";

// Hooks & Types
import { useDebounce } from "@/hooks/useDebounce";
import { useAlbumAdmin } from "@/features/album/hooks/useAlbumAdmin";
import Pagination from "@/utils/pagination";
import PublicAlbumCard from "@/features/album/components/PublicAlbumCard";

const AlbumManagementPage = () => {
  // --- HOOKS ---
  const {
    albums,
    meta,
    isLoading,
    filterParams,
    setFilterParams,

    handlePageChange,
  } = useAlbumAdmin(APP_CONFIG.PAGINATION_LIMIT || 12);

  // --- SEARCH ---
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFilterParams((prev) => {
      if (prev.keyword === debouncedSearchTerm) return prev;
      return { ...prev, keyword: debouncedSearchTerm, page: 1 };
    });
  }, [debouncedSearchTerm, setFilterParams]);

  console.log(albums, meta);
  const totalPages = meta.totalPages || 1;
  const totalItems = meta.totalItems || 0;
  const pageSize = meta.pageSize || APP_CONFIG.PAGINATION_LIMIT;
  console.log("Rendering AlbumPage with albums:", albums);
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* --- HEADER --- */}
      <PageHeader title="Albums" />

      {/* --- FILTER --- */}
      <AlbumFilter params={filterParams} setParams={setFilterParams} />

      {/* --- CONTENT --- */}
      {isLoading ? (
        <CardSkeleton count={8} />
      ) : albums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in fade-in duration-500">
          {albums.map((album) => (
            <PublicAlbumCard key={album._id} album={album} />
          ))}
        </div>
      ) : (
        <div className="py-12">
          <MusicResult
            status="empty"
            title="No albums found"
            description="Try adjusting your filters or create a new album to get started."
          />
        </div>
      )}

      {/* --- PAGINATION --- */}
      {!isLoading && albums.length > 0 && (
        <div className="pt-4">
          <Pagination
            currentPage={meta.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={pageSize}
          />
        </div>
      )}
    </div>
  );
};

export default AlbumManagementPage;
