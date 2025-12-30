import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreHorizontal,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "@/components/ui/button";

// 1. Giả lập dữ liệu ban đầu
const INITIAL_TRACKS = [
  {
    id: "1",
    title: "Chúng Ta Của Tương Lai",
    artist: "Sơn Tùng M-TP",
    cover: "https://images.unsplash.com/photo-1629735951612-65b0f1724031?w=200",
    views: 5000,
  },
  {
    id: "2",
    title: "Nâng Chén Tiêu Sầu",
    artist: "Bích Phương",
    cover: "https://images.unsplash.com/photo-1629923759854-156b88c433aa?w=200",
    views: 4800,
  },
  {
    id: "3",
    title: "Thiên Lý Ơi",
    artist: "Jack",
    cover: "https://images.unsplash.com/photo-1718217028088-a23cb3b277c4?w=200",
    views: 4600,
  },
  {
    id: "4",
    title: "Sau Lời Từ Khước",
    artist: "Phan Mạnh Quỳnh",
    cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=200",
    views: 4200,
  },
  {
    id: "5",
    title: "Từng Là",
    artist: "Vũ Cát Tường",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200",
    views: 4000,
  },
];

export function RealtimeChart() {
  const [tracks, setTracks] = useState(INITIAL_TRACKS);
  const [prevRanks, setPrevRanks] = useState<Record<string, number>>({});

  // 2. GIẢ LẬP SOCKET: Cứ 3 giây cập nhật số liệu ngẫu nhiên 1 lần
  useEffect(() => {
    // Lưu lại thứ hạng ban đầu
    const initialRankMap: Record<string, number> = {};
    tracks.forEach((t, i) => (initialRankMap[t.id] = i + 1));
    setPrevRanks(initialRankMap);

    const interval = setInterval(() => {
      setTracks((currentTracks) => {
        // A. Giả lập tăng view ngẫu nhiên cho từng bài
        const newTracks = currentTracks.map((t) => ({
          ...t,
          views: t.views + Math.floor(Math.random() * 500), // Tăng 0 - 500 view
        }));

        // B. Lưu thứ hạng CŨ trước khi sort
        const oldRankMap: Record<string, number> = {};
        // Lưu ý: Phải map theo thứ tự hiện tại (đã sort lần trước)
        currentTracks.forEach((t, index) => {
          oldRankMap[t.id] = index + 1;
        });
        setPrevRanks(oldRankMap);

        // C. Sắp xếp lại theo view cao nhất -> thấp nhất
        return newTracks.sort((a, b) => b.views - a.views);
      });
    }, 3000); // 3 giây nhảy 1 lần

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-slate-950 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          #ZingChart{" "}
          <span className="text-xs bg-red-600 px-2 py-0.5 rounded text-white animate-pulse">
            LIVE
          </span>
        </h2>
        <p className="text-slate-400 text-sm">Tự động cập nhật mỗi 3s</p>
      </div>

      <div className="flex flex-col gap-3 relative">
        {/* 🔥 KEY MAGIC: AnimatePresence + layout prop 
            AnimatePresence giúp xử lý animation khi phần tử bị xóa/thêm (nếu có)
        */}
        <AnimatePresence mode="popLayout">
          {tracks.map((track, index) => {
            const currentRank = index + 1;
            const oldRank = prevRanks[track.id] || currentRank;
            const change = oldRank - currentRank; // Dương là lên hạng, Âm là tụt hạng

            return (
              <motion.div
                // 🔑 QUAN TRỌNG: layout prop kích hoạt animation tráo vị trí
                layout
                key={track.id} // Key phải là ID duy nhất của bài hát, không dùng index!
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  duration: 0.5,
                }}
                className={`flex items-center p-3 rounded-xl gap-4 bg-slate-900/50 border border-transparent hover:bg-slate-800 transition-colors cursor-pointer group
                    ${index === 0 ? "border-yellow-500/30 bg-yellow-500/5" : ""}
                    ${index === 1 ? "border-gray-400/30 bg-gray-400/5" : ""}
                    ${index === 2 ? "border-orange-500/30 bg-orange-500/5" : ""}
                `}
              >
                {/* 1. Hạng & Trend */}
                <div className="flex flex-col items-center justify-center w-12 gap-1">
                  <span
                    className={`text-2xl font-black font-mono leading-none
                    ${index === 0 ? "text-yellow-400" : ""}
                    ${index === 1 ? "text-gray-300" : ""}
                    ${index === 2 ? "text-orange-400" : ""}
                    ${index > 2 ? "text-slate-500" : ""}
                  `}
                  >
                    {currentRank}
                  </span>

                  {/* Logic hiển thị mũi tên */}
                  <div className="text-[10px] font-bold flex flex-col items-center h-4">
                    {change > 0 && (
                      <span className="text-green-500 flex items-center animate-in slide-in-from-bottom-2 fade-in">
                        <TrendingUp size={12} className="mr-0.5" /> {change}
                      </span>
                    )}
                    {change < 0 && (
                      <span className="text-red-500 flex items-center animate-in slide-in-from-top-2 fade-in">
                        <TrendingDown size={12} className="mr-0.5" />{" "}
                        {Math.abs(change)}
                      </span>
                    )}
                    {change === 0 && (
                      <span className="text-slate-600">
                        <Minus size={12} />
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Ảnh bìa */}
                <div className="relative size-14 rounded-lg overflow-hidden flex-shrink-0 group">
                  <ImageWithFallback
                    src={track.cover}
                    alt={track.title}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="fill-white text-white size-6" />
                  </div>
                </div>

                {/* 3. Thông tin */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold truncate">
                    {track.title}
                  </h3>
                  <p className="text-slate-400 text-sm truncate">
                    {track.artist}
                  </p>
                </div>

                {/* 4. Lượt nghe (Số nhảy) */}
                <div className="text-right hidden sm:block">
                  <AnimatedNumber value={track.views} />
                  <p className="text-xs text-slate-500">lượt nghe</p>
                </div>

                {/* 5. Menu */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                >
                  <MoreHorizontal size={20} />
                </Button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper component để số nhảy nhảy (Counter animation)
function AnimatedNumber({ value }: { value: number }) {
  // Để đơn giản, hiển thị text tĩnh, nếu muốn số chạy vù vù thì dùng library `react-countup`
  return (
    <span className="text-white font-mono font-medium">
      {value.toLocaleString()}
    </span>
  );
}
