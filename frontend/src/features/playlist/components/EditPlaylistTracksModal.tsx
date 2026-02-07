import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ListMusic,
  Plus,
  Disc,
  CheckCircle2,
  Loader2,
  Save,
  Trash2,
  MoveVertical,
  Settings2,
  X,
} from "lucide-react";
import { Track } from "@/features/track/types";

// UI Components (Shadcn + Custom)
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MusicResult from "@/components/ui/Result";
import { cn } from "@/lib/utils";

// DND Kit
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

// Hooks & Components
import {
  useAddTracksToPlaylist,
  usePlaylistDetail,
  useRemoveTrackFromPlaylist,
} from "@/features/playlist/hooks/usePlaylist";
import { usePlaylistAdmin } from "@/features/playlist/hooks/usePlaylistAdmin";
import { SortablePlaylistTrackRow } from "@/features/playlist/components/SortablePlaylistTrackRow";
import { useTrackAdmin } from "@/features/track/hooks/useTrackAdmin";
import { TrackFilters } from "@/features/track/components/TrackFilters";

/* ---------------- Skeleton Loader ---------------- */
const TrackListSkeleton = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-3 p-3 rounded-xl border border-transparent bg-muted/40 animate-pulse"
      >
        <div className="size-10 rounded-md bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 bg-muted rounded" />
          <div className="h-2 w-1/2 bg-muted rounded" />
        </div>
      </div>
    ))}
  </div>
);

interface EditPlaylistTracksModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
}

export const EditPlaylistTracksModal: React.FC<
  EditPlaylistTracksModalProps
