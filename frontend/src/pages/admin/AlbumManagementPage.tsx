import { useState } from "react";
import { Plus } from "lucide-react";
import { APP_CONFIG } from "@/config/constants";

// Components
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import AlbumFilter from "@/features/album/components/AlbumFilter";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import AlbumCard from "@/features/album/components/AlbumCard";
import MusicResult from "@/components/ui/Result";
import Pagination from "@/utils/pagination";
import CardSkeleton from "@/components/ui/CardSkeleton";

// Hooks
import { useAlbumParams } from "@/features/album/hooks/useAlbumParams";
import { useAlbumsQuery } from "@/features/album/hooks/useAlbumsQuery";
import { useAlbumMutations } from "@/features/album/hooks/useAlbumMutations";
import type { Album } from "@/features/album/types";
import AlbumModal from "@/features/album/components/album-modal";

const AlbumManagementPage = () => {
  // --- 1. STATE MANAGEMENT (URL) ---
  const {
    filterParams,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    clearFilters,
  } = useAlbumParams(APP_CONFIG.PAGINATION_LIMIT || 12);
  const { data, isLoading } = useAlbumsQuery(filterParams);
  const { createAlbumAsync, updateAlbumAsync, deleteAlbum, isMutating } =
    useAlbumMutations();

  // --- 4. LOCAL UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setEditingAlbum(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (album: Album) => {
    setEditingAlbum(album);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (album: Album) => {
    setAlbumToDelete(album);
  };

  const handleConfirmDelete = () => {
    if (albumToDelete) {
      deleteAlbum(albumToDelete._id, {
        onSuccess: () => setAlbumToDelete(null),
      });
    }
  };

  // 🔥 CORE LOGIC: Handle Form Submit (Data is FormData)
  const handleFormSubmit = async (formData: FormData) => {
    console.log("Form data received in AlbumManagementPage:", formData);
    try {
      if (editingAlbum) {
        await updateAlbumAsync(editingAlbum._id, formData);
      } else {
        await createAlbumAsync(formData);
      }
      // Chỉ đóng modal khi API thành công (không có lỗi ném ra)
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save album", error);
      // Giữ modal mở để user sửa lỗi nếu cần
    }
  };

  // Safe access data
  const albums = data?.albums || [];
  const meta = data?.meta || {
    totalPages: 1,
    totalItems: 0,
    page: 1,
    pageSize: 12,
  };

  return (
    <div className="space-y-8 pb-12">
      {/* --- HEADER --- */}
      <PageHeader
        title="Albums Management"
        subtitle={`Managing ${meta.totalItems} albums in your library.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-md bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Album
          </Button>
        }
      />

      {/* --- FILTER --- */}
      <div className="bg-card rounded-2xl shadow-sm">
        <AlbumFilter
          params={filterParams}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onReset={clearFilters}
        />
      </div>

      {/* --- CONTENT GRID --- */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {/* Render 10 cái skeleton với hiệu ứng wave */}
          <CardSkeleton count={10} />
        </div>
      ) : albums.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 animate-in fade-in duration-500">
          {albums.map((album) => (
            <AlbumCard
              key={album._id}
              album={album}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className=" bg-muted/5 rounded-xl border border-dashed border-border">
          <MusicResult
            status="empty"
            title="No albums found"
            description="Try adjusting your filters or create a new album to get started."
          />
        </div>
      )}

      {!isLoading && albums.length > 0 && (
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

      {/* 1. Create/Edit Modal */}
      {isModalOpen && (
        <AlbumModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          albumToEdit={editingAlbum}
          onSubmit={handleFormSubmit}
          isPending={isMutating} //
        />
      )}

      {/* 2. Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!albumToDelete}
        onCancel={() => setAlbumToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isMutating}
        title="Delete Album?"
        description={
          <span>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">{albumToDelete?.title}</strong>?
            <br />
            <span className="text-destructive font-bold text-sm mt-2 block bg-destructive/10 p-2 rounded border border-destructive/20">
              This action cannot be undone and will remove all tracks associated
              with this album.
            </span>
          </span>
        }
        confirmLabel="Yes, Delete"
        isDestructive
      />
    </div>
  );
};

export default AlbumManagementPage;
