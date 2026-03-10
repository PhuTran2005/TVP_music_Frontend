import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Play,
  MoreHorizontal,
  Heart,
  Loader2,
  PlusCircle,
  Share2,
  Disc3,
  ListMusic,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
import { ChartTrack } from "@/features/track/types";
import { formatDuration } from "@/utils/track-helper";
import { useAppDispatch } from "@/store/hooks";
import { setIsPlaying, setQueue } from "@/features/player";
import { handleError } from "@/utils/handleError";

// Redux (Giả định)
// import { useAppDispatch } from "@/store/hooks";
// import { setQueue, setIsPlaying } from "@/features/player/playerSlice";

interface ChartItemProps {
  track: ChartTrack;
  rank: number;
  prevRank: number;
  // 🔥 Thêm Prop truyền vào danh sách phát (context) nếu cần
  // contextTracks?: Track[];
}

export const ChartItem = memo(({ track, rank, prevRank }: ChartItemProps) => {
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const [isLoadingPlay, setIsLoadingPlay] = useState(false);
  const dispatch = useAppDispatch(); // Bật comment khi đã sẵn sàng nối vào Player

  const diff = prevRank - rank;
  console.log(track);
  // --- LOGIC PLAY NHẠC MỘT BÀI (Hoặc cả list nếu có contextTracks) ---
  const handlePlayTrack = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
    setIsLoadingPlay(true);
    try {
      // Logic Redux: Đưa 1 bài hát này vào hàng đợi và phát ngay
      dispatch(setQueue({ tracks: [track], startIndex: 0 }));
      dispatch(setIsPlaying(true));

      // Giả lập độ trễ mạng để UI kịp render vòng Loading
      await new Promise((resolve) => setTimeout(resolve, 400));
      toast.success(`Đang phát: ${track.title}`);
    } catch (err) {
      handleError(err, "Lỗi khi phát bài hát");
    } finally {
      setIsLoadingPlay(false);
    }
  };

  // Các sự kiện điều hướng độc lập
  const handleGoToArtist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (track.artist?.slug) navigate(`/artist/${track.artist.slug}`);
  };

  const handleGoToAlbum = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (track.album?.slug) navigate(`/albums/${track.album.slug}`);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
    toast.success(isLiked ? "Đã bỏ thích bài hát" : "Đã lưu vào Thư viện");
  };

  // --- RANK STYLING ---
  let rankStyle = "text-muted-foreground/40 font-black text-3xl opacity-70";
  if (rank === 1)
    rankStyle =
      "text-blue-500 font-black text-5xl drop-shadow-md scale-110 origin-bottom";
  else if (rank === 2)
    rankStyle = "text-emerald-500 font-black text-4xl drop-shadow-sm";
  else if (rank === 3)
    rankStyle = "text-rose-500 font-black text-4xl drop-shadow-sm";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      // Bấm vào thẻ cũng Play nhạc luôn cho sướng
      onClick={handlePlayTrack}
      className={cn(
        "group relative flex items-center p-2 pr-4 rounded-xl border border-transparent transition-all duration-300 cursor-pointer",
        rank === 1
          ? "bg-white/5 border-border/20 shadow-lg" // Highlight Top 1
          : "hover:border-border/50 hover:bg-muted/50 hover:shadow-md",
      )}
    >
      {/* 1. RANK COLUMN */}
      <div className="w-14 sm:w-16 flex flex-col items-center justify-center shrink-0 gap-1">
        <span
          className={cn(
            "leading-none tracking-tighter transition-all",
            rankStyle,
          )}
        >
          {rank}
        </span>
        <div className="h-5 flex items-center justify-center">
          {diff > 0 ? (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
              <TrendingUp size={10} strokeWidth={3} /> {diff}
            </span>
          ) : diff < 0 ? (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-full">
              <TrendingDown size={10} strokeWidth={3} /> {Math.abs(diff)}
            </span>
          ) : (
            <span className="flex items-center text-muted-foreground/50">
              <Minus size={14} strokeWidth={3} />
            </span>
          )}
        </div>
      </div>

      {/* 2. ARTWORK & PLAY OVERLAY */}
      <div className="relative size-12 sm:size-14 shrink-0 mr-4 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-sm">
        <ImageWithFallback
          src={track.coverImage}
          alt={track.title}
          className="size-full object-cover border border-white/5"
        />

        {/* Play Overlay (Sáng lên khi Hover hoặc đang Load) */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px] transition-opacity duration-300",
            isLoadingPlay ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          {isLoadingPlay ? (
            <Loader2 className="size-6 text-white animate-spin drop-shadow-md" />
          ) : (
            <Play className="size-6 text-white fill-white drop-shadow-md ml-0.5" />
          )}
        </div>
      </div>

      {/* 3. INFO (Title & Artist) */}
      <div className="flex-1 min-w-0 flex flex-col justify-center pr-4">
        <h3
          className={cn(
            "font-bold text-[15px] sm:text-base truncate leading-tight transition-colors",
            // Màu chữ nổi bật cho Top 3, các hạng còn lại màu thường
            rank <= 3
              ? "text-foreground"
              : "text-foreground/90 group-hover:text-primary",
          )}
        >
          {track.title}
        </h3>
        <p
          onClick={handleGoToArtist}
          className="text-[13px] text-muted-foreground truncate font-medium hover:underline hover:text-foreground cursor-pointer w-fit mt-0.5 transition-colors"
        >
          {track.artist?.name || "Unknown Artist"}
        </p>
      </div>

      {/* 4. ALBUM (Tablet+) */}
      <div
        onClick={handleGoToAlbum}
        className="hidden md:flex items-center w-[25%] px-4 text-[13px] text-muted-foreground font-medium truncate hover:text-foreground transition-colors cursor-pointer hover:underline"
      >
        <span className="truncate">
          {track.album?.title || `${track.title} (Single)`}
        </span>
      </div>

      {/* 5. METRICS / ACTIONS / DURATION */}
      <div className="flex items-center justify-end w-24 sm:w-32 gap-1 sm:gap-2 shrink-0">
        {/* Điểm (Biến mất khi Hover để nhường chỗ cho Nút) */}
        <div className="text-right group-hover:hidden w-full flex justify-end gap-3 items-center pr-2">
          {/* Fake Điểm cho vui mắt nếu không có */}
          <span className="hidden sm:block text-[11px] font-bold text-muted-foreground/60 uppercase tracking-wider">
            Lượt nghe
          </span>
          <span className="font-mono font-bold text-sm text-foreground/80">
            {new Intl.NumberFormat("vi-VN").format(track.playCount || 0)}
          </span>
        </div>

        {/* Cụm Nút Tương Tác (Chỉ hiện khi Hover) */}
        <div className="hidden group-hover:flex items-center animate-in fade-in slide-in-from-right-2 duration-200">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleToggleLike}
            className="size-9 rounded-full hover:bg-muted"
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                isLiked
                  ? "fill-rose-500 text-rose-500"
                  : "text-muted-foreground hover:text-foreground",
              )}
            />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                size="icon"
                variant="ghost"
                className="size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <MoreHorizontal className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl shadow-xl border-border/50"
            >
              <DropdownMenuItem
                onClick={handlePlayTrack}
                className="font-medium cursor-pointer py-2.5"
              >
                <Play className="mr-3 size-4 text-muted-foreground" /> Phát ngay
              </DropdownMenuItem>
              <DropdownMenuItem className="font-medium cursor-pointer py-2.5">
                <ListMusic className="mr-3 size-4 text-muted-foreground" /> Thêm
                vào danh sách chờ
              </DropdownMenuItem>
              <DropdownMenuItem className="font-medium cursor-pointer py-2.5">
                <PlusCircle className="mr-3 size-4 text-muted-foreground" />{" "}
                Thêm vào Playlist
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleGoToArtist}
                className="font-medium cursor-pointer py-2.5"
              >
                <Disc3 className="mr-3 size-4 text-muted-foreground" /> Xem nghệ
                sĩ
              </DropdownMenuItem>
              <DropdownMenuItem className="font-medium cursor-pointer py-2.5">
                <Share2 className="mr-3 size-4 text-muted-foreground" /> Chia sẻ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Thời lượng (Luôn hiện ở Desktop, bị ẩn khi Hover trên Mobile) */}
        <span className="text-[13px] font-mono font-medium text-muted-foreground/60 w-10 text-right hidden sm:block">
          {formatDuration(track.duration)}
        </span>
      </div>
    </motion.div>
  );
});

ChartItem.displayName = "ChartItem";
