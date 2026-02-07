import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Heart,
  MoreHorizontal,
  TrendingUp,
  Search as SearchIcon,
  Music2,
  X,
} from "lucide-react";

// UI
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Input } from "@/components/ui/input";

// Hooks & Utils
import { useSearch } from "@/features/search/hooks/useSearch";
import { cn } from "@/lib/utils";
import { SearchSkeleton } from "@/features/search/components/SearchSkeleton";
import { formatDuration } from "@/utils/track-helper";

const trendingSearches = [
  "Son Tung M-TP",
  "Chill vibes",
  "Pop Ballad",
  "Rap Viet",
  "Indie",
  "Workout",
  "New Releases",
  "Lo-fi",
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [localInput, setLocalInput] = useState(query);
  const { data, isLoading, isError } = useSearch(query);

  useEffect(() => {
    setLocalInput(query);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalInput(val);
    val.trim() ? setSearchParams({ q: val }) : setSearchParams({});
  };

  const clearSearch = () => {
    setLocalInput("");
    setSearchParams({});
  };

  /* ---------------- TOP RESULT - Enhanced Contrast & Hierarchy ---------------- */
  const renderTopResult = () => {
    if (!data?.topResult) return null;
    const item = data.topResult;
    const isArtist = item.type === "artist";

    return (
      <section className="space-y-5">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          Top Result
        </h2>

        <Link to={isArtist ? `/artists/${item.slug}` : `/tracks/${item.slug}`}>
          <Card
            className="
              group relative overflow-hidden
              bg-card border-border/60
              hover:border-primary/40
              transition-all duration-300
              shadow-md hover:shadow-xl hover:shadow-primary/10
              rounded-2xl
            "
          >
            <CardContent className="p-6 md:p-8 flex gap-5 md:gap-6 items-center">
              {/* Image with Better Shadow */}
              <div className="relative shrink-0">
                <ImageWithFallback
                  src={isArtist ? item.avatar : item.coverImage}
                  alt={item.name || item.title}
                  className={cn(
                    "w-28 h-28 md:w-36 md:h-36 object-cover shadow-2xl ring-1 ring-border/50",
                    isArtist ? "rounded-full" : "rounded-xl"
                  )}
                />
                {/* Ambient glow */}
                <div
                  className={cn(
                    "absolute inset-0 -z-10 blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500",
                    isArtist ? "rounded-full" : "rounded-xl",
                    "bg-primary"
                  )}
                />
              </div>

              {/* Content with Better Typography */}
              <div className="flex-1 min-w-0 space-y-3">
                <h3 className="text-2xl md:text-4xl font-extrabold leading-tight truncate text-foreground">
                  {item.name || item.title}
                </h3>

                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="uppercase text-[11px] font-bold tracking-wider px-3 py-1 bg-primary/15 text-primary border-primary/20"
                  >
                    {item.type}
                  </Badge>
                  {!isArtist && (
                    <span className="text-sm md:text-base text-muted-foreground/90 truncate font-medium">
                      {item.artist?.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Play Button - Enhanced */}
              <Button
                size="icon"
                className="
                  hidden md:flex shrink-0
                  h-16 w-16 rounded-full
                  bg-primary text-primary-foreground
                  shadow-[0_8px_32px_rgba(147,51,234,0.4)]
                  hover:scale-110 hover:shadow-[0_12px_48px_rgba(147,51,234,0.5)]
                  active:scale-95
                  transition-all duration-300
                "
              >
                <Play className="h-7 w-7 fill-current ml-1" />
              </Button>
            </CardContent>

            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          </Card>
        </Link>
      </section>
    );
  };

  /* ---------------- SONG LIST - Improved Contrast & Interaction ---------------- */
  const renderSongs = () => {
    if (!data?.tracks?.length) return null;

    return (
      <section className="space-y-5">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          Songs
        </h2>

        <div className="space-y-2">
          {data.tracks.slice(0, 5).map((track, i) => (
            <motion.div
              key={track._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="
                group flex items-center gap-4
                px-4 py-3
                rounded-xl
                hover:bg-muted/80
                border border-transparent hover:border-border/60
                transition-all duration-200
              "
            >
              {/* Album Art with Play Overlay */}
              <div className="relative w-14 h-14 shrink-0">
                <ImageWithFallback
                  src={track.coverImage}
                  alt={track.title}
                  className="w-full h-full rounded-lg object-cover ring-1 ring-border/40"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-200">
                  <Play className="h-5 w-5 text-white fill-current" />
                </div>
              </div>

              {/* Track Info - Better Typography */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/tracks/${track.slug}`}
                  className="font-semibold text-base text-foreground truncate block hover:text-primary transition-colors"
                >
                  {track.title}
                </Link>
                <span className="text-sm text-muted-foreground/80 truncate block mt-0.5">
                  {track.artist?.name}
                </span>
              </div>

              {/* Duration */}
              <span className="hidden sm:block text-sm text-muted-foreground/70 tabular-nums font-medium">
                {formatDuration(track.duration || 0)}
              </span>

              {/* More Options */}
              <Button
                size="icon"
                variant="ghost"
                className="hidden md:flex h-9 w-9 opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  /* ---------------- GRID SECTION - Enhanced Cards ---------------- */
  const renderGrid = (title: string, items: any[], type: string) => {
    if (!items?.length) return null;

    return (
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link to={`/${type}s/${item.slug || item._id}`}>
                <div
                  className="
                    group
                    bg-card p-4 md:p-5 rounded-2xl
                    border border-transparent
                    hover:bg-muted/60 hover:border-border/60
                    transition-all duration-300
                    hover:shadow-lg
                  "
                >
                  {/* Image Container */}
                  <div className="relative aspect-square mb-4">
                    <ImageWithFallback
                      src={type === "artist" ? item.avatar : item.coverImage}
                      alt={item.name || item.title}
                      className={cn(
                        "w-full h-full object-cover shadow-md ring-1 ring-border/40",
                        "group-hover:shadow-xl transition-all duration-300",
                        type === "artist" ? "rounded-full" : "rounded-xl"
                      )}
                    />

                    {/* Play button overlay for non-artist items */}
                    {type !== "artist" && (
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <Button
                          size="icon"
                          className="h-12 w-12 rounded-full bg-primary shadow-lg hover:scale-110"
                        >
                          <Play className="h-5 w-5 fill-current ml-0.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Text Content - Better Hierarchy */}
                  <h4 className="font-bold text-sm md:text-base truncate text-foreground mb-1">
                    {item.name || item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground/70 uppercase tracking-wide font-semibold">
                    {type}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  /* ================= MAIN RENDER ================= */
  return (
    <div className="container px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12 max-w-[1600px] mx-auto">
      {/* SEARCH BAR - Enhanced Design */}
      <div className="max-w-4xl mx-auto mb-10 md:mb-14">
        <div className="relative">
          <SearchIcon className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-muted-foreground/60 pointer-events-none z-10" />
          <Input
            value={localInput}
            onChange={handleInputChange}
            placeholder="What do you want to listen to?"
            className="
              pl-14 md:pl-16 pr-14 md:pr-16
              h-14 md:h-[72px]
              text-base md:text-xl font-semibold
              rounded-full
              bg-card
              border-2 border-border/60
              hover:border-border
              focus:border-primary/60 focus:bg-background
              focus:ring-4 focus:ring-primary/15
              placeholder:text-muted-foreground/50
              shadow-sm hover:shadow-md
              transition-all duration-300
            "
          />
          {localInput && (
            <button
              onClick={clearSearch}
              className="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 z-10 hover:bg-muted rounded-full p-2 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!query ? (
          // EMPTY STATE - Improved Design
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-sm md:text-base font-bold uppercase tracking-widest text-foreground">
                Trending Searches
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {trendingSearches.map((term) => (
                <Badge
                  key={term}
                  variant="outline"
                  className="
                    cursor-pointer px-5 py-2.5 rounded-full
                    text-sm font-semibold
                    border-2 border-border/60
                    hover:border-primary/60 hover:bg-primary/10 hover:text-primary
                    transition-all duration-300
                    hover:shadow-md hover:shadow-primary/10
                  "
                  onClick={() => setSearchParams({ q: term })}
                >
                  {term}
                </Badge>
              ))}
            </div>

            <div className="pt-24 md:pt-32 text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-muted/40 mb-6">
                <Music2 className="h-16 w-16 text-muted-foreground/30" />
              </div>
              <p className="text-base text-muted-foreground/60 font-medium">
                Start typing to discover music
              </p>
            </div>
          </motion.div>
        ) : isLoading ? (
          <SearchSkeleton />
        ) : isError ? (
          <div className="text-center py-24">
            <p className="text-lg text-muted-foreground">
              Something went wrong. Please try again.
            </p>
          </div>
        ) : (
          // SEARCH RESULTS - Better Layout
          <div className="space-y-12 md:space-y-16">
            {(data?.topResult || data?.tracks?.length) && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
                <div className="lg:col-span-2">{renderTopResult()}</div>
                <div className="lg:col-span-3">{renderSongs()}</div>
              </div>
            )}

            {renderGrid("Artists", data?.artists || [], "artist")}
            {renderGrid("Albums", data?.albums || [], "album")}
            {renderGrid("Playlists", data?.playlists || [], "playlist")}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
