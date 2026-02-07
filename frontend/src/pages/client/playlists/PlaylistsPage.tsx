import { useState, useEffect } from "react";
import { APP_CONFIG } from "@/config/constants";

// Components
import PageHeader from "@/components/ui/PageHeader";
import CardSkeleton from "@/components/ui/CardSkeleton";
import Pagination from "@/utils/pagination";
import MusicResult from "@/components/ui/Result";

// Feature Components
import PlaylistFilter from "@/features/playlist/components/PlaylistFilter";

// Hooks & Types
import { usePlaylistAdmin } from "@/features/playlist/hooks/usePlaylistAdmin";
import { useDebounce } from "@/hooks/useDebounce";
import { type Playlist } from "@/features/playlist/types";
import PublicPlaylistCard from "@/features/playlist/components/PublicPlaylistCard";

const PlaylistPage = () => {
  // --- HOOKS ---
  const {
    playlists,
    meta,
    isLoading,
    filterParams,
    setFilterParams,

    handlePageChange,
  } = usePlaylistAdmin(APP_CONFIG.PAGINATION_LIMIT || 12);

  // --- SEARCH ---
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFilterParams((prev) => {
      if (prev.keyword === debouncedSearch) return prev;
      return { ...prev, keyword: debouncedSearch, page: 1 };
    });
  }, [debouncedSearch, setFilterParams]);

  const totalPages = meta.totalPages || 1;
  const totalItems = meta.totalItems || 0;
  const pageSize = meta.pageSize || APP_CONFIG.PAGINATION_LIMIT;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* --- HEADER --- */}
      <PageHeader title="Playlists" />

      {/* --- FILTER --- */}
      <PlaylistFilter params={filterParams} setParams={setFilterParams} />

      {/* 🔥 FIX: Added mx-auto */}
      <section className="container mx-auto px-4 sm:px-6 py-2">
        {isLoading ? (
          <CardSkeleton count={pageSize} />
        ) : playlists.length > 0 ? (
          <div
            className="
              grid gap-6
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              2xl:grid-cols-6
              animate-in fade-in duration-500
            "
          >
            {playlists.map((playlist: Playlist) => (
              <PublicPlaylistCard key={playlist._id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center py-20">
            <MusicResult
              status="empty"
              title="No playlists found"
              description="Try adjusting filters or create a new playlist."
            />
          </div>
        )}
      </section>

      {/* ================= PAGINATION ================= */}
      {!isLoading && playlists.length > 0 && (
        <section>
          {/* 🔥 FIX: Added mx-auto */}
          <div className="container mx-auto px-4 sm:px-6 py-6 flex justify-center">
            <Pagination
              currentPage={meta.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={pageSize}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default PlaylistPage;
