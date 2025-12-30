import { useState } from "react";
import { Plus } from "lucide-react";

// Hooks
import {
  useAdminArtists,
  useAdminDeleteArtist,
  useAdminToggleStatus,
} from "@/features/artist/hooks/index";
import { useDebounce } from "@/hooks/useDebounce";
import { APP_CONFIG } from "@/config/constants";

// Components
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/utils/pagination";
import MusicResult from "@/components/ui/Result";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import ArtistModal from "@/features/artist/components/artist-model";
import ArtistCard from "@/features/artist/components/ArtistCard";
import CardSkeleton from "@/components/ui/CardSkeleton";

import type { Artist, ArtistFilterParams } from "@/features/artist/types";
import { ArtistFilters } from "@/features/artist/components/ArtistFilters";

const ArtistManagementPage = () => {
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

  const deleteMutation = useAdminDeleteArtist();
  const toggleMutation = useAdminToggleStatus();

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artistToEdit, setArtistToEdit] = useState<Artist | null>(null);
  const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null);

  // --- HANDLERS ---
  const handleCreate = () => {
    setArtistToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (artist: Artist) => {
    setArtistToEdit(artist);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (artistToDelete) {
      deleteMutation.mutate(artistToDelete._id, {
        onSuccess: () => setArtistToDelete(null),
      });
    }
  };

  const artists = data?.data.data || [];
  const totalPages = data?.data.meta.totalPages || 1;
  const totalItems = data?.data.meta.totalItems || 0;
  const pageSize = data?.data.meta.pageSize || APP_CONFIG.PAGINATION_LIMIT;
  console.log(artists);
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
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Artists Management"
        subtitle={`Managing ${totalItems} artist profiles.`}
        action={
          <Button
            onClick={handleCreate}
            className="shadow-lg shadow-primary/20"
          >
            <Plus className="size-4 mr-2" /> Add Artist
          </Button>
        }
      />

      {/* FILTER */}
      <ArtistFilters params={params} setParams={setParams} />

      {/* CONTENT */}
      {isLoading ? (
        <CardSkeleton count={APP_CONFIG.PAGINATION_LIMIT} />
      ) : artists.length === 0 ? (
        <div className="py-12">
          <MusicResult
            status="empty"
            title="No artists found"
            description="Try adjusting your filters or search criteria."
            secondaryAction={{
              label: "Clear Filters",
              onClick: () => setParams({ page: 1, limit: 12, keyword: "" }),
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in fade-in duration-500">
          {artists.map((artist: Artist) => (
            <ArtistCard
              key={artist._id}
              artist={artist}
              onEdit={() => handleEdit(artist)}
              onDelete={() => setArtistToDelete(artist)}
              onToggle={() => toggleMutation.mutate(artist._id)}
            />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {!isLoading && artists.length > 0 && (
        <div className="pt-4">
          <Pagination
            currentPage={params.page || 1}
            totalPages={totalPages}
            onPageChange={(p) => setParams((prev) => ({ ...prev, page: p }))}
            totalItems={totalItems}
            itemsPerPage={pageSize}
          />
        </div>
      )}

      {/* MODALS */}
      <ArtistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        artistToEdit={artistToEdit}
      />

      <ConfirmationModal
        isOpen={!!artistToDelete}
        onCancel={() => setArtistToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Artist?"
        description={
          <span>
            Are you sure you want to delete{" "}
            <strong>{artistToDelete?.name}</strong>? This action cannot be
            undone.
          </span>
        }
        confirmLabel="Delete Artist"
        isDestructive
      />
    </div>
  );
};

export default ArtistManagementPage;
