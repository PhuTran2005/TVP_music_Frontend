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
import { setQueue, setTrack } from "@/features/player";
import { useAppDispatch, useAppSelector } from "@/store/store";

interface TrackTableProps {
  tracks: Track[];
  isLoading: boolean;
  onEdit: (track: Track) => void;
  onDelete: (track: Track) => void;
  startIndex: number;
}
export const TrackTable: React.FC<TrackTableProps> = ({
  tracks,
  isLoading,
  onEdit,
  onDelete,
  startIndex,
}) => {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.player.currentTrack);
  const isPlaying = useAppSelector((state) => state.player.isPlaying);

  return (
    <div className="relative w-full overflow-auto rounded-lg border border-border bg-card">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-12 text-center text-xs font-bold uppercase">
              #
            </TableHead>
            <TableHead className="text-xs font-bold uppercase">Track</TableHead>
            <TableHead className="hidden sm:table-cell text-xs font-bold uppercase">
              Artist
            </TableHead>
            <TableHead className="hidden md:table-cell text-xs font-bold uppercase">
              Album
            </TableHead>
            <TableHead className="text-xs font-bold uppercase">
              Status
            </TableHead>
            <TableHead className="hidden lg:table-cell text-xs font-bold uppercase">
              Time
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={8} cols={6} />
          ) : tracks.length > 0 ? (
            tracks.map((track, i) => (
              <TrackTableRow
                key={track._id}
                track={track}
                index={startIndex + i}
                isActive={currentTrack?._id === track._id}
                isPlaying={isPlaying}
                onPlay={() =>
                  dispatch(setQueue({ tracks: [track], startIndex: 0 }))
                }
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-72 text-center">
                <MusicResult status="empty" title="No tracks found" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
