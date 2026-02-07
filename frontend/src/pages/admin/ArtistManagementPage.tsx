import { useState } from "react";
import { Plus } from "lucide-react";

// Hooks
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
import { ArtistFilters } from "@/features/artist/components/ArtistFilters";

import type { Artist } from "@/features/artist/types";
import { useArtistAdmin } from "@/features/artist/hooks";

const ArtistManagementPage = () => {
  // --- 1. USE HOOK (Central Logic) ---
  const {
    // Data
    artists,
    meta,
    filterParams,

    // States
    isLoading,
    isMutating,
    isError,

    // Actions
    setFilterParams,
    handlePageChange,
    toggleArtistStatus,
    deleteArtist,
  } = useArtistAdmin(APP_CONFIG.PAGINATION_LIMIT || 12);

  // --- 2. LOCAL UI STATE (Modals) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artistToEdit, setArtistToEdit] = useState<Artist | null>(null);
  const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null);

  // --- 3. HANDLERS ---
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
      deleteArtist(artistToDelete._id, {
        onSuccess: () => setArtistToDelete(null),
      });
    }
  };

  const handleToggle = (artist: Artist) => {
    toggleArtistStatus(artist._id);
  };

  if (isError) {
    return (
      <div className="pt-2 pb-10 flex items-center justify-center min-h-[50vh]">
        <MusicResult
          status="error"
          title="Failed to load artists"
          description="Please check your connection and try again."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER */}
      <PageHeader
        title="Artist Profiles"
        subtitle={`Managing ${meta.totalItems} profiles across the platform.`}
        action={
          <Button
            onClick={handleCreate}
            className="shadow-md bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6"
          >
            <Plus className="size-4 mr-2" /> New Artist
          </Button>
        }
      />

      {/* FILTER SECTION */}
      {/* Truyền trực tiếp params và setter từ hook */}
      <ArtistFilters params={filterParams} setParams={setFilterParams} />

      {/* CONTENT GRID */}
      {isLoading ? (
        <CardSkeleton count={meta.pageSize} />
      ) : artists.length === 0 ? (
        <div className="py-16 bg-muted/5 rounded-xl border border-dashed border-border">
          <MusicResult
            status="empty"
            title="No artists found"
            description="Try adjusting your filters or search keyword."
            secondaryAction={{
              label: "Clear Filters",
              onClick: () =>
                setFilterParams((prev) => ({
                  ...prev,
                  page: 1,
                  keyword: "",
                  nationality: undefined,
                  isVerified: undefined,
                  isActive: undefined,
                })),
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-6 animate-in fade-in duration-500">
          {artists.map((artist: Artist) => (
            <ArtistCard
              key={artist._id}
              artist={artist}
              onEdit={() => handleEdit(artist)}
              onDelete={() => setArtistToDelete(artist)}
              onToggle={() => handleToggle(artist)}
            />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {!isLoading && artists.length > 0 && (
        <div className="pt-6 border-t border-border">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
            totalItems={meta.totalItems}
            itemsPerPage={meta.pageSize || 1}
          />
        </div>
      )}

      {/* MODALS */}
      <ArtistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        artistToEdit={artistToEdit}
        // Truyền trạng thái đang xử lý để disable nút Save
        isPending={isMutating}
      />

      <ConfirmationModal
        isOpen={!!artistToDelete}
        onCancel={() => setArtistToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Artist Profile?"
        // Truyền trạng thái đang xử lý để disable nút Delete
        isLoading={isMutating}
        description={
          <span>
            Are you sure you want to permanently delete{" "}
            <strong className="text-foreground">{artistToDelete?.name}</strong>?
            <br />
            <span className="text-destructive font-bold text-sm mt-2 block bg-destructive/10 p-2 rounded border border-destructive/20">
              This action cannot be undone. All associated tracks might be
              affected.
            </span>
          </span>
        }
        confirmLabel="Yes, Delete"
        isDestructive
      />
    </div>
  );
};

export default ArtistManagementPage;
