import { useState } from "react";
import { Plus } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/utils/pagination";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

// Feature Components
import { useTrackAdmin } from "@/features/track/hooks/useTrackAdmin";
import { TrackFilters } from "@/features/track/components/TrackFilters";
import { TrackTable } from "@/features/track/components/TrackTable";
import TrackModal from "@/features/track/components/TrackModal";
import { type Track } from "@/features/track/types";
import { type TrackFormValues } from "@/features/track/schemas/track.schema";
import { APP_CONFIG } from "@/config/constants";

const TrackManagementPage = () => {
  // --- HOOKS ---
  const {
    tracks,
    meta,
    isLoading,
    filterParams,
    setFilterParams,
    handlePageChange,
    createTrack,
    updateTrack,
    deleteTrack,
    isCreating,
    isUpdating,
  } = useTrackAdmin(10);

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackToEdit, setTrackToEdit] = useState<Track | null>(null);
  const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setTrackToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (track: Track) => {
    setTrackToEdit(track);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: TrackFormValues) => {
    if (trackToEdit) {
      updateTrack(
        { id: trackToEdit._id, data },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createTrack(data, { onSuccess: () => setIsModalOpen(false) });
    }
  };
  console.log(tracks);
  const totalPages = meta.totalPages || 1;
  const totalItems = meta.totalItems || 0;
  const pageSize = meta.pageSize || APP_CONFIG.PAGINATION_LIMIT;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <PageHeader
        title="Tracks Management"
        subtitle={`Library contains ${totalItems} tracks.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-lg shadow-primary/20"
          >
            <Plus className="size-4 mr-2" /> Upload Track
          </Button>
        }
      />

      {/* FILTER */}
      <TrackFilters params={filterParams} setParams={setFilterParams} />

      {/* TABLE CONTENT */}
      <TrackTable
        tracks={tracks}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={setTrackToDelete}
        startIndex={(meta.page - 1) * pageSize}
      />

      {/* PAGINATION */}
      {!isLoading && tracks.length > 0 && (
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

      {/* MODALS */}
      <TrackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trackToEdit={trackToEdit}
        onSubmit={handleSubmit}
        isPending={isCreating || isUpdating}
      />

      <ConfirmationModal
        isOpen={!!trackToDelete}
        onCancel={() => setTrackToDelete(null)}
        onConfirm={() => {
          if (trackToDelete)
            deleteTrack(trackToDelete._id, {
              onSuccess: () => setTrackToDelete(null),
            });
        }}
        title="Delete Track?"
        description={
          <div>
            Are you sure you want to delete{" "}
            <strong>{trackToDelete?.title}</strong>?
            <br />
            <span className="text-xs text-destructive mt-1 block">
              This action will permanently remove the audio file from the
              system.
            </span>
          </div>
        }
        confirmLabel="Delete Track"
        isDestructive
      />
    </div>
  );
};

export default TrackManagementPage;
