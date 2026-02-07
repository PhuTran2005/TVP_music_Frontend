import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Play,
  Flame,
  TrendingUp,
  Music,
  Disc,
  User,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/format";

import { useBrowse } from "@/hooks/useBrowse";
import { Genre } from "@/features/genre/types";

/* -------------------------------------------------------------------------- */
/*                                 GENRE CARD                                 */
/* -------------------------------------------------------------------------- */

const GenreCard = ({
  genre,
  active,
  onClick,
}: {
  genre: Genre;
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative aspect-square rounded-2xl overflow-hidden text-left",
        "transition-all duration-300",
        "hover:scale-[1.03] hover:shadow-xl",
        active && "ring-2 ring-primary"
      )}
    >
      <ImageWithFallback
        src={genre.image}
        alt={genre.name}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div
        className={cn(
          "absolute inset-0",
          genre.gradient
            ? genre.gradient
            : "bg-gradient-to-t from-black/85 via-black/40 to-transparent"
        )}
      />

      <div className="relative h-full p-4 flex flex-col justify-between">
        {genre.isTrending && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-orange-500 text-white w-fit">
            <Flame className="w-3 h-3" /> Hot
          </span>
        )}

        <div>
          <h3 className="text-white font-bold">{genre.name}</h3>
          <p className="text-xs text-white/70">
            {formatNumber(genre?.trackCount)} tracks
          </p>
        </div>
      </div>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 ARTIST CARD                                */
/* -------------------------------------------------------------------------- */

const ArtistCard = ({ artist }: { artist: any }) => {
  return (
    <div className="group text-center cursor-pointer">
      <div className="relative aspect-square rounded-full overflow-hidden mb-3">
        <ImageWithFallback
          src={artist.avatar}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>

      <p className="font-semibold truncate">{artist.name}</p>
      <p className="text-xs text-muted-foreground">
        {formatNumber(artist.followers)} followers
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 BROWSE PAGE                                */
/* -------------------------------------------------------------------------- */

export default function BrowsePage() {
  const [selectedGenreId, setSelectedGenreId] = useState<string>("all");

  const { genres, featuredPlaylists, newReleases, trendingArtists, topTracks } =
    useBrowse(selectedGenreId === "all" ? undefined : selectedGenreId);

  const heroItem = featuredPlaylists?.[0] || newReleases?.[0];

  /* -------------------------- HERO SCROLL EFFECT -------------------------- */
  const { scrollY } = useScroll();
  const heroHeight = useTransform(scrollY, [0, 200], [260, 160]);
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.9]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* ------------------------------------------------------------------ */}
      {/*                                   HERO                             */}
      {/* ------------------------------------------------------------------ */}
      {heroItem && (
        <motion.section
          style={{ height: heroHeight, opacity: heroOpacity }}
          className="relative overflow-hidden"
        >
          <ImageWithFallback
            src={heroItem.coverImage}
            alt={heroItem.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

          <div className="relative h-full max-w-[1600px] mx-auto px-4 flex items-end pb-6">
            <div className="max-w-xl space-y-3">
              <Badge className="bg-primary text-primary-foreground">
                Gợi ý hôm nay
              </Badge>

              <h1 className="text-2xl md:text-4xl font-black leading-tight line-clamp-2">
                {heroItem.title}
              </h1>

              <Button size="sm" className="rounded-full px-6 font-semibold">
                <Play className="w-4 h-4 mr-2 fill-current" />
                Phát ngay
              </Button>
            </div>
          </div>
        </motion.section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/*                                 CONTENT                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-[1600px] mx-auto px-4 space-y-20 mt-10">
        {/* ----------------------------- GENRES ----------------------------- */}
        <section>
          <h2 className="text-xl font-bold mb-4">Khám phá theo thể loại</h2>

          {/* Mobile */}
          <div className="md:hidden flex gap-4 overflow-x-auto pb-4">
            {genres.map((genre) => (
              <div key={genre._id} className="w-[140px] shrink-0">
                <GenreCard
                  genre={genre}
                  active={selectedGenreId === genre._id}
                  onClick={() => setSelectedGenreId(genre._id)}
                />
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden md:grid grid-cols-4 lg:grid-cols-6 gap-6">
            {genres
              .sort((a, b) => b.priority - a.priority)
              .map((genre) => (
                <GenreCard
                  key={genre._id}
                  genre={genre}
                  active={selectedGenreId === genre._id}
                  onClick={() => setSelectedGenreId(genre._id)}
                />
              ))}
          </div>
        </section>

        {/* ------------------------- TRENDING ARTISTS ------------------------ */}
        {trendingArtists?.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Nghệ sĩ nổi bật
              </h2>
              <Button variant="ghost" size="sm">
                Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex gap-6 overflow-x-auto pb-2">
              {trendingArtists.map((artist) => (
                <div key={artist._id} className="w-[120px] shrink-0">
                  <ArtistCard artist={artist} />
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:grid grid-cols-4 lg:grid-cols-6 gap-8">
              {trendingArtists.map((artist) => (
                <ArtistCard key={artist._id} artist={artist} />
              ))}
            </div>
          </section>
        )}

        {/* ---------------------------- TOP TRACKS --------------------------- */}
        {topTracks?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              Đang thịnh hành
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {topTracks.map((track, i) => (
                <div
                  key={track._id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/60 transition"
                >
                  <span className="w-6 text-sm font-bold text-muted-foreground">
                    {i + 1}
                  </span>

                  <ImageWithFallback
                    src={track.coverImage}
                    alt={track.title}
                    className="w-12 h-12 rounded-md object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artist?.name}
                    </p>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {formatNumber(track.playCount)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* -------------------------- NEW RELEASES ---------------------------- */}
        <section>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <Disc className="w-5 h-5 text-pink-500" />
            Mới phát hành
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {newReleases?.map((album) => (
              <div key={album._id} className="space-y-2 cursor-pointer">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <ImageWithFallback
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover hover:scale-105 transition"
                  />
                </div>
                <p className="font-medium text-sm truncate">{album.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {album.artist?.name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
