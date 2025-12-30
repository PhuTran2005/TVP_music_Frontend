import React, { useState, useMemo } from "react";
import {
  ListMusic,
  Loader2,
  Plus,
  Check,
  Trash2,
  Disc,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Track, TrackFilterParams } from "@/features/track/types";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import MusicResult from "@/components/ui/Result";
const TrackListSkeleton = () => (
  <div className="space-y-2">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-2">
        <div className="size-10 bg-muted rounded-md animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-2 bg-muted rounded w-1/2 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);
// Hooks & Components
import {
  useAddTracksToPlaylist,
  usePlaylistDetail,
  useRemoveTrackFromPlaylist,
} from "@/features/playlist/hooks/usePlaylist";
import { useTracks } from "@/features/track/hooks/useTracks";
import TrackFilters from "@/features/track/components/TrackFilters";

interface EditPlaylistTracksModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
}

export const EditPlaylistTracksModal: React.FC<
  EditPlaylistTracksModalProps
> = ({ isOpen, onClose, playlistId }) => {
  const [activeTab, setActiveTab] = useState("add");
  const [filterParams, setFilterParams] = useState<TrackFilterParams>({
    page: 1,
    limit: 20,
    status: "ready",
    sort: "newest",
  });

  // --- QUERIES ---
  const { data: playlistRes } = usePlaylistDetail(playlistId);
  const currentTracks = playlistRes?.data?.tracks || [];
  const existingTrackIds = useMemo(
    () => new Set(currentTracks.map((t: any) => t._id)),
    [currentTracks]
  );

  const { data: searchRes, isLoading: isSearching } = useTracks(filterParams);
  const searchResults = searchRes?.data?.data || [];

  const addMutation = useAddTracksToPlaylist();
  const removeMutation = useRemoveTrackFromPlaylist();

  const handleAction = (id: string, action: "add" | "remove") => {
    if (action === "add") addMutation.mutate({ playlistId, trackIds: [id] });
    else removeMutation.mutate({ playlistId, trackIds: [id] });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full h-[100dvh] sm:h-[85vh] sm:max-w-3xl flex flex-col p-0 gap-0 overflow-hidden bg-background/98 backdrop-blur-xl border-none sm:border sm:rounded-2xl shadow-2xl">
        {/* HEADER: Cố định chiều cao */}
        <DialogHeader className="px-4 py-3 sm:px-6 sm:py-4 border-b border-border/40 shrink-0 bg-muted/5 relative">
          <div className="flex items-center gap-3 pr-8">
            {" "}
            {/* pr-8 để tránh đè nút X của Radix */}
            <div className="flex size-9 sm:size-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground shrink-0">
              <ListMusic className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                Editor
              </span>
              <DialogTitle className="text-sm sm:text-base font-bold truncate text-foreground mt-1">
                {playlistRes?.data?.title || "Playlist..."}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {/* TABS SELECTOR: Cố định */}
        <div className="px-4 py-2 sm:px-6 border-b border-border/20 shrink-0 bg-background">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="h-9 w-full bg-muted/50 p-1">
              <TabsTrigger
                value="add"
                className="flex-1 text-[11px] sm:text-xs font-bold uppercase"
              >
                Thêm bài
              </TabsTrigger>
              <TabsTrigger
                value="manage"
                className="flex-1 text-[11px] sm:text-xs font-bold uppercase"
              >
                Đã chọn ({currentTracks.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* MAIN AREA: Chỉ phần này được Scroll */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {activeTab === "add" ? (
            <div className="flex flex-col h-full overflow-hidden">
              {/* FILTER: Cố định đầu danh sách */}
              <div className="px-4 py-3 border-b border-border/10 bg-muted/5 shrink-0">
                <TrackFilters
                  params={filterParams}
                  setParams={setFilterParams}
                  hideStatus={true}
                  className="mb-0 border-none shadow-none p-0 gap-2 scale-[0.9] sm:scale-100 origin-left"
                />
              </div>

              {/* LIST: Scroll ở đây */}
              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="p-2 sm:p-4 space-y-1 pb-20">
                  {isSearching ? (
                    <TrackListSkeleton />
                  ) : searchResults.length === 0 ? (
                    <MusicResult status="empty" title="Không tìm thấy bài" />
                  ) : (
                    searchResults.map((track: Track) => {
                      const isAdded = existingTrackIds.has(track._id);
                      const isPending =
                        addMutation.isPending &&
                        addMutation.variables?.trackIds.includes(track._id);

                      return (
                        <div
                          key={track._id}
                          className="flex items-center justify-between p-2 rounded-lg transition-all active:bg-muted/50 sm:hover:bg-muted/30 border border-transparent"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                            <Avatar className="size-9 sm:size-11 rounded-md shrink-0 border border-border/10 shadow-sm">
                              <AvatarImage
                                src={track.coverImage}
                                className="object-cover"
                              />
                              <AvatarFallback>
                                <Disc className="opacity-10 size-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                                {track.title}
                              </h4>
                              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                {track.artist?.name}{" "}
                                {track.album && ` • ${track.album.title}`}
                              </p>
                            </div>
                          </div>

                          <Button
                            size={isAdded ? "sm" : "icon"}
                            variant={isAdded ? "secondary" : "default"}
                            loading={isPending}
                            disabled={isAdded}
                            onClick={() => handleAction(track._id, "add")}
                            className={cn(
                              "shrink-0",
                              isAdded
                                ? "h-7 px-3 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border-none"
                                : "size-9 rounded-full shadow-sm"
                            )}
                          >
                            {isAdded ? "ĐÃ THÊM" : <Plus className="size-4" />}
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            /* TAB MANAGE */
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-2 sm:p-4 space-y-1 pb-20">
                {currentTracks.map((track: Track, index: number) => {
                  const isPending =
                    removeMutation.isPending &&
                    removeMutation.variables?.trackIds.includes(track._id);
                  return (
                    <div
                      key={track._id}
                      className="flex items-center justify-between p-2 rounded-lg active:bg-destructive/[0.03] sm:hover:bg-destructive/[0.02] transition-all group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                        <span className="hidden sm:inline w-5 text-[10px] font-mono opacity-30 shrink-0">
                          {index + 1}
                        </span>
                        <Avatar className="size-9 rounded-md shrink-0">
                          <AvatarImage
                            src={track.coverImage}
                            className="object-cover"
                          />
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold truncate leading-tight">
                            {track.title}
                          </h4>
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                            {track.artist?.name}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        loading={isPending}
                        className="size-9 rounded-full text-muted-foreground/60 hover:text-destructive active:scale-90 shrink-0"
                        onClick={() => handleAction(track._id, "remove")}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* FOOTER: Cố định */}
        <footer className="px-4 py-3 sm:px-6 sm:py-4 border-t border-border/40 bg-background shrink-0 flex items-center justify-between">
          <p className="hidden sm:block text-[10px] text-muted-foreground font-medium italic">
            Hệ thống tự động lưu mọi thay đổi.
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={onClose}
              variant="ghost"
              className="flex-1 sm:flex-none h-10 px-6 font-bold text-[11px] uppercase rounded-xl"
            >
              Đóng
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 sm:flex-none h-10 px-8 font-bold text-[11px] uppercase rounded-xl bg-primary shadow-lg shadow-primary/20"
            >
              Hoàn tất
            </Button>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
};
