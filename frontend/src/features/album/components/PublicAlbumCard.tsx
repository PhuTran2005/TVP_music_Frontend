import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Play,
  MoreVertical,
  Heart,
  Share2,
  PlusCircle,
  Disc3,
  Loader2, // 🔥 Thêm icon Loading
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Album } from "@/features/album/types";

/* -------------------------------------------------------------------------- */
/* TYPES                                    */
/* -------------------------------------------------------------------------- */

interface PublicAlbumCardProps {
  album: Album;
  className?: string;
  // 🔥 Cập nhật kiểu dữ liệu của onPlay thành một Promise
  onPlay?: () => Promise<void>;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                  */
/* -------------------------------------------------------------------------- */

const PublicAlbumCard: React.FC<PublicAlbumCardProps> = ({
  album,
  className,
  onPlay, // Khai báo prop
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  // 🔥 Thêm state để quản lý loading khi bấm play
  const [isLoadingPlay, setIsLoadingPlay] = useState(false);

  const handleNavigate = () => {
    navigate(`/albums/${album.slug || album._id}`);
  };

  // 🔥 LOGIC PLAY ĐƯỢC LÀM LẠI HOÀN TOÀN
  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onPlay) {
      setIsLoadingPlay(true);
      try {
        await onPlay(); // Chờ xử lý fetch data & đẩy vào Queue từ Cha
      } finally {
        setIsLoadingPlay(false); // Dừng hiệu ứng loading
      }
    } else {
      handleNavigate(); // Fallback nếu không truyền hàm onPlay
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked((p) => !p);
  };

  // Helper cho định dạng năm
  const releaseYear = album.releaseYear || new Date().getFullYear();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleNavigate}
      className={cn("group cursor-pointer flex flex-col gap-3.5", className)}
    >
      {/* ================= ARTWORK CONTAINER ================= */}
      <div className="relative aspect-square overflow-hidden rounded-[18px] bg-muted shadow-sm border border-border/5 group-hover:shadow-xl transition-all duration-500">
        {/* Artwork Image */}
        <ImageWithFallback
          src={album.coverImage}
          alt={album.title}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Dynamic Gradient Overlay: Mờ nhẹ mặc định, tối dần khi hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* --- Top Left: Album Type Badge --- */}
        {album.type && (
          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md border border-white/20 text-white font-bold text-[9px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full shadow-sm z-10">
            {album.type}
          </div>
        )}

        {/* --- Center: Play CTA --- */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <Button
            size="icon"
            onClick={handlePlay}
            disabled={isLoadingPlay} // 🔥 Khóa nút khi đang load
            className={cn(
              "size-14 sm:size-16 rounded-full bg-primary text-primary-foreground shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out",
              // Nếu đang tải -> hiện rõ luôn
              isLoadingPlay
                ? "opacity-100 scale-100 translate-y-0"
                : // Nếu chưa tải -> Ẩn mờ, chỉ hiện khi hover
                  "opacity-0 scale-75 translate-y-4 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 hover:bg-primary/90 hover:scale-110 active:scale-95",
            )}
          >
            {/* Đảo Icon Play / Loading */}
            {isLoadingPlay ? (
              <Loader2 className="size-6 sm:size-7 animate-spin" />
            ) : (
              <Play className="size-6 sm:size-7 ml-1 fill-current" />
            )}
          </Button>
        </div>

        {/* --- Top Right: Actions (Like & Menu) --- */}
        <div className="absolute top-3 right-3 hidden lg:flex flex-col gap-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-20">
          <Button
            size="icon"
            variant="secondary"
            onClick={handleLike}
            className={cn(
              "size-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-sm transition-colors",
              isLiked && "text-rose-500",
            )}
          >
            <Heart className={cn("size-4", isLiked && "fill-current")} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                size="icon"
                variant="secondary"
                className="size-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-sm transition-colors"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl shadow-xl border-border/50"
            >
              <DropdownMenuItem
                onClick={handlePlay}
                disabled={isLoadingPlay}
                className="font-medium cursor-pointer"
              >
                <Play className="mr-2 size-4" /> Phát ngay
              </DropdownMenuItem>
              <DropdownMenuItem className="font-medium cursor-pointer">
                <PlusCircle className="mr-2 size-4" /> Thêm vào thư viện
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="font-medium cursor-pointer">
                <Share2 className="mr-2 size-4" /> Chia sẻ
              </DropdownMenuItem>
              <DropdownMenuItem className="font-medium cursor-pointer">
                <Disc3 className="mr-2 size-4" /> Xem nghệ sĩ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ================= INFO SECTION ================= */}
      <div className="flex flex-col px-1">
        <h3
          className="font-bold text-[15px] sm:text-base leading-tight truncate text-foreground group-hover:text-primary transition-colors"
          title={album.title}
        >
          {album.title}
        </h3>

        <div className="flex items-center gap-1.5 mt-1 text-[13px] font-medium text-muted-foreground">
          {/* Artist Link */}
          <Link
            to={`/artist/${album.artist?.slug || album.artist?._id}`}
            onClick={(e) => e.stopPropagation()}
            className="truncate hover:text-foreground transition-colors hover:underline"
            title={album.artist?.name}
          >
            {album.artist?.name || "Unknown Artist"}
          </Link>

          {/* Separator Dot & Year */}
          <span className="size-1 rounded-full bg-muted-foreground/40 shrink-0" />
          <span className="shrink-0 tracking-wide">{releaseYear}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PublicAlbumCard;
