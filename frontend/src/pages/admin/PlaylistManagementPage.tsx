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
    isLoading, // Loading fetch
    isMutating, // Loading create/update/delete (Dùng cái này cho button save)
    filterParams,
    setFilterParams,
    createPlaylist,
    updateMetadata,
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
    null,
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

  // 🔥 DELETE HANDLER (Đã chuẩn)
  const handleConfirmDelete = () => {
    if (playlistToDelete) {
      // Gọi trực tiếp: id, options
      deletePlaylist(playlistToDelete._id, {
        onSuccess: () => setPlaylistToDelete(null),
      });
    }
  };

  // 🔥 SUBMIT HANDLER (Đã sửa lại cho khớp với Hook mới)
  const handleSubmitForm = (formData: any) => {
    if (playlistToEdit) {
      // ✅ FIX: Truyền 3 tham số rời rạc: ID, Data, Options
      updateMetadata(
        playlistToEdit._id, // Arg 1: ID
        formData, // Arg 2: Data
        {
          // Arg 3: Options
          onSuccess: () => setIsModalOpen(false),
        },
      );
    } else {
      // ✅ Create vẫn giữ nguyên: Data, Options
      createPlaylist(formData, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const totalPages = meta.totalPages || 1;
  const totalItems = meta.totalItems || 0;
  const pageSize = meta.pageSize || APP_CONFIG.PAGINATION_LIMIT;

  return (
    <div className="space-y-8 pb-12">
      {/* --- HEADER --- */}
      <PageHeader
        title="Playlists Management"
        subtitle={`Managing ${totalItems} playlists in the system.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-md bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6"
          >
            <Plus className="w-4 h-4 mr-2" /> New Playlist
          </Button>
        }
      />

      {/* --- FILTER --- */}
      <PlaylistFilter params={filterParams} setParams={setFilterParams} />

      {/* --- CONTENT --- */}
      {/* Chỉ hiện Skeleton khi đang fetch dữ liệu ban đầu, tránh nháy khi mutate */}
      {isLoading && playlists.length === 0 ? (
        <CardSkeleton count={pageSize} />
      ) : playlists.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 animate-in fade-in duration-500">
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
        <div className="py-16 bg-muted/5 rounded-xl border border-dashed border-border">
          <MusicResult
            status="empty"
            title="No playlists found"
            description="Try changing the filter or create a new playlist."
          />
        </div>
      )}

      {/* --- PAGINATION --- */}
      {playlists.length > 0 && (
        <div className="pt-6 border-t border-border">
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
        // Sử dụng isMutating để chỉ loading nút Save chứ không loading cả trang
        isPending={isMutating}
      />

      <ConfirmationModal
        isOpen={!!playlistToDelete}
        onCancel={() => setPlaylistToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Playlist?"
        // Sử dụng isMutating để disable nút xóa khi đang chạy
        isLoading={isMutating}
        description={
          <div className="space-y-4">
            <p className="text-sm text-foreground/80">
              Are you sure you want to delete{" "}
              <strong className="text-foreground text-base">
                {playlistToDelete?.title}
              </strong>
              ?
            </p>
            {playlistToDelete?.isSystem ? (
              <div className="text-xs font-medium text-amber-700 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
                <span className="text-lg leading-none">⚠️</span>
                <p>
                  This is a <strong>System Playlist</strong>. Deleting it will
                  remove it from the homepage of all users.
                </p>
              </div>
            ) : (
              <div className="text-xs font-medium text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border flex items-start gap-3">
                <span className="text-lg leading-none">ℹ️</span>
                <p>
                  This is a User Playlist. Typically, you only delete this if it
                  violates platform policies.
                </p>
              </div>
            )}
          </div>
        }
        confirmLabel="Yes, Delete"
        isDestructive
      />
    </div>
  );
};

export default PlaylistManagementPage;
