import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  MoreHorizontal,
  TrendingUp,
  Search as SearchIcon,
  Music2,
  X,
  Loader2,
  Mic2,
  Disc3,
  ListMusic,
  History,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Input } from "@/components/ui/input";

// Premium Cards
import PublicArtistCard from "@/features/artist/components/PublicArtistCard";
import PublicAlbumCard from "@/features/album/components/PublicAlbumCard";
import PublicPlaylistCard from "@/features/playlist/components/PublicPlaylistCard";

// Hooks & Utils
import { useSearch } from "@/features/search/hooks/useSearch";
import { cn } from "@/lib/utils";
import { SearchSkeleton } from "@/features/search/components/SearchSkeleton";
import { formatDuration } from "@/utils/track-helper";

// Redux
// import { useAppDispatch } from "@/store/hooks";
// import { setQueue, setIsPlaying } from "@/features/player/playerSlice";

const TRENDING_SEARCHES = [
  "Sơn Tùng M-TP",
  "Chill cùng Indie",
  "Pop Ballad",
  "Rap Việt",
  "Nhạc Trẻ",
  "Tập Gym",
  "Mới Phát Hành",
  "Lo-fi Nhẹ Nhàng",
];

const MAX_RECENT_SEARCHES = 10;

// 🔥 CẤU HÌNH TABS
const SEARCH_TABS = [
  { id: "all", label: "Tất cả" },
  { id: "track", label: "Bài hát" },
  { id: "artist", label: "Nghệ sĩ" },
  { id: "album", label: "Đĩa nhạc" },
  { id: "playlist", label: "Danh sách phát" },
] as const;

type SearchTab = (typeof SEARCH_TABS)[number]["id"];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

