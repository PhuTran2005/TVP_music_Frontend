import { useState } from "react";

// Hooks
import { useAdminArtists } from "@/features/artist/hooks/index";
import { useDebounce } from "@/hooks/useDebounce";
import { APP_CONFIG } from "@/config/constants";

// Components
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/utils/pagination";
import MusicResult from "@/components/ui/Result";

import CardSkeleton from "@/components/ui/CardSkeleton";

import type { Artist, ArtistFilterParams } from "@/features/artist/types";
import { ArtistFilters } from "@/features/artist/components/ArtistFilters";
import PublicArtistCard from "@/features/artist/components/PublicArtistCard";

const ArtistPage = () => {
  // --- STATE ---
  const [params, setParams] = useState<ArtistFilterParams>({
    page: 1,
    limit: 12,
    keyword: "",
    isActive: undefined,
    isVerified: undefined,
    genreId: undefined,
  });

  const debouncedKeyword = useDebounce(params.keyword || "", 500);

  // --- API ---
  const { data, isLoading, isError } = useAdminArtists({
    ...params,
    keyword: debouncedKeyword,
    genreId: params.genreId,
  });

  const artists = data?.data.data || [];
  const totalPages = data?.data.meta.totalPages || 1;
  const totalItems = data?.data.meta.totalItems || 0;
  const pageSize = data?.data.meta.pageSize || APP_CONFIG.PAGINATION_LIMIT;

  if (isError) {
    return (
      <div className="py-20">
        <MusicResult
          status="error"
          title="Failed to load artists"
          description="Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <PageHeader title="Artists Management" />

      {/* FILTER */}
      <ArtistFilters params={params} setParams={setParams} />

      {/* ================= CONTENT ================= */}
      {/* 🔥 FIX: Added mx-auto */}
      <section className="container mx-auto px-4 sm:px-6 py-12">
        {isLoading ? (
          <CardSkeleton count={pageSize} />
        ) : artists.length === 0 ? (
          <div className="flex justify-center py-20">
            <MusicResult
              status="empty"
              title="No artists found"
              description="Try adjusting filters or search criteria."
              secondaryAction={{
                label: "Clear Filters",
                onClick: () =>
                  setParams({
                    page: 1,
                    limit: APP_CONFIG.PAGINATION_LIMIT || 12,
                    keyword: "",
                  }),
              }}
            />
          </div>
        ) : (
          <div
            className="
              grid gap-6
              grid-cols-1
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              2xl:grid-cols-6
              animate-in fade-in duration-500
            "
          >
            {artists.map((artist) => (
              <PublicArtistCard key={artist._id} artist={artist} />
            ))}
          </div>
        )}
      </section>

      {/* ================= PAGINATION ================= */}
      {!isLoading && artists.length > 0 && (
        <section>
          {/* 🔥 FIX: Added mx-auto */}
          <div className="container mx-auto px-4 sm:px-6 py-6 flex justify-center">
            <Pagination
              currentPage={params.page || 1}
              totalPages={totalPages}
              onPageChange={(page) => setParams((prev) => ({ ...prev, page }))}
              totalItems={totalItems}
              itemsPerPage={pageSize}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default ArtistPage;
