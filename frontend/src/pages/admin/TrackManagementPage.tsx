import { useState } from "react";
import { Plus } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/utils/pagination";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import MusicResult from "@/components/ui/Result";
// 🔥 FIX 1: Import thêm các thành phần Table để bọc Skeleton
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableSkeleton from "@/components/ui/TableSkeleton";

// Feature Components
import { useTrackAdmin } from "@/features/track/hooks/useTrackAdmin";
import { TrackFilters } from "@/features/track/components/TrackFilters";
import { TrackTable } from "@/features/track/components/TrackTable";
import TrackModal from "@/features/track/components/TrackModal";
import { BulkActionBar } from "@/features/track/components/BulkActionBar";
import { BulkEditModal } from "@/features/track/components/BulkEditModal";

// Types & Config
import { type Track } from "@/features/track/types";
import {
  BulkTrackFormValues,
  type TrackFormValues,
} from "@/features/track/schemas/track.schema";
import { APP_CONFIG } from "@/config/constants";

const TrackManagementPage = () => {
  // --- 1. USE HOOK (Central Logic) ---
  const {
    // Data
    tracks,
    meta,
    filterParams,

    // States
    isLoading,
    isMutating,

    // Actions
    setFilterParams,
    handlePageChange,

    // Mutation Wrappers
    createTrack,
    updateTrack,
    deleteTrack,
    retryTranscode,
    bulkUpdateTrack,
  } = useTrackAdmin(APP_CONFIG.PAGINATION_LIMIT);

  // --- 2. LOCAL UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackToEdit, setTrackToEdit] = useState<Track | null>(null);
  const [trackToDelete, setTrackToDelete] = useState<Track | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState<"metadata" | "album" | null>(null);

  // --- 3. HANDLERS ---
  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id),
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(tracks.map((t) => t._id));
    } else {
      setSelectedIds([]);
    }
  };

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
      updateTrack(trackToEdit._id, data, {
        onSuccess: () => setIsModalOpen(false),
      });
    } else {
      createTrack(data, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleRetryTranscode = (track: Track) => {
    retryTranscode(track._id);
  };

  const handleBulkSubmit = (data: BulkTrackFormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    ) as BulkTrackFormValues;

    if (Object.keys(cleanData).length === 0) return;

    bulkUpdateTrack(selectedIds, cleanData, {
      onSuccess: () => {
        setBulkMode(null);
        setSelectedIds([]);
      },
    });
  };

  const totalPages = meta.totalPages || 1;
  const totalItems = meta.totalItems || 0;
  const pageSize = meta.pageSize || APP_CONFIG.PAGINATION_LIMIT;

  return (
    <div className="space-y-8 pb-32">
      <PageHeader
        title="Tracks Management"
        subtitle={`Library contains ${totalItems} tracks.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-md bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6"
          >
            <Plus className="size-4 mr-2" /> Upload Track
          </Button>
        }
      />

      <TrackFilters params={filterParams} setParams={setFilterParams} />

      {/* TABLE CONTENT */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          // 🔥 FIX 2: Bọc TableSkeleton trong cấu trúc Table chuẩn
          <Table>
            <TableHeader>
              {/* Fake Header để Skeleton không bị lệch layout (tùy chọn) */}
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead className="w-[300px]">Track Info</TableHead>
                <TableHead>Album</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableSkeleton rows={pageSize} cols={7} />
            </TableBody>
          </Table>
        ) : tracks.length === 0 ? (
          <div className="py-16">
            <MusicResult
              status="empty"
              title="No tracks found"
              description="Upload a new track or adjust filters."
            />
          </div>
        ) : (
          <TrackTable
            tracks={tracks}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={setTrackToDelete}
            onRetry={handleRetryTranscode}
            startIndex={(meta.page - 1) * pageSize}
            selectedIds={selectedIds}
            onSelectOne={handleSelectOne}
            onSelectAll={handleSelectAll}
          />
        )}
      </div>

      {!isLoading && tracks.length > 0 && (
        <div className="pt-2">
          <Pagination
            currentPage={meta.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={pageSize}
          />
        </div>
      )}

      {/* --- Action Bar & Modals (Giữ nguyên) --- */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onEditAlbum={() => setBulkMode("album")}
        onEditMetadata={() => setBulkMode("metadata")}
        onDelete={() => {
          alert("Bulk delete functionality coming soon!");
        }}
      />

      <TrackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trackToEdit={trackToEdit}
        onSubmit={handleSubmit}
        isPending={isMutating}
      />

      {bulkMode && (
        <BulkEditModal
          isOpen={!!bulkMode}
          onClose={() => setBulkMode(null)}
          selectedCount={selectedIds.length}
          initialTab={bulkMode}
          onSubmit={handleBulkSubmit}
          isPending={isMutating}
        />
      )}

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
        isLoading={isMutating}
        description={
          <div>
            Are you sure you want to permanently delete{" "}
            <strong className="text-foreground">{trackToDelete?.title}</strong>?
            <br />
            <span className="text-destructive font-bold text-sm mt-2 block bg-destructive/10 p-2 rounded border border-destructive/20">
              Warning: This action will permanently remove the audio file and
              cannot be undone.
            </span>
          </div>
        }
        confirmLabel="Yes, Delete"
        isDestructive
      />
    </div>
  );
};

export default TrackManagementPage;
