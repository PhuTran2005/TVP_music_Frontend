import React from "react";
import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  count?: number;
  className?: string;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  count = 5,
  className,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          // 🔥 UX: Delay animation tăng dần để tạo hiệu ứng gợn sóng (wave)
          style={{ animationDelay: `${i * 100}ms` }}
          className={cn(
            "group bg-card rounded-xl border border-border/50 shadow-sm flex flex-col overflow-hidden animate-pulse",
            className,
          )}
        >
          {/* --- ARTWORK AREA --- */}
          <div className="relative aspect-square bg-muted/80 w-full overflow-hidden">
            {/* Giả lập các Badges trên ảnh */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between">
              <div className="h-5 w-14 bg-secondary/80 rounded-md" />
              <div className="h-5 w-16 bg-secondary/80 rounded-md" />
            </div>

            {/* Giả lập nút Play ở giữa */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-12 sm:size-14 bg-secondary/40 rounded-full" />
            </div>
          </div>

          {/* --- INFO AREA --- */}
          <div className="p-4 flex flex-col gap-3 flex-1">
            {/* Title & Subtitle */}
            <div className="space-y-2.5">
              <div className="h-4 w-[85%] bg-muted rounded-md" />
              <div className="h-3 w-[55%] bg-muted/70 rounded-md" />
            </div>

            {/* Giả lập Nút More Vertical */}
            <div className="absolute right-4 mt-1">
              <div className="size-6 bg-muted rounded-md" />
            </div>

            {/* Footer Metadata */}
            <div className="flex items-center gap-3 mt-auto pt-3 border-t border-border/40">
              <div className="flex items-center gap-1.5">
                <div className="size-3.5 bg-muted rounded-full" />
                <div className="h-2.5 w-8 bg-muted rounded-sm" />
              </div>
              <div className="size-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5">
                <div className="size-3.5 bg-muted rounded-full" />
                <div className="h-2.5 w-12 bg-muted rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CardSkeleton;
