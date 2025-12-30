import React, { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  onItemsPerPageChange?: (value: number) => void;
  className?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  className,
}: PaginationProps) => {
  const [jumpValue, setJumpValue] = useState("");

  // Tự động cập nhật jumpValue khi đổi trang
  useEffect(() => {
    setJumpValue("");
  }, [currentPage]);

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(jumpValue);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setJumpValue(""); // Reset nếu nhập sai
    }
  };

  const { startItem, endItem } = useMemo(() => {
    if (totalItems === 0) return { startItem: 0, endItem: 0 };
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return { startItem: start, endItem: end };
  }, [currentPage, itemsPerPage, totalItems]);

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div
      className={cn(
        "flex flex-col gap-6 py-6 px-2 border-t border-border/50",
        className
      )}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* LEFT: Info & Items per Page */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground order-3 lg:order-1 w-full lg:w-auto justify-center">
          <span className="whitespace-nowrap">
            Showing{" "}
            <span className="font-semibold text-foreground">{startItem}</span> -{" "}
            <span className="font-semibold text-foreground">{endItem}</span> of{" "}
            <span className="font-semibold text-foreground">{totalItems}</span>
          </span>

          {onItemsPerPageChange && (
            <div className="flex items-center gap-2 border-l border-border/50 sm:pl-4">
              <span className="text-xs">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="bg-transparent font-medium text-foreground focus:outline-none cursor-pointer"
              >
                {[10, 20, 50, 100].map((val) => (
                  <option key={val} value={val} className="bg-background">
                    {val}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* MIDDLE: Main Navigation */}
        <div className="flex items-center gap-1.5 order-1 lg:order-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-border/60"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="hidden md:flex items-center gap-1.5">
            {pageNumbers.map((page, index) =>
              page === "..." ? (
                <div
                  key={index}
                  className="flex h-9 w-9 items-center justify-center text-muted-foreground/40"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              ) : (
                <Button
                  key={index}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    currentPage === page &&
                      "shadow-md shadow-primary/20 pointer-events-none"
                  )}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          {/* Mobile indicator */}
          <div className="md:hidden font-medium text-sm px-4">
            {currentPage} / {totalPages}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-border/60"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* RIGHT: Jump to Page */}
        <form
          onSubmit={handleJump}
          className="flex items-center gap-2 order-2 lg:order-3"
        >
          <div className="relative flex items-center">
            <Hash className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Go to..."
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              className="h-9 w-24 pl-8 pr-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            className="h-9 px-3 text-xs font-semibold"
          >
            Jump
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Pagination;
