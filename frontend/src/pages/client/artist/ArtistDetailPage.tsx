import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  BadgeCheck,
  Edit,
  MoreHorizontal,
  Globe,
  Instagram,
  Youtube,
  Disc3,
  TrendingUp,
  MapPin,
  Share2,
  Heart,
  Music,
  ChevronRight,
  Info,
  AlertCircle,
  Facebook,
  Mic2,
  ListMusic,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/utils/track-helper";

// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import PublicAlbumCard from "@/features/album/components/PublicAlbumCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useArtistDetail } from "@/features/artist/hooks";

const ArtistDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);

  const { data: res, isLoading } = useArtistDetail(slug!);
  const artist = res?.data?.artist;
  const topTracks = res?.data?.topTracks || [];
  const albums = res?.data?.albums || [];

  const themeColor = useMemo(() => artist?.themeColor || "#7c3aed", [artist]);

  // Fluid Typography cho tên nghệ sĩ
  const titleClass = useMemo(() => {
    if (!artist?.name) return "";
    const len = artist.name.length;
    if (len > 25) return "text-3xl sm:text-5xl md:text-6xl lg:text-7xl";
    if (len > 15) return "text-4xl sm:text-6xl md:text-7xl lg:text-8xl";
    return "text-5xl sm:text-7xl md:text-8xl lg:text-9xl";
  }, [artist?.name]);

  if (isLoading) return <ArtistDetailSkeleton />;
  if (!artist) return <ArtistNotFound onBack={() => navigate("/artists")} />;

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 animate-in fade-in duration-700 overflow-x-hidden">
      {/* 1. HERO SECTION: Immersive & Sharp in any mode */}
      <section className="relative w-full min-h-[450px] sm:min-h-[500px] md:min-h-[600px] flex flex-col justify-end overflow-hidden shrink-0 group/hero shadow-inner">
        <div
          className="absolute inset-0 transition-all duration-1000 z-0 opacity-90 dark:opacity-100"
          style={{
            background: `linear-gradient(to bottom, ${themeColor}CC 0%, ${themeColor}30 70%, hsl(var(--background)) 100%)`,
          }}
        />

        {/* Cover Image logic with fallback visibility fix */}
        {artist.coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[3s] group-hover/hero:scale-110 pointer-events-none z-0 opacity-50 mix-blend-soft-light dark:mix-blend-overlay dark:opacity-30"
            style={{ backgroundImage: `url(${artist.coverImage})` }}
          />
        )}

        {/* Scrim Overlay for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/5 z-0 pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 sm:px-8 pb-8 sm:pb-16 mt-20">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 text-center md:text-left">
            <div className="relative shrink-0 group/avatar">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-125 animate-pulse" />
              <Avatar className="size-36 sm:size-48 md:size-64 rounded-full border-[6px] border-background shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] relative z-10 bg-card transition-transform duration-500 group-hover/avatar:scale-[1.03]">
                <AvatarImage src={artist.avatar} className="object-cover" />
                <AvatarFallback className="text-4xl font-black bg-muted">
                  {artist.name[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col items-center md:items-start gap-3 sm:gap-4 flex-1 min-w-0">
              {artist.isVerified && (
                <Badge className="bg-background/40 backdrop-blur-md text-foreground border-border/50 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] px-4 py-1 rounded-full flex gap-1.5 shadow-md">
                  <BadgeCheck className="size-3.5 sm:size-4 fill-primary text-background" />{" "}
                  Verified Artist
                </Badge>
              )}

              <h1
                className={cn(
                  "font-black tracking-tighter leading-[0.9] drop-shadow-2xl text-foreground",
                  titleClass
                )}
              >
                {artist.name}
              </h1>

              <div className="flex items-center flex-wrap justify-center md:justify-start gap-4 sm:gap-6 mt-2 text-[12px] sm:text-[13px] font-black uppercase tracking-widest text-foreground/80">
                <div className="flex items-center gap-2 bg-background/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                  <TrendingUp className="size-4 text-primary" />
                  <span>
                    {new Intl.NumberFormat().format(
                      artist.monthlyListeners || 0
                    )}{" "}
                    <span className="opacity-60 font-bold">
                      Monthly Listeners
                    </span>
                  </span>
                </div>
                {artist.nationality && (
                  <div className="flex items-center gap-2 border-l border-border pl-4 sm:pl-6">
                    <MapPin className="size-4 text-primary" />{" "}
                    <span>{artist.nationality}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STICKY ACTIONS BAR */}
      <div className="sticky top-0 z-40 backdrop-blur-2xl bg-background/80 border-b border-border/40 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-8 py-3 sm:py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <Button
              size="icon"
              className="size-12 sm:size-16 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 active:scale-90 transition-all hover:scale-105 group"
            >
              <Play className="size-6 sm:size-8 fill-current ml-1 group-hover:scale-110" />
            </Button>
            <Button
              variant={isFollowing ? "outline" : "default"}
              onClick={() => setIsFollowing(!isFollowing)}
              className={cn(
                "rounded-full px-5 sm:px-10 font-black uppercase text-[10px] sm:text-xs tracking-widest h-10 sm:h-12 transition-all active:scale-95 shadow-md",
                isFollowing
                  ? "border-primary text-primary bg-primary/5"
                  : "bg-foreground text-background"
              )}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-red-500 rounded-full h-10 w-10 sm:h-12 sm:w-12 active:scale-90"
            >
              <Heart className="size-6 sm:size-7" />
            </Button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 sm:h-11 sm:w-11 transition-colors hover:bg-muted"
            >
              <Share2 className="size-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 sm:h-11 sm:w-11 transition-colors hover:bg-muted"
                >
                  <MoreHorizontal className="size-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-2xl border-border/40 p-2 shadow-2xl backdrop-blur-xl"
              >
                <DropdownMenuItem className="gap-3 py-3 font-semibold rounded-xl cursor-pointer font-bold uppercase text-[10px] tracking-widest">
                  <Music className="size-4 text-primary" /> Artist Radio
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3 py-3 font-semibold rounded-xl cursor-pointer font-bold uppercase text-[10px] tracking-widest text-destructive focus:text-destructive">
                  <Edit className="size-4" /> Report Artist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <main className="container mx-auto px-4 sm:px-8 mt-10 md:mt-16 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 xl:gap-24">
          {/* LEFT COLUMN: Tracklist & Albums */}
          <div className="lg:col-span-8 space-y-16">
            {/* POPULAR TRACKS WITH EMPTY STATE */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-3">
                  Popular <TrendingUp className="size-6 text-primary" />
                </h2>
                {topTracks.length > 0 && (
                  <Badge
                    variant="outline"
                    className="font-mono opacity-50 border-border text-[10px]"
                  >
                    Top 5
                  </Badge>
                )}
              </div>

              {topTracks.length > 0 ? (
                <div className="space-y-1">
                  {topTracks.slice(0, 5).map((track: any, idx: number) => (
                    <div
                      key={track._id}
                      className="flex items-center gap-3 sm:gap-6 p-2 sm:p-3 rounded-2xl active:bg-muted/80 sm:hover:bg-muted transition-all group cursor-pointer border border-transparent hover:border-border/40"
                    >
                      <span className="w-6 text-center text-muted-foreground font-mono text-sm group-hover:text-primary font-bold">
                        {idx + 1}
                      </span>
                      <div className="size-11 sm:size-12 rounded-xl overflow-hidden shadow-md shrink-0 border border-border/10">
                        <img
                          src={track.coverImage}
                          className="size-full object-cover"
                          alt=""
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold truncate text-[15px] sm:text-[17px] group-hover:text-primary transition-colors leading-tight tracking-tight">
                          {track.title}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 font-bold opacity-60">
                          {new Intl.NumberFormat().format(track.playCount)}{" "}
                          streams
                        </p>
                      </div>
                      <span className="hidden sm:block text-[12px] font-mono text-muted-foreground opacity-60 mr-4 font-bold">
                        {formatDuration(track.duration)}
                      </span>
                      <button className="sm:opacity-0 group-hover:opacity-100 p-2 hover:bg-muted rounded-full transition-all text-muted-foreground">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptySection
                  icon={<ListMusic />}
                  title="No popular hits yet"
                  message="Nghệ sĩ này chưa có bài hát nổi bật nào."
                />
              )}
            </section>

            {/* ARTIST GALLERY: Hidden if empty */}
            {artist.images?.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-black text-[11px] uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-3 px-1">
                  <Camera className="size-4 text-primary" /> Visual Gallery
                </h3>
                <div className="flex gap-4 sm:gap-6 overflow-x-auto custom-scrollbar snap-x snap-mandatory pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
                  {artist.images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className="shrink-0 w-[85%] sm:w-[400px] aspect-[16/10] rounded-[2rem] overflow-hidden snap-center shadow-2xl border border-border/40 group relative bg-muted hover:border-primary/40 transition-all"
                    >
                      <img
                        src={img}
                        className="size-full object-cover transition-all duration-1000 group-hover:scale-110"
                        alt=""
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <span className="text-white font-bold text-xs tracking-widest uppercase opacity-80">
                          Artist Photo {idx + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DISCOGRAPHY GRID WITH EMPTY STATE */}
            <section>
              <div className="flex items-center justify-between mb-8 sm:mb-10 px-1">
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
                  Discography <Disc3 className="size-6 text-primary" />
                </h2>
                {albums.length > 0 && (
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-primary font-black text-[10px] sm:text-[11px] uppercase tracking-widest gap-2"
                  >
                    Show all <ChevronRight className="size-4" />
                  </Button>
                )}
              </div>

              {albums.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
                  {albums.map((album: any) => (
                    <PublicAlbumCard key={album._id} album={album} />
                  ))}
                </div>
              ) : (
                <EmptySection
                  icon={<Disc3 />}
                  title="No discography"
                  message="Danh sách album của nghệ sĩ này hiện đang để trống."
                />
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: Sidebar (Bio & Socials) */}
          <aside className="lg:col-span-4 space-y-12">
            <section className="bg-card/40 rounded-[2.5rem] p-8 sm:p-10 border border-border shadow-md relative overflow-hidden group hover:shadow-xl transition-all">
              <div
                className="absolute -top-20 -right-20 size-64 blur-[100px] rounded-full opacity-20 pointer-events-none"
                style={{ backgroundColor: themeColor }}
              />
              <h3 className="font-black text-lg sm:text-xl mb-8 sm:mb-10 flex items-center gap-3 uppercase tracking-tighter text-foreground">
                Biography <Info className="size-5 text-primary" />
              </h3>

              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-5">
                  <Avatar className="size-16 sm:size-20 rounded-2xl sm:rounded-3xl border-2 border-border shadow-xl ring-4 ring-primary/5 transition-all group-hover:rotate-2">
                    <AvatarImage src={artist.avatar} />
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-base sm:text-lg font-black text-foreground truncate tracking-tight uppercase leading-none">
                      {artist.name}
                    </p>
                    <Badge className="mt-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border-none">
                      Official Profile
                    </Badge>
                  </div>
                </div>

                {artist.bio ? (
                  <p className="text-[13px] sm:text-[15px] text-muted-foreground leading-relaxed font-medium line-clamp-[12] italic pl-4 border-l-2 border-primary/30">
                    {artist.bio}
                  </p>
                ) : (
                  <div className="py-10 text-center bg-muted/20 rounded-2xl border border-dashed border-border/60">
                    <Mic2 className="size-8 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-xs font-bold text-muted-foreground italic uppercase tracking-widest">
                      Tiểu sử nghệ sĩ sắp ra mắt
                    </p>
                  </div>
                )}

                {artist.genres?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {artist.genres.map((g: any) => (
                      <Badge
                        key={g._id}
                        variant="secondary"
                        className="bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest px-3 py-1 border border-border/40 hover:border-primary/40 transition-all cursor-default"
                      >
                        {g.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* SOCIAL CONNECTIONS */}
            <section className="space-y-5 px-1 sm:px-2">
              <h3 className="font-black text-[11px] uppercase tracking-[0.3em] text-muted-foreground pl-2 border-l-4 border-primary">
                Connection
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
                <SocialLink
                  icon={<Instagram />}
                  label="Instagram"
                  href={artist.socialLinks?.instagram}
                  color="#E4405F"
                />
                <SocialLink
                  icon={<Facebook />}
                  label="Facebook"
                  href={artist.socialLinks?.facebook}
                  color="#1877F2"
                />
                <SocialLink
                  icon={<Youtube />}
                  label="YouTube"
                  href={artist.socialLinks?.youtube}
                  color="#FF0000"
                />
                <SocialLink
                  icon={<Globe />}
                  label="Official Site"
                  href={artist.socialLinks?.website}
                  color={themeColor}
                />
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const SocialLink = ({
  icon,
  label,
  href,
  color,
}: {
  icon: any;
  label: string;
  href?: string;
  color: string;
}) => {
  if (!href || !href.trim()) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-center lg:justify-start gap-3 sm:gap-4 h-11 sm:h-14 w-full rounded-xl sm:rounded-2xl border border-border/40 bg-card/40 active:scale-[0.98] transition-all overflow-hidden shadow-sm hover:shadow-md hover:bg-card"
    >
      <span
        className="shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-6"
        style={{ color }}
      >
        {React.cloneElement(icon, { size: 18 })}
      </span>
      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-foreground/70 group-hover:text-foreground">
        {label}
      </span>
    </a>
  );
};

const EmptySection = ({
  icon,
  title,
  message,
}: {
  icon: any;
  title: string;
  message: string;
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 bg-muted/10 rounded-[2.5rem] border-2 border-dashed border-border/60 text-center gap-4">
    <div className="size-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground/30 animate-pulse">
      {React.cloneElement(icon, { size: 32, strokeWidth: 1.5 })}
    </div>
    <div className="space-y-1">
      <p className="font-black text-foreground uppercase text-xs tracking-widest leading-none">
        {title}
      </p>
      <p className="text-sm text-muted-foreground italic font-medium mt-2">
        {message}
      </p>
    </div>
  </div>
);

const ArtistDetailSkeleton = () => (
  <div className="w-full min-h-screen space-y-12 pb-20 bg-background">
    <div className="h-[450px] sm:h-[550px] w-full bg-muted/40 animate-pulse" />
    <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-12 -mt-20 relative z-10">
      <div className="lg:col-span-8 space-y-10">
        <div className="h-10 bg-muted/60 rounded-xl w-64 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-20 bg-muted/30 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
      <div className="lg:col-span-4 h-[600px] bg-muted/20 rounded-[3rem] animate-pulse" />
    </div>
  </div>
);

const ArtistNotFound = ({ onBack }: { onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[85vh] gap-10 text-center px-6 bg-background animate-in zoom-in-95">
    <AlertCircle className="size-24 text-destructive opacity-30 shadow-sm" />
    <div className="space-y-4">
      <h2 className="text-5xl font-black tracking-tighter uppercase text-foreground leading-none">
        Record Missing
      </h2>
      <p className="text-muted-foreground text-lg max-w-md mx-auto font-medium italic">
        Chúng tôi không thể tìm thấy hồ sơ nghệ sĩ này tại Studio của chúng tôi.
      </p>
    </div>
    <Button
      onClick={onBack}
      variant="secondary"
      className="rounded-full px-12 font-black uppercase text-xs tracking-[0.3em] h-14 shadow-2xl transition-all hover:bg-foreground hover:text-background active:scale-95"
    >
      Back to Artists
    </Button>
  </div>
);

export default ArtistDetailPage;
