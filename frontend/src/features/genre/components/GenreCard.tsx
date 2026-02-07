import { Flame, Music } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Genre } from "@/features/genre/types";

interface GenreCardProps {
  genre: Genre;
  size?: "md" | "lg";
}

export function GenreCard({ genre, size = "md" }: GenreCardProps) {
  const bgStyle = genre.gradient
    ? { background: genre.gradient }
    : genre.color
    ? { backgroundColor: genre.color }
    : undefined;

  return (
    <Link
      to={`/genres/${genre.slug}`}
      className={cn(
        "group relative overflow-hidden",
        "rounded-2xl bg-card",
        "transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        size === "lg" ? "aspect-[16/9]" : "aspect-square"
      )}
      style={bgStyle}
    >
      {/* Background image */}
      {genre.image && (
        <img
          src={genre.image}
          alt={genre.name}
          className="absolute inset-0 h-full w-full object-cover opacity-35 group-hover:opacity-45 transition-opacity duration-300"
        />
      )}

      {/* Overlay – đảm bảo tương phản chữ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-3 sm:p-5">
        {/* Top */}
        <div className="flex items-start justify-end sm:justify-between">
          {/* Genre label – desktop only */}
          <div className="hidden sm:inline-flex items-center gap-2 rounded-md bg-black/30 px-2 py-1 backdrop-blur">
            <Music className="h-4 w-4 text-white/90" />
            <span className="text-xs font-semibold uppercase tracking-wider text-white/90">
              Genre
            </span>
          </div>

          {/* Trending */}
          {genre.isTrending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1 text-[10px] sm:text-xs font-semibold text-primary-foreground shadow-sm">
              <Flame className="h-3 w-3" />
              Hot
            </span>
          )}
        </div>

        {/* Bottom */}
        <div className="space-y-1 sm:space-y-2">
          {/* Title */}
          <h3 className="text-base sm:text-xl font-black leading-tight text-white">
            {genre.name}
          </h3>

          {/* Description – desktop only, 1 line */}
          {genre.description && (
            <p className="hidden sm:block text-xs text-white/70 line-clamp-1">
              {genre.description}
            </p>
          )}

          {/* Stats – desktop only */}
          <div className="hidden sm:flex gap-4 text-xs font-medium text-white/60">
            <span>{genre.trackCount} tracks</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
