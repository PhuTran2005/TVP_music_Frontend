import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Heart,
  MoreHorizontal,
  Clock,
  TrendingUp,
  Search as SearchIcon,
  Music2,
  Disc,
  User,
  ListMusic,
} from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Input } from "@/components/ui/input";

// Hooks & Utils
import { useSearch } from "@/features/search/hooks/useSearch"; // Hook đã làm ở bước trước
import { cn } from "@/lib/utils";
import { SearchSkeleton } from "@/features/search/components/SearchSkeleton";

// --- MOCK TRENDING DATA (Frontend Only) ---
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
  const navigate = useNavigate();

  // 1. Lấy query từ URL (?q=...)
  const query = searchParams.get("q") || "";
  const [localInput, setLocalInput] = useState(query);

  // 2. Fetch Data Realtime (Hook tự handle Debounce)
  const { data, isLoading, isError } = useSearch(query);

  // Sync input với URL khi URL thay đổi (VD: Search từ Header)
  useEffect(() => {
    setLocalInput(query);
  }, [query]);

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalInput(val);
    // Update URL để trigger search (có thể debounce ở đây hoặc trong hook)
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const handleTrendingClick = (term: string) => {
    setLocalInput(term);
    setSearchParams({ q: term });
  };

  // --- RENDER SECTIONS ---

  // 1. TOP RESULT RENDERER
  const renderTopResult = () => {
    if (!data?.topResult) return null;

    const { topResult } = data;
    const isArtist = topResult.type === "artist";

    return (
      <section>
        <h2 className="text-2xl font-bold mb-4">Top result</h2>
        <Link
          to={
            isArtist
              ? `/artists/${topResult.slug}`
              : `/tracks/${topResult.slug}`
          }
        >
          <Card className="group cursor-pointer hover:bg-accent/50 transition-colors border-border/50 bg-card/50 max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <ImageWithFallback
                    src={isArtist ? topResult.avatar : topResult.coverImage}
                    alt={isArtist ? topResult.name : topResult.title}
                    className={cn(
                      "w-24 h-24 object-cover shadow-lg",
                      isArtist ? "rounded-full" : "rounded-md"
                    )}
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                    <Button
                      size="icon"
                      className="rounded-full h-12 w-12 shadow-xl bg-primary text-primary-foreground hover:scale-105 transition-transform"
                    >
                      <Play className="h-6 w-6 fill-current ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold mb-1 truncate">
                    {isArtist ? topResult.name : topResult.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="uppercase text-[10px] tracking-wider"
                    >
                      {topResult.type}
                    </Badge>
                    {!isArtist && (
                      <span className="text-sm text-muted-foreground truncate">
                        {topResult.artist.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </section>
    );
  };

  // 2. SONGS LIST RENDERER
  const renderSongs = () => {
    if (!data?.tracks?.length) return null;

    return (
      <section>
        <h2 className="text-2xl font-bold mb-4">Songs</h2>
        <div className="space-y-1">
          {data.tracks.map((track, index) => (
            <motion.div
              key={track._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors cursor-pointer group"
            >
              <div className="relative shrink-0">
                <ImageWithFallback
                  src={track.coverImage}
                  alt={track.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                  <Play className="h-4 w-4 text-white fill-current" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/tracks/${track.slug}`}
                  className="font-medium truncate hover:underline block text-sm"
                >
                  {track.title}
                </Link>
                <Link
                  to={`/artists/${track.artist.slug}`}
                  className="text-xs text-muted-foreground truncate hover:underline"
                >
                  {track.artist.name}
                </Link>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {Math.floor(track.duration / 60)}:
                  {(track.duration % 60).toString().padStart(2, "0")}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-muted-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  // 3. GRID RENDERER (Artists/Albums/Playlists)
  const renderGrid = (
    title: string,
    items: any[],
    type: "artist" | "album" | "playlist"
  ) => {
    if (!items?.length) return null;

    return (
      <section>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/${type}s/${item.slug || item._id}`}>
                <Card className="h-full border-none bg-transparent hover:bg-accent/50 transition-colors shadow-none">
                  <CardContent className="p-3">
                    <div className="relative mb-3 group">
                      <ImageWithFallback
                        src={type === "artist" ? item.avatar : item.coverImage}
                        alt={item.title || item.name}
                        className={cn(
                          "w-full aspect-square object-cover shadow-sm",
                          type === "artist" ? "rounded-full" : "rounded-md"
                        )}
                      />
                      <div
                        className={cn(
                          "absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0",
                          type === "artist" ? "bottom-0 right-0" : ""
                        )}
                      >
                        <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-xl">
                          <Play className="h-5 w-5 fill-current" />
                        </div>
                      </div>
                    </div>

                    <h4 className="font-semibold truncate text-sm mb-1">
                      {item.title || item.name}
                    </h4>

                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      {type === "artist" && <User className="h-3 w-3" />}
                      {type === "album" && <Disc className="h-3 w-3" />}
                      {type === "playlist" && <ListMusic className="h-3 w-3" />}

                      {type === "artist" && "Artist"}
                      {type === "album" && `${item.artist?.name} • Album`}
                      {type === "playlist" && `By ${item.user?.fullName}`}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    );
  };

  // --- MAIN RENDER ---
  return (
    <div className="container px-4 lg:px-8 py-6 min-h-[calc(100vh-80px)]">
      {/* Search Input (Visible on Page mainly for mobile or emphasis) */}
      <div className="mb-8 relative max-w-2xl mx-auto lg:mx-0">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          className="pl-12 h-12 text-lg rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-primary/50 transition-all"
          placeholder="What do you want to listen to?"
          value={localInput}
          onChange={handleInputChange}
        />
      </div>

      <AnimatePresence mode="wait">
        {!query ? (
          /* EMPTY STATE (Start Page) */
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Trending
                Searches
              </h2>
              <div className="flex flex-wrap gap-3">
                {trendingSearches.map((term) => (
                  <Badge
                    key={term}
                    variant="secondary"
                    className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
                    onClick={() => handleTrendingClick(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Có thể thêm Browse Categories ở đây (Moods, Genres...) */}
          </motion.div>
        ) : isLoading ? (
          /* LOADING STATE */
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <SearchSkeleton />
          </motion.div>
        ) : isError ? (
          /* ERROR STATE */
          <div className="text-center py-20 text-muted-foreground">
            <p>Something went wrong. Please try again.</p>
          </div>
        ) : (
          /* RESULTS STATE */
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10 pb-20"
          >
            {/* Nếu không có kết quả nào */}
            {!data?.topResult &&
              !data?.tracks.length &&
              !data?.artists.length && (
                <div className="text-center py-20">
                  <h3 className="text-xl font-bold mb-2">
                    No results found for "{query}"
                  </h3>
                  <p className="text-muted-foreground">
                    Please make sure your words are spelled correctly or use
                    less or different keywords.
                  </p>
                </div>
              )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left Column: Top Result */}
              <div className="lg:col-span-2 space-y-8">{renderTopResult()}</div>

              {/* Right Column: Songs */}
              <div className="lg:col-span-3 space-y-8">{renderSongs()}</div>
            </div>

            <Separator className="my-6 opacity-50" />

            {/* Other Grids */}
            {renderGrid("Artists", data?.artists || [], "artist")}
            {renderGrid("Albums", data?.albums || [], "album")}
            {renderGrid("Playlists", data?.playlists || [], "playlist")}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