> = ({ isOpen, onClose, playlistId }) => {
  const [activeTab, setActiveTab] = useState<"add" | "reorder" | "manage">(
    "add",
  );
  const {
    tracks: searchRes,
    isLoading: isSearching,
    filterParams,
    setFilterParams,
  } = useTrackAdmin(10);
  // Search State
  // --- API ---
  const { data: playlistRes, isLoading: isLoadingPlaylist } =
    usePlaylistDetail(playlistId);
  const { reorderTracks, isReordering } = usePlaylistAdmin();

  const addMutation = useAddTracksToPlaylist();
  const removeMutation = useRemoveTrackFromPlaylist();

  // --- Local State ---
  const [orderedTracks, setOrderedTracks] = useState<Track[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const currentTracks = useMemo(
    () => playlistRes?.data?.tracks || [],
    [playlistRes?.data?.tracks],
  );
  const searchResults = searchRes || [];

  useEffect(() => {
    if (playlistRes?.data?.tracks && !isDirty) {
      setOrderedTracks(playlistRes.data.tracks as Track[]);
    }
  }, [playlistRes?.data?.tracks, isDirty]);

  const existingTrackIds = useMemo(
    () => new Set(currentTracks.map((t: Track) => t._id)),
    [currentTracks],
  );

  // --- DND Logic ---
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrderedTracks((items) => {
      const oldIndex = items.findIndex((t) => t._id === active.id);
      const newIndex = items.findIndex((t) => t._id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
    setIsDirty(true);
  };

  const handleSaveOrder = () => {
    if (!isDirty) return onClose();

    const trackIds = orderedTracks.map((t) => t._id);

    // ✅ ĐÚNG: Truyền 3 tham số rời rạc
    reorderTracks(
      playlistId, // Tham số 1: ID
      trackIds, // Tham số 2: Mảng ID
      {
        // Tham số 3: Options
        onSuccess: () => {
          setIsDirty(false);
          onClose(); // Modal sẽ đóng sau khi API báo thành công
        },
      },
    );
  };

  const handleAction = (id: string, type: "add" | "remove") => {
    if (type === "add") {
      addMutation.mutate({ playlistId, trackIds: [id] });
    } else {
      removeMutation.mutate({ playlistId, trackIds: [id] });
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-[101] w-full max-w-4xl bg-background border border-border shadow-2xl flex flex-col h-[85vh] sm:h-[90vh] rounded-2xl animate-in zoom-in-95 duration-200 ring-1 ring-white/10 overflow-hidden">
        {/* --- HEADER --- */}
        <div className="shrink-0 px-6 py-4 border-b border-border flex justify-between items-center bg-background">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary shadow-sm">
              <ListMusic className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground leading-none">
                Manage Tracks
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-medium truncate max-w-[200px] sm:max-w-md">
                {playlistRes?.data?.title || "Loading Playlist..."}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* --- TABS & SEARCH --- */}
        <div className="shrink-0 p-2 border-b border-border bg-muted/5 space-y-3">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as any)}
            className="w-full"
          >
            <TabsList className="w-full h-10 bg-muted/50 p-1 grid grid-cols-3 gap-1 rounded-lg border border-border/40">
              {[
                { val: "add", icon: Plus, label: "Add Tracks" },
                { val: "reorder", icon: MoveVertical, label: "Reorder" },
                {
                  val: "manage",
                  icon: Settings2,
                  label: `Manage (${currentTracks.length})`,
                },
              ].map((item) => (
                <TabsTrigger
                  key={item.val}
                  value={item.val}
                  className="text-[10px] sm:text-xs font-bold uppercase gap-2 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md transition-all"
                >
                  <item.icon className="size-3.5" />
                  <span className="truncate">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Search Bar (Chỉ hiện ở Tab Add) */}
          {activeTab === "add" && (
            <div className="relative animate-in fade-in slide-in-from-top-1 duration-200">
              <TrackFilters
                params={filterParams}
                setParams={setFilterParams}
                className="mb-0"
              />
            </div>
          )}
        </div>

        {/* --- MAIN CONTENT (SCROLLABLE) --- */}
        <div className="flex-1 overflow-hidden bg-background relative flex flex-col">
          {/* TAB 1: ADD TRACKS */}
          {activeTab === "add" && (
            <ScrollArea className="flex-1 h-full">
              <div className="p-4 sm:p-6 space-y-2 pb-24">
                {isSearching ? (
                  <TrackListSkeleton />
                ) : searchResults.length === 0 ? (
                  <MusicResult
                    status="empty"
                    title="No tracks found"
                    description="Try searching for something else."
                  />
                ) : (
                  searchResults.map((track: Track) => {
                    const isAdded = existingTrackIds.has(track._id);
                    const isPending =
                      addMutation.isPending &&
                      addMutation.variables?.trackIds.includes(track._id);

                    return (
                      <div
                        key={track._id}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-xl border transition-all duration-200 select-none group",
                          isAdded
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : "bg-card border-transparent hover:border-border hover:bg-muted/30",
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                          <Avatar className="size-10 rounded-lg shrink-0 border border-border/50">
                            <AvatarImage
                              src={track.coverImage}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-muted">
                              <Disc className="size-4 opacity-30" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <h4
                              className={cn(
                                "text-sm font-bold truncate",
                                isAdded
                                  ? "text-emerald-700 dark:text-emerald-400"
                                  : "text-foreground",
                              )}
                            >
                              {track.title}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate font-medium">
                              {track.artist?.name}
                            </p>
                          </div>
                        </div>

                        <Button
                          size={isAdded ? "sm" : "icon"}
                          variant={isAdded ? "ghost" : "secondary"}
                          disabled={isAdded || isPending}
                          onClick={() => handleAction(track._id, "add")}
                          className={cn(
                            "shrink-0 transition-all rounded-full h-8 w-8 sm:w-auto sm:px-3",
                            isAdded
                              ? "text-emerald-600 bg-emerald-100/50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 cursor-default border-transparent"
                              : "shadow-sm hover:bg-primary hover:text-primary-foreground border-transparent",
                          )}
                        >
                          {isPending ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : isAdded ? (
                            <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase">
                              <CheckCircle2 className="size-3.5" />{" "}
                              <span className="hidden sm:inline">Added</span>
                            </span>
                          ) : (
                            <Plus className="size-4" />
                          )}
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          )}

          {/* TAB 2: REORDER */}
          {activeTab === "reorder" && (
            <ScrollArea className="flex-1 h-full bg-muted/5">
              <div className="p-4 sm:p-6 space-y-2 pb-24">
                {isLoadingPlaylist ? (
                  <TrackListSkeleton />
                ) : orderedTracks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
                    <div className="p-4 bg-background rounded-full border border-dashed border-border">
                      <ListMusic className="size-8 opacity-20" />
                    </div>
                    <p className="text-sm font-medium">Playlist is empty</p>
                    <Button
                      variant="link"
                      onClick={() => setActiveTab("add")}
                      className="text-primary h-auto p-0"
                    >
                      Add tracks now
                    </Button>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={orderedTracks.map((t) => t._id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {orderedTracks.map((track, index) => (
                          <SortablePlaylistTrackRow
                            key={track._id}
                            track={track}
                            index={index}
                            isRemoving={false}
                            onRemove={() => {}}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </ScrollArea>
          )}

          {/* TAB 3: MANAGE */}
          {activeTab === "manage" && (
            <ScrollArea className="flex-1 h-full">
              <div className="p-4 sm:p-6 space-y-2 pb-24">
                {currentTracks.length === 0 ? (
                  <MusicResult status="empty" title="No tracks" />
                ) : (
                  currentTracks.map((track: Track, i: number) => {
                    const isPending =
                      removeMutation.isPending &&
                      removeMutation.variables?.trackIds.includes(track._id);
                    return (
                      <div
                        key={track._id}
                        className="flex items-center justify-between p-2 rounded-xl border border-border/40 bg-card hover:bg-destructive/5 hover:border-destructive/20 transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                          <span className="w-5 text-center text-[10px] font-mono font-bold text-muted-foreground/40">
                            {i + 1}
                          </span>
                          <Avatar className="size-10 rounded-lg shrink-0 border border-border/50">
                            <AvatarImage
                              src={track.coverImage}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-muted">
                              <Disc className="size-4 opacity-30" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold truncate text-foreground group-hover:text-destructive transition-colors">
                              {track.title}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate font-medium">
                              {track.artist?.name}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={isPending}
                          onClick={() => handleAction(track._id, "remove")}
                          className="size-8 rounded-full text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          {isPending ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* --- FOOTER --- */}
        <div className="shrink-0 px-6 py-4 border-t border-border bg-background flex justify-between items-center z-20">
          <p className="hidden sm:block text-[10px] text-muted-foreground font-medium italic">
            {activeTab === "reorder"
              ? "* Drag items to reorder. Click Save to apply."
              : "* Changes are saved automatically."}
          </p>
          <div className="flex gap-3 w-full sm:w-auto justify-end">
            <Button
              onClick={onClose}
              variant="ghost"
              disabled={isReordering}
              className="font-semibold text-muted-foreground hover:text-foreground"
            >
              Close
            </Button>

            {/* Save Button (Chỉ hiện khi Reorder + Dirty) */}
            {activeTab === "reorder" && isDirty && (
              <Button
                onClick={handleSaveOrder}
                disabled={isReordering}
                className="px-6 font-bold text-xs uppercase shadow-md hover:shadow-lg transition-all bg-primary text-primary-foreground animate-in zoom-in duration-200"
              >
                {isReordering ? (
                  <Loader2 className="mr-2 size-3.5 animate-spin" />
                ) : (
                  <Save className="mr-2 size-3.5" />
                )}
                Save Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
