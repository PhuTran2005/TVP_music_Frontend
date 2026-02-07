import { useState } from "react";

import { APP_CONFIG } from "@/config/constants";

import type { GenreFilterParams } from "@/features/genre/types";
import { useGenres } from "@/features/genre/hooks/useGenreAdmin";

// --- UI Components ---

import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/utils/pagination";
import MusicResult from "@/components/ui/Result";

import GenreFilters from "@/features/genre/components/GenreFilters";
import { GenreCard } from "@/features/genre/components/GenreCard";
import CardSkeleton from "@/components/ui/CardSkeleton";

const GenrePage = () => {
  const [params, setParams] = useState<GenreFilterParams>({
    page: 1,
    limit: APP_CONFIG.PAGINATION_LIMIT,
    sort: "priority",
    keyword: "",
    status: undefined,
    parentId: undefined,
    isTrending: undefined,
  });

  const { data, isLoading, isError } = useGenres(params);

  const genreData = data?.data.data || [];
  const totalPages = data?.data.meta.totalPages || 0;
  const totalItems = data?.data.meta.totalItems || 0;

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  if (isError) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <MusicResult
          status="error"
          title="Failed to load genres"
          description="Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* --- HEADER --- */}
      <PageHeader title="Genres " />

      {/* --- FILTERS --- */}
      <GenreFilters params={params} setParams={setParams} />

      {/* 🔥 FIX: Added mx-auto */}
      <section className="container mx-auto px-4 sm:px-6 py-2">
        {isLoading ? (
          <CardSkeleton count={10} />
        ) : genreData.length > 0 ? (
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
            {genreData.map((genre) => (
              <GenreCard key={genre._id} genre={genre} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
            <MusicResult
              status="empty"
              title="No albums found"
              description="Try adjusting filters or create a new album to get started."
            />
          </div>
        )}
      </section>

      {/* ================= PAGINATION ================= */}
      {!isLoading && genreData.length > 0 && (
        <section>
          {/* 🔥 FIX: Added mx-auto */}
          <div className="container mx-auto px-4 sm:px-6 py-6 flex justify-center">
            <Pagination
              currentPage={data?.data.meta.page || 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={params.limit}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default GenrePage;
