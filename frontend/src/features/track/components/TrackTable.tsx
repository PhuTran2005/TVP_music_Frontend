import React from "react";
import { type Track } from "../types";
import { TrackTableRow } from "./TrackTableRow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MusicResult from "@/components/ui/Result";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { setQueue, setIsPlaying } from "@/features/player";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface TrackTableProps {
  tracks: Track[];
  isLoading: boolean;
  selectedIds: string[];
  onSelectOne: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit: (track: Track) => void;
  onRetry: (track: Track) => void;
  onDelete: (track: Track) => void;
  startIndex: number;
}

export const TrackTable: React.FC<TrackTableProps> = ({
  tracks,
  isLoading,
  selectedIds,
  onSelectOne,
  onSelectAll,
  onEdit,
  onDelete,
  onRetry,
  startIndex,
}) => {
  const dispatch = useAppDispatch();
  const { currentTrack, isPlaying } = useAppSelector((state) => state.player);

  const isAllSelected =
    tracks.length > 0 && selectedIds.length === tracks.length;

  /**
   * ✅ PLAY LOGIC CHUẨN SPOTIFY
   */
  const handlePlayTrack = (track: Track, index: number) => {
    // Click lại bài đang active → toggle play / pause
    if (currentTrack?._id === track._id) {
      dispatch(setIsPlaying(!isPlaying));
      return;
    }

    // Click bài khác → set queue + play từ index đó
    dispatch(
      setQueue({
        tracks,
        startIndex: index,
      }),
    );
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        {/* ================= HEADER ================= */}
        <TableHeader className="bg-secondary/50">
          <TableRow>
            <TableHead className="w-10 px-2 text-center">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(val) => onSelectAll(val as boolean)}
              />
            </TableHead>
            <TableHead className="w-12 text-center text-xs font-black uppercase text-muted-foreground">
              #
            </TableHead>
            <TableHead className="text-xs font-black uppercase text-muted-foreground">
              Track
            </TableHead>
            <TableHead className="hidden sm:table-cell text-xs font-black uppercase text-muted-foreground">
              Artist
            </TableHead>
            <TableHead className="hidden md:table-cell text-xs font-black uppercase text-muted-foreground">
              Album
            </TableHead>
            <TableHead className="text-xs font-black uppercase text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="hidden lg:table-cell text-xs font-black uppercase text-muted-foreground">
              Time
            </TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>

        {/* ================= BODY ================= */}
        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={8} cols={7} />
          ) : tracks.length > 0 ? (
            tracks.map((track, i) => (
              <TrackTableRow
                key={track._id}
                track={track}
                index={startIndex + i}
                isActive={currentTrack?._id === track._id}
                isPlaying={isPlaying}
                isSelected={selectedIds.includes(track._id)}
                onSelect={onSelectOne}
                onPlay={() => handlePlayTrack(track, i)}
                onRetry={onRetry}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-64 text-center">
                <MusicResult
                  status="empty"
                  title="No tracks found"
                  description="Try adjusting filters or upload a new track."
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
