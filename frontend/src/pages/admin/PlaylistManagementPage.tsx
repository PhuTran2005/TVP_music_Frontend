import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { APP_CONFIG } from "@/config/constants";

// Components
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import CardSkeleton from "@/components/ui/CardSkeleton";
import Pagination from "@/utils/pagination";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import MusicResult from "@/components/ui/Result";

// Feature Components
import PlaylistFilter from "@/features/playlist/components/PlaylistFilter";
import PlaylistCard from "@/features/playlist/components/PlaylistCard";
import PlaylistModal from "@/features/playlist/components/PlaylistModal";

// Hooks & Types
import { usePlaylistAdmin } from "@/features/playlist/hooks/usePlaylistAdmin";
import { useDebounce } from "@/hooks/useDebounce";
import { type Playlist } from "@/features/playlist/types";

const PlaylistManagementPage = () => {
  // --- HOOKS ---
  const {
    playlists,
    meta,
    isLoading,
    filterParams,
    setFilterParams,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
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

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistToEdit, setPlaylistToEdit] = useState<Playlist | null>(null);
  const [playlistToDelete, setPlaylistToDelete] = useState<Playlist | null>(
    null
  );

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setPlaylistToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (playlist: Playlist) => {
    setPlaylistToEdit(playlist);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (playlistToDelete) {
      deletePlaylist(playlistToDelete._id, () => setPlaylistToDelete(null));
    }
  };

  const handleSubmitForm = (data: any) => {
    if (playlistToEdit) {
      updatePlaylist(playlistToEdit._id, data, () => setIsModalOpen(false));
    } else {
      createPlaylist(data, () => setIsModalOpen(false));
    }
  };
  console.log(playlists);
  const totalPages = meta.totalPages || 1;
  const totalItems = meta.totalItems || 0;
  const pageSize = meta.pageSize || APP_CONFIG.PAGINATION_LIMIT;

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <PageHeader
        title="Playlists Management"
        subtitle={`Managing ${totalItems} playlists in the system.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4 mr-2" /> Create System Playlist
          </Button>
        }
      />

      {/* --- FILTER --- */}
      <PlaylistFilter
        params={filterParams}
        setParams={setFilterParams}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* --- CONTENT --- */}
      {isLoading ? (
        <CardSkeleton count={8} />
      ) : playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in fade-in duration-500">
          {playlists.map((playlist: Playlist) => (
            <PlaylistCard
              key={playlist._id}
              playlist={playlist}
              onEdit={() => handleOpenEdit(playlist)}
              onDelete={() => setPlaylistToDelete(playlist)}
            />
          ))}
        </div>
      ) : (
        <div className="py-12">
          <MusicResult
            status="empty"
            title="No playlists found"
            description="Try changing the filter or create a new playlist."
          />
        </div>
      )}

      {/* --- PAGINATION --- */}
      {!isLoading && playlists.length > 0 && (
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

      {/* --- MODALS --- */}
      <PlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        playlistToEdit={playlistToEdit}
        onSubmit={handleSubmitForm}
        isPending={isLoading}
      />

      <ConfirmationModal
        isOpen={!!playlistToDelete}
        onCancel={() => setPlaylistToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Playlist?"
        description={
          <div className="space-y-3">
            <p>
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                {playlistToDelete?.title}
              </strong>
              ?
            </p>
            {playlistToDelete?.isSystem ? (
              <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/50 flex items-start gap-2">
                <span className="text-base">⚠️</span>
                <p>
                  This is a <strong>System Playlist</strong>. Deleting it will
                  remove it from all users' homepages.
                </p>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-lg border border-border flex items-start gap-2">
                <span className="text-base">ℹ️</span>
                <p>
                  This is a User Playlist. Usually, only delete if it violates
                  content policies.
                </p>
              </div>
            )}
          </div>
        }
        confirmLabel="Delete Playlist"
        isDestructive
      />
    </div>
  );
};

export default PlaylistManagementPage;
