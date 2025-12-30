import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { APP_CONFIG } from "@/config/constants";

// Components
import { Button } from "@/components/ui/button";
import CardSkeleton from "@/components/ui/CardSkeleton";
import PageHeader from "@/components/ui/PageHeader";
import AlbumFilter from "@/features/album/components/AlbumFilter";
import AlbumModal from "@/features/album/components/album-modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import AlbumCard from "@/features/album/components/AlbumCard";
import MusicResult from "@/components/ui/Result";

// Hooks & Types
import { useDebounce } from "@/hooks/useDebounce";
import { useAlbumAdmin } from "@/features/album/hooks/useAlbumAdmin";
import type { Album, AlbumFormInput } from "@/features/album/types";
import Pagination from "@/utils/pagination";

const AlbumManagementPage = () => {
  // --- HOOKS ---
  const {
    albums,
    meta,
    isLoading,
    filterParams,
    setFilterParams,
    createAlbum,
    updateAlbum,
    handleDelete: deleteAction,
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

  // --- MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setEditingAlbum(null);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (albumToDelete) {
      deleteAction(albumToDelete._id);
      setAlbumToDelete(null);
    }
  };

  const handleSubmitForm = (formData: AlbumFormInput) => {
    if (editingAlbum) {
      updateAlbum(editingAlbum._id, formData, () => setIsModalOpen(false));
    } else {
      createAlbum(formData, () => setIsModalOpen(false));
    }
  };
  console.log(albums, meta);
  const totalPages = meta.totalPages || 1;
  const totalItems = meta.totalItems || 0;
  const pageSize = meta.pageSize || APP_CONFIG.PAGINATION_LIMIT;
  console.log("Rendering AlbumPage with albums:", albums);
  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <PageHeader
        title="Albums Management"
        subtitle={`Managing ${totalItems} albums in your library.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Album
          </Button>
        }
      />

      {/* --- FILTER --- */}
      <AlbumFilter params={filterParams} setParams={setFilterParams} />

      {/* --- CONTENT --- */}
      {isLoading ? (
        <CardSkeleton count={8} />
      ) : albums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in fade-in duration-500">
          {albums.map((album) => (
            <AlbumCard
              key={album._id}
              album={album}
              onEdit={(a) => {
                setEditingAlbum(a);
                setIsModalOpen(true);
              }}
              onDelete={(a) => setAlbumToDelete(a)}
            />
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

      {/* --- MODALS --- */}
      <AlbumModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        albumToEdit={editingAlbum}
        onSubmit={handleSubmitForm}
        isPending={isLoading}
      />

      <ConfirmationModal
        isOpen={!!albumToDelete}
        onCancel={() => setAlbumToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Album?"
        description={
          <span>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">{albumToDelete?.title}</strong>?
            This action cannot be undone and will remove all tracks associated
            with this album.
          </span>
        }
        confirmLabel="Delete Album"
        isDestructive
      />
    </div>
  );
};

export default AlbumManagementPage;
