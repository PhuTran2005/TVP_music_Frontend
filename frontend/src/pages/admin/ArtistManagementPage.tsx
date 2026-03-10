import { useState, useMemo, useCallback } from "react";
import { UserPlus, SearchX, RefreshCcw, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { APP_CONFIG } from "@/config/constants";
import { handleError } from "@/utils/handleError";

// Components
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import CardSkeleton from "@/components/ui/CardSkeleton";
import Pagination from "@/utils/pagination";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import MusicResult from "@/components/ui/Result";

// Feature Components
import { ArtistFilters } from "@/features/artist/components/ArtistFilters";
import ArtistCard from "@/features/artist/components/ArtistCard";
import ArtistModal from "@/features/artist/components/artist-model";

// Hooks & Types
import { useArtistParams } from "@/features/artist/hooks/useArtistParams";
import { useArtistsQuery } from "@/features/artist/hooks/useArtistsQuery";
import { useArtistMutations } from "@/features/artist/hooks/useArtistMutations";
import { type Artist } from "@/features/artist/types";

const ArtistManagementPage = () => {
  // --- 1. STATE MANAGEMENT ---
  const {
    filterParams,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    clearFilters,
  } = useArtistParams(APP_CONFIG.PAGINATION_LIMIT || 12);

  // --- 2. DATA FETCHING ---
  const { data, isLoading, isFetching, isError, refetch } =
    useArtistsQuery(filterParams);

  // --- 3. MUTATIONS ---
  const {
    createArtistAsync,
    updateArtistAsync,
    deleteArtist,
    toggleArtistStatus,
    isMutating,
  } = useArtistMutations();

  // --- 4. LOCAL UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [artistToEdit, setArtistToEdit] = useState<Artist | null>(null);
  const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null);

  // --- 5. HANDLERS (Memoized for Performance) ---
  const handleOpenCreate = useCallback(() => {
    setArtistToEdit(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((artist: Artist) => {
    setArtistToEdit(artist);
    setIsModalOpen(true);
  }, []);

  const handleToggleStatus = async (artist: Artist) => {
    try {
      await toggleArtistStatus(artist._id);
      toast.success(
        artist.isActive
          ? `Archived ${artist.name}`
          : `Published ${artist.name}`,
      );
    } catch (error) {
      handleError(error, "Failed to toggle artist status");
    }
  };

  const handleConfirmDelete = () => {
    if (artistToDelete) {
      deleteArtist(artistToDelete._id, {
        onSuccess: () => {
          setArtistToDelete(null);
          toast.success("Artist profile removed successfully");
        },
        onError: (err) => handleError(err, "Failed to delete artist"),
      });
    }
  };

  const handleSubmitForm = async (formData: FormData) => {
    try {
      if (artistToEdit) {
        await updateArtistAsync(artistToEdit._id, formData);
        toast.success("Artist updated successfully");
      } else {
        await createArtistAsync(formData);
        toast.success("New artist created successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      handleError(error, "Failed to save artist");
    }
  };

  // --- 6. DATA PREPARATION ---
  const artists = useMemo(() => data?.artists || [], [data]);
  const meta = useMemo(
    () =>
      data?.meta || {
        totalPages: 0,
        totalItems: 0,
        page: 1,
        pageSize: 12,
      },
    [data],
  );

  // --- 7. RENDER STATES ---
  if (isError) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <MusicResult
          status="error"
          title="Sync Error"
          description="We couldn't load the artist profiles. Please check your connection."
        />
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCcw className="size-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-[1600px] mx-auto px-2 sm:px-0 relative">
      {/* Loading bar for background fetching */}
      {isFetching && !isLoading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20 animate-pulse z-50 rounded-full" />
      )}

      {/* --- HEADER --- */}
      <PageHeader
        title="Artist Profiles"
        subtitle={`Managing ${meta.totalItems} talent profiles in your ecosystem.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-lg bg-primary hover:bg-primary/90 font-bold px-6 transition-all active:scale-95"
          >
            <UserPlus className="size-4 mr-2" /> New Artist
          </Button>
        }
      />

      {/* --- FILTER SECTION --- */}
      <div className="bg-card rounded-2xl shadow-sm">
        <ArtistFilters
          params={filterParams}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onReset={clearFilters}
        />
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
            <CardSkeleton count={meta.pageSize || 10} />
          </div>
        ) : artists.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {artists.map((artist: Artist) => (
              <ArtistCard
                key={artist._id}
                artist={artist}
                onEdit={() => handleOpenEdit(artist)}
                onDelete={() => setArtistToDelete(artist)}
                onToggle={() => handleToggleStatus(artist)}
              />
            ))}
          </div>
        ) : (
          <div className="h-[450px] flex flex-col items-center justify-center bg-muted/5 rounded-3xl border-2 border-dashed border-border transition-colors hover:bg-muted/10">
            <div className="p-4 bg-background rounded-full shadow-sm mb-4 border">
              <SearchX className="size-10 text-muted-foreground/40" />
            </div>
            <MusicResult
              status="empty"
              title="No Artists Found"
              description="No talent profiles match your current search or filters."
            />
            {Object.keys(filterParams).length > 2 && (
              <Button
                onClick={clearFilters}
                variant="link"
                className="mt-2 text-primary font-bold"
              >
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* --- PAGINATION --- */}

      {!isLoading && artists.length > 0 && (
        <div className="bg-card border rounded-2xl p-4 shadow-sm">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
            totalItems={meta.totalItems}
            itemsPerPage={meta.pageSize || APP_CONFIG.PAGINATION_LIMIT}
          />
        </div>
      )}
      {/* --- MODALS --- */}
      <ArtistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        artistToEdit={artistToEdit}
        onSubmit={handleSubmitForm}
        isPending={isMutating}
      />

      <ConfirmationModal
        isOpen={!!artistToDelete}
        onCancel={() => setArtistToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isMutating}
        title="Delete Artist Profile"
        confirmLabel={isMutating ? "Removing..." : "Confirm Delete"}
        isDestructive
        description={
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">
                "{artistToDelete?.name}"
              </strong>
              ?
            </p>
            <div className="flex gap-3 p-4 bg-destructive/5 rounded-xl border border-destructive/10">
              <AlertCircle className="size-5 text-destructive shrink-0" />
              <div className="text-[12px] text-destructive/90 leading-relaxed font-medium">
                <strong>Crucial Warning:</strong> This will orphan all
                associated tracks, albums, and statistics. This action is
                irreversible.
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ArtistManagementPage;