export default function SearchPage() {
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [localInput, setLocalInput] = useState(query);

  const { data, isLoading, isError } = useSearch(query);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Lịch sử & Tab State
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<SearchTab>("all");

  // Reset tab về "Tất cả" nếu xóa search
  useEffect(() => {
    if (!query) setActiveTab("all");
  }, [query]);

  // Load Lịch sử
  useEffect(() => {
    const savedHistory = localStorage.getItem("recentSearches");
    if (savedHistory) {
      try {
        setRecentSearches(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Parse history failed");
      }
    }
  }, []);

  const saveToHistory = (term: string) => {
    const trimmedTerm = term.trim();
    if (!trimmedTerm) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (t) => t.toLowerCase() !== trimmedTerm.toLowerCase(),
      );
      const updated = [trimmedTerm, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  const removeHistoryItem = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== term);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
    toast.success("Đã xóa lịch sử tìm kiếm");
  };

  // Handlers Input
  useEffect(() => {
    setLocalInput(query);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalInput(val);
    if (val.trim()) setSearchParams({ q: val });
    else setSearchParams({});
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && localInput.trim()) saveToHistory(localInput);
  };

  const handleTagClick = (term: string) => {
    setSearchParams({ q: term });
    saveToHistory(term);
  };

  const handleResultClick = (url: string) => {
    if (query) saveToHistory(query);
    navigate(url);
  };

  const clearSearch = () => {
    setLocalInput("");
    setSearchParams({});
    setActiveTab("all");
  };

  const handlePlayTrack = async (e: React.MouseEvent, track: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (query) saveToHistory(query);

    setPlayingId(track._id);
    try {
      // dispatch(setQueue({ tracks: [track], startIndex: 0 }));
      // dispatch(setIsPlaying(true));
      await new Promise((resolve) => setTimeout(resolve, 400));
      toast.success(`Đang phát: ${track.title}`);
    } catch (err) {
      toast.error("Không thể phát nhạc lúc này.");
    } finally {
      setPlayingId(null);
    }
  };

  const isNoResults = useMemo(() => {
    if (isLoading || !query) return false;
    if (activeTab === "track") return !data?.tracks?.length;
    if (activeTab === "artist") return !data?.artists?.length;
    if (activeTab === "album") return !data?.albums?.length;
    if (activeTab === "playlist") return !data?.playlists?.length;
    return (
      !data?.topResult &&
      !data?.tracks?.length &&
      !data?.artists?.length &&
      !data?.albums?.length &&
      !data?.playlists?.length
    );
  }, [data, isLoading, query, activeTab]);

  /* ================= 1. KẾT QUẢ HÀNG ĐẦU ================= */
  const renderTopResult = () => {
    if (!data?.topResult || activeTab !== "all") return null;
    const item = data.topResult;
    const isArtist = item.type === "artist";
    const isLoadingThis = playingId === item._id;
    const itemUrl = isArtist
      ? `/artist/${item.slug || item._id}`
      : `/tracks/${item.slug || item._id}`;

    return (
      <motion.section variants={itemVariants} className="space-y-4 h-full">
        <h2 className="text-xl sm:text-2xl font-black tracking-tighter text-foreground uppercase">
          Kết quả hàng đầu
        </h2>

        <div
          onClick={() => handleResultClick(itemUrl)}
          className="group relative h-[calc(100%-44px)] min-h-[220px] overflow-hidden bg-card/60 backdrop-blur-md border border-border/40 hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-xl rounded-[1.5rem] sm:rounded-[2rem] cursor-pointer flex flex-col justify-center"
        >
          <CardContent className="p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row gap-5 md:gap-8 items-start sm:items-center relative z-10">
            <div className="relative shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36">
              <ImageWithFallback
                src={isArtist ? item.avatar : item.coverImage}
                alt={item.name || item.title}
                className={cn(
                  "w-full h-full object-cover shadow-xl transition-transform duration-[800ms] ease-out group-hover:scale-105",
                  isArtist
                    ? "rounded-full border border-border/50"
                    : "rounded-2xl",
                )}
              />
              <div
                className={cn(
                  "absolute inset-0 -z-10 blur-[40px] opacity-20 group-hover:opacity-50 transition-opacity duration-700 bg-primary",
                  isArtist ? "rounded-full" : "rounded-2xl",
                )}
              />
            </div>

            <div className="flex-1 min-w-0 space-y-2 sm:space-y-3 w-full">
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 break-words">
                {item.name || item.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge className="uppercase text-[10px] sm:text-[11px] font-black tracking-widest px-3 py-1 bg-primary/10 text-primary border-none shadow-none">
                  {isArtist ? "Nghệ sĩ" : "Bài hát"}
                </Badge>
                {!isArtist && (
                  <span className="text-sm sm:text-base text-muted-foreground font-semibold truncate group-hover:underline">
                    {item.artist?.name || "Unknown Artist"}
                  </span>
                )}
              </div>
            </div>

            {!isArtist && (
              <Button
                size="icon"
                onClick={(e) => handlePlayTrack(e, item)}
                disabled={isLoadingThis}
                className="absolute bottom-5 right-5 sm:relative sm:bottom-0 sm:right-0 shrink-0 size-12 sm:size-16 rounded-full bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(var(--primary),0.4)] hover:scale-110 active:scale-95 transition-all"
              >
                {isLoadingThis ? (
                  <Loader2 className="size-5 sm:size-7 animate-spin" />
                ) : (
                  <Play className="size-5 sm:size-7 fill-current ml-1" />
                )}
              </Button>
            )}
          </CardContent>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-background/5 pointer-events-none" />
        </div>
      </motion.section>
    );
  };

  /* ================= 2. DANH SÁCH BÀI HÁT ================= */
  const renderSongs = () => {
    if (!data?.tracks?.length) return null;
    if (activeTab !== "all" && activeTab !== "track") return null;

    const displayTracks =
      activeTab === "all" ? data.tracks.slice(0, 4) : data.tracks;

    return (
      <motion.section variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black tracking-tighter text-foreground uppercase">
            Bài hát
          </h2>
          {activeTab === "all" && data.tracks.length > 4 && (
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary font-bold text-[11px] sm:text-xs uppercase tracking-widest gap-1 pr-0"
              onClick={() => setActiveTab("track")}
            >
              Xem tất cả <ChevronRight className="size-4" />
            </Button>
          )}
        </div>

        <div
          className={cn(
            "flex flex-col gap-1 sm:gap-2",
            activeTab === "track" &&
              "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2",
          )}
        >
          {displayTracks.map((track) => {
            const isLoadingThis = playingId === track._id;
            return (
              <div
                key={track._id}
                onClick={(e) => handlePlayTrack(e, track)}
                className="group flex items-center gap-3 sm:gap-4 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl hover:bg-muted/60 border border-transparent transition-colors cursor-pointer"
              >
                <div className="relative size-12 sm:size-14 shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-muted shadow-sm border border-border/40">
                  <ImageWithFallback
                    src={track.coverImage}
                    alt={track.title}
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className={cn(
                      "absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center transition-all",
                      isLoadingThis
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100",
                    )}
                  >
                    {isLoadingThis ? (
                      <Loader2 className="size-5 sm:size-6 text-white animate-spin" />
                    ) : (
                      <Play className="size-5 sm:size-6 text-white fill-white ml-0.5" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="font-bold text-[14px] sm:text-[15px] text-foreground truncate group-hover:text-primary transition-colors">
                    {track.title}
                  </h4>
                  <p
                    className="text-[12px] sm:text-[13px] text-muted-foreground font-medium truncate mt-0.5 hover:underline hover:text-foreground w-fit transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResultClick(`/artist/${track.artist?.slug}`);
                    }}
                  >
                    {track.artist?.name || "Unknown Artist"}
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <span className="hidden sm:block text-[13px] font-mono text-muted-foreground/70 font-medium w-10 text-right">
                    {formatDuration(track.duration || 0)}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity size-8 sm:size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-background"
                  >
                    <MoreHorizontal className="size-5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>
    );
  };

  /* ================= 3. RENDER GRIDS CÁC LOẠI ================= */
  const renderGridSection = (
    title: string,
    items: any[],
    type: SearchTab,
    icon: any,
  ) => {
    if (!items?.length) return null;
    if (activeTab !== "all" && activeTab !== type) return null;

    const limit = activeTab === "all" ? 6 : items.length;
    const displayItems = items.slice(0, limit);

    return (
      <motion.section
        variants={itemVariants}
        className="space-y-4 sm:space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black tracking-tighter text-foreground uppercase flex items-center gap-2.5">
            {title} <span className="hidden sm:block opacity-80">{icon}</span>
          </h2>
          {activeTab === "all" && items.length > 6 && (
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary font-bold text-[11px] sm:text-xs uppercase tracking-widest gap-1 pr-0"
              onClick={() => setActiveTab(type)}
            >
              Xem tất cả <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {displayItems.map((item) => (
            <div
              key={item._id}
              onClick={() => {
                if (query) saveToHistory(query);
              }}
            >
              {type === "artist" && <PublicArtistCard artist={item} />}
              {type === "album" && <PublicAlbumCard album={item} />}
              {type === "playlist" && <PublicPlaylistCard playlist={item} />}
            </div>
          ))}
        </div>
      </motion.section>
    );
  };

  /* ================= MAIN RENDER ================= */
  return (
    // 🔥 BỎ `overflow-x-hidden` ĐỂ STICKY HOẠT ĐỘNG! Thêm `clip-path` nếu cần giữ Glow không tràn ra ngoài.
    <div className="relative min-h-screen bg-background pb-32">
      {/* Background Glow tinh tế */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* --- CỤM STICKY HEADER (SEARCH + TABS) --- */}
      {/* 🔥 Chỉnh `top-0` (nếu không có Navbar trên đầu) hoặc `top-[64px]` (nếu Navbar cao 64px). Bắt buộc phải có `top` thì mới Sticky được! */}
      <div className="sticky top-[56px] lg:top-[64px] z-50 bg-background/85 backdrop-blur-2xl border-b border-border/40 shadow-sm transition-all pb-1 sm:pb-2 pt-2 sm:pt-4">
        <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          {/* Ô Tìm Kiếm */}
          <div className="relative group w-full max-w-4xl mx-auto">
            <SearchIcon className="absolute left-4 sm:left-5 size-5 sm:size-6 text-muted-foreground/60 group-focus-within:text-primary transition-colors z-10 top-1/2 -translate-y-1/2" />
            <Input
              value={localInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Bạn muốn nghe gì hôm nay?"
              autoFocus
              className="pl-12 sm:pl-14 pr-12 h-12 sm:h-14 lg:h-16 text-base sm:text-lg lg:text-xl font-bold rounded-full bg-card border-2 border-border/60 hover:border-primary/40 focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary placeholder:text-muted-foreground/40 shadow-sm transition-all w-full"
            />
            {localInput && (
              <button
                onClick={clearSearch}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="size-4 sm:size-5" />
              </button>
            )}
          </div>

          {/* Thanh Tabs Phân Loại */}
          <AnimatePresence>
            {query && !isLoading && !isError && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 sm:mt-4 overflow-hidden"
              >
                {/* Ẩn scrollbar, cho phép cuộn ngang mượt mà trên mobile */}
                <div className="flex gap-2 sm:gap-3 overflow-x-auto hide-scrollbar pb-2 snap-x max-w-4xl mx-auto">
                  {SEARCH_TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "snap-start shrink-0 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-[13px] sm:text-[14px] font-bold transition-all duration-300 border-2",
                          isActive
                            ? "bg-foreground text-background border-foreground shadow-md"
                            : "bg-muted/50 text-foreground/80 border-transparent hover:bg-muted hover:text-foreground hover:border-border/50",
                        )}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-8 md:py-10 relative z-10">
        <AnimatePresence mode="wait">
          {/* STATE 1: KHÔNG GÕ GÌ (RECENT & TRENDING) */}
          {!query ? (
            <motion.div
              key="trending"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12 max-w-4xl mx-auto mt-4"
            >
              {/* Lịch sử */}
              {recentSearches.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-foreground">
                      <History className="size-5 text-primary" />
                      <h2 className="text-sm sm:text-base font-black uppercase tracking-widest">
                        Lịch sử tìm kiếm
                      </h2>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={clearAllHistory}
                      className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 rounded-full px-3"
                    >
                      Xóa tất cả
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {recentSearches.map((term) => (
                      <Badge
                        key={term}
                        variant="secondary"
                        onClick={() => handleTagClick(term)}
                        className="group flex items-center gap-1.5 cursor-pointer pl-4 pr-1.5 py-1.5 sm:py-2 rounded-full text-[13px] sm:text-[14px] font-semibold bg-muted/60 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                      >
                        <span className="pb-0.5">{term}</span>
                        <div
                          className="p-1.5 rounded-full text-muted-foreground hover:bg-background hover:text-destructive hover:shadow-sm transition-all"
                          onClick={(e) => removeHistoryItem(e, term)}
                          title="Xóa khỏi lịch sử"
                        >
                          <X className="size-3.5 stroke-[3]" />
                        </div>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Xu hướng */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="size-5 text-primary" />
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-widest text-foreground">
                    Xu hướng tìm kiếm
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {TRENDING_SEARCHES.map((term) => (
                    <Badge
                      key={term}
                      variant="outline"
                      onClick={() => handleTagClick(term)}
                      className="cursor-pointer px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[13px] sm:text-[14px] font-bold border border-border/60 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all hover:-translate-y-1 hover:shadow-md bg-card"
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : // STATE 2: LOADING
          isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-8"
            >
              <SearchSkeleton />
            </motion.div>
          ) : // STATE 3: LỖI SERVER
          isError ? (
            <motion.div key="error" className="text-center py-32 space-y-4">
              <div className="size-20 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-2">
                <X className="size-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">Lỗi kết nối</h3>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-4 rounded-full font-bold"
              >
                Thử lại
              </Button>
            </motion.div>
          ) : // STATE 4: TRỐNG
          isNoResults ? (
            <motion.div
              key="no-results"
              className="text-center py-24 sm:py-32 space-y-6 animate-in fade-in"
            >
              <div className="inline-flex items-center justify-center size-28 rounded-full bg-muted/40 border-2 border-dashed border-border/80">
                <SearchIcon className="size-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                Không tìm thấy kết quả ở mục này
              </h3>
            </motion.div>
          ) : (
            // STATE 5: KẾT QUẢ THÀNH CÔNG
            <motion.div
              key={`results-${activeTab}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-10 sm:space-y-14 mt-4"
            >
              {/* TOP RESULT & SONGS */}
              {(activeTab === "all" || activeTab === "track") &&
                (data?.topResult || data?.tracks?.length > 0) && (
                  <div
                    className={cn(
                      "grid gap-8 lg:gap-10 xl:gap-16",
                      activeTab === "all"
                        ? "grid-cols-1 lg:grid-cols-12"
                        : "grid-cols-1",
                    )}
                  >
                    {activeTab === "all" && data?.topResult && (
                      <div className="lg:col-span-5 xl:col-span-4">
                        {renderTopResult()}
                      </div>
                    )}
                    {data?.tracks?.length > 0 && (
                      <div
                        className={
                          activeTab === "all" && data?.topResult
                            ? "lg:col-span-7 xl:col-span-8"
                            : "lg:col-span-12"
                        }
                      >
                        {renderSongs()}
                      </div>
                    )}
                  </div>
                )}

              {/* VÙNG GRIDS */}
              <div className="space-y-12 sm:space-y-16">
                {renderGridSection(
                  "Nghệ sĩ",
                  data?.artists || [],
                  "artist",
                  <Mic2 className="size-5 sm:size-6 text-primary" />,
                )}
                {renderGridSection(
                  "Tuyển tập đĩa nhạc",
                  data?.albums || [],
                  "album",
                  <Disc3 className="size-5 sm:size-6 text-primary" />,
                )}
                {renderGridSection(
                  "Danh sách phát",
                  data?.playlists || [],
                  "playlist",
                  <ListMusic className="size-5 sm:size-6 text-primary" />,
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
