import React, { memo, useCallback } from "react";
import { Clock, Music2, Inbox } from "lucide-react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table"; // Đảm bảo import TableCell

import { Track } from "@/features/track/types";
import { TrackRow } from "./TrackRow";

import { setQueue, setIsPlaying } from "@/features/player";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

interface TrackListProps {
  tracks: Track[];
  isLoading: boolean;
}

// 🦴 1. Component Skeleton Row (Loading)
const TrackSkeleton = () => (
  <TableRow className="border-b border-white/5 hover:bg-transparent">
    <TableCell className="w-12 text-center">
      <div className="mx-auto h-4 w-4 animate-pulse rounded bg-white/10" />
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-3">
        {/* Ảnh bìa */}
        <div className="h-10 w-10 shrink-0 animate-pulse rounded bg-white/10" />
        <div className="flex flex-col gap-2">
          {/* Tên bài hát */}
          <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
          {/* Nghệ sĩ */}
          <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
        </div>
      </div>
    </TableCell>
    <TableCell className="hidden md:table-cell">
      <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
    </TableCell>
    <TableCell className="w-28 text-right">
      <div className="ml-auto h-4 w-8 animate-pulse rounded bg-white/5" />
    </TableCell>
  </TableRow>
);

// 📭 2. Component Empty State (Ngoại lệ)
const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={4} className="h-60 text-center">
      <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
          <Inbox className="h-8 w-8 opacity-50" />
        </div>
        <div>
          <p className="text-lg font-medium text-foreground">
            Không tìm thấy bài hát
          </p>
          <p className="text-sm opacity-60">
            Hãy thử tìm kiếm từ khóa khác hoặc quay lại sau.
          </p>
        </div>
      </div>
    </TableCell>
  </TableRow>
);

export const TrackList = memo(({ tracks, isLoading }: TrackListProps) => {
  const dispatch = useAppDispatch();
  const { currentTrack, isPlaying } = useAppSelector((s) => s.player);

  const handlePlayTrack = useCallback(
    (track: Track, index: number) => {
      // Case 1: Click lại track đang active -> Toggle Play/Pause
      if (currentTrack?._id === track._id) {
        dispatch(setIsPlaying(!isPlaying));
        return;
      }

      // Case 2: Track khác -> Set queue mới & Play
      dispatch(
        setQueue({
          tracks,
          startIndex: index,
        }),
      );
    },
    [dispatch, tracks, currentTrack, isPlaying],
  );

  return (
    <div className="w-full">
      <Table>
        {/* ===== HEADER ===== */}
        <TableHeader>
          <TableRow className="border-b border-white/10 text-[11px] uppercase tracking-widest text-muted-foreground hover:bg-transparent">
            <TableHead className="w-12 px-0 text-center">#</TableHead>
            <TableHead>Bài hát</TableHead>
            <TableHead className="hidden md:table-cell">Album</TableHead>
            <TableHead className="w-28 pr-4 text-right">
              <Clock className="ml-auto size-4" />
            </TableHead>
          </TableRow>
        </TableHeader>

        {/* ===== BODY ===== */}
        <TableBody>
          {/* Case 1: Đang tải dữ liệu */}
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <TrackSkeleton key={i} />)
          ) : tracks.length > 0 ? (
            // Case 2: Có dữ liệu
            tracks.map((track, index) => (
              <TrackRow
                key={track._id}
                track={track}
                index={index}
                isActive={currentTrack?._id === track._id}
                isPlaying={isPlaying}
                onPlay={() => handlePlayTrack(track, index)}
              />
            ))
          ) : (
            // Case 3: Không có dữ liệu (Empty)
            <EmptyState />
          )}
        </TableBody>
      </Table>
    </div>
  );
});

TrackList.displayName = "TrackList";
