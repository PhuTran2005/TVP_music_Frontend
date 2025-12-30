import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Artist } from "@/features/artist/types";
import { cn } from "@/lib/utils";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ShieldCheck,
  Eye,
  EyeOff,
  Music,
  Users,
  Mic2,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitialsTextAvartar } from "@/utils/genTextAvartar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

// Helper lấy flag chuyên nghiệp hơn
const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

interface ArtistCardProps {
  artist: Artist;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  onEdit,
  onDelete,
  onToggle,
}) => {
  const naviagte = useNavigate();
  return (
    <TooltipProvider>
      <div
        className={cn(
          "group relative flex flex-col bg-card border border-border rounded-3xl overflow-hidden transition-all duration-500",
          "hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-primary/40 hover:-translate-y-1.5",
          !artist.isActive && "opacity-80 grayscale-[0.5] shadow-none"
        )}
      >
        {/* --- 1. COVER IMAGE AREA --- */}
        <div className="relative h-32 w-full overflow-hidden">
          {artist.coverImage ? (
            <img
              src={artist.coverImage}
              alt={artist.name}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-primary/10 via-muted to-primary/5 flex items-center justify-center">
              <Music className="size-10 text-primary/10" />
            </div>
          )}

          {/* Overlay gradient tinh tế */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

          {/* Top Actions Buttons (Glassmorphism) */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-20">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full backdrop-blur-md border border-white/10 transition-all active:scale-95",
                    artist.isActive
                      ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/40 hover:text-emerald-100"
                      : "bg-black/30 text-white/60 hover:bg-black/50"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                >
                  {artist.isActive ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeOff className="size-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-[11px] font-bold">
                {artist.isActive ? "Visible on Platform" : "Hidden Profile"}
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 rounded-full transition-all"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 rounded-xl shadow-xl border-border/50"
              >
                <DropdownMenuItem
                  onClick={onEdit}
                  className="cursor-pointer py-2"
                >
                  <Edit className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Edit Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer py-2">
                  <ExternalLink className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">View Public Page</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer py-2"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span className="font-bold">Delete Artist</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* --- 2. INFORMATION AREA --- */}
        <div className="flex flex-col items-center px-5 pb-6 -mt-12 relative z-10 flex-1 bg-card rounded-t-3xl border-t border-white/5">
          {/* Avatar Area */}
          <div className="relative mb-4">
            <div
              className="rounded-full p-1 bg-card shadow-sm border border-border/20"
              onClick={() => naviagte(`/artists/${artist.slug}`)}
            >
              <Avatar className="size-20 ring-4 ring-background shadow-2xl">
                <AvatarImage src={artist.avatar} className="object-cover" />
                <AvatarFallback className="bg-primary/5 text-primary font-black text-xl tracking-tighter">
                  {getInitialsTextAvartar(artist.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            {artist.isVerified && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute bottom-1 right-1 bg-blue-500 p-1.5 rounded-full border-4 border-card shadow-lg animate-in zoom-in duration-500 delay-300">
                    <ShieldCheck className="size-3 text-white fill-current" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-blue-600 text-white border-0 font-bold text-[10px] px-2 py-1">
                  VERIFIED OFFICIAL
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Name & Region */}
          <div className="text-center w-full space-y-1.5 mb-5">
            <h3 className="font-bold text-base text-foreground tracking-tight line-clamp-1 flex items-center justify-center gap-2 px-2">
              {artist.name}
              {artist.nationality && (
                <span
                  className="text-base select-none grayscale-[0.2]"
                  title={`Origin: ${artist.nationality}`}
                >
                  {getFlagEmoji(artist.nationality)}
                </span>
              )}
            </h3>

            <div className="flex items-center justify-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "h-5 text-[9px] px-2 font-black uppercase tracking-[0.05em] border-none",
                  artist.user
                    ? "bg-blue-500/10 text-blue-600"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {artist.user ? "Verified Account" : "Internal Profile"}
              </Badge>
            </div>
          </div>

          {/* Genres Tags - Gọn gàng hơn */}
          <div className="flex flex-wrap justify-center gap-1.5 min-h-6">
            {artist.genres?.length > 0 ? (
              artist.genres.slice(0, 2).map((g) => (
                <Badge
                  key={g._id}
                  variant="secondary"
                  className="text-[9px] px-2.5 h-5 font-bold uppercase tracking-tight bg-secondary/30 text-secondary-foreground/70 border-none group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500"
                >
                  {g.name}
                </Badge>
              ))
            ) : (
              <span className="text-[10px] text-muted-foreground/40 font-medium italic flex items-center gap-1">
                No genres assigned
              </span>
            )}
            {artist.genres?.length > 2 && (
              <Badge
                variant="ghost"
                className="h-5 text-[9px] font-bold text-muted-foreground/60 px-1"
              >
                +{artist.genres.length - 2}
              </Badge>
            )}
          </div>

          {/* --- 3. STATS FOOTER --- */}
          <div className="grid grid-cols-2 w-full mt-6 pt-5 border-t border-dashed border-border/80">
            <div className="flex flex-col items-center border-r border-dashed border-border/80">
              <div className="flex items-center gap-1.5 text-foreground">
                <Users className="size-3.5 text-primary/70" />
                <span className="text-sm font-black tracking-tighter">
                  {artist.totalFollowers?.toLocaleString() || 0}
                </span>
              </div>
              <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">
                Followers
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-foreground">
                <Mic2 className="size-3.5 text-primary/70" />
                <span className="text-sm font-black tracking-tighter">
                  {artist.totalTracks || 0}
                </span>
              </div>
              <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">
                Tracks
              </span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ArtistCard;
