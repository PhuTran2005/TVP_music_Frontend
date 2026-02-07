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
        "flex flex-col gap-6 py-6 px-4 border-t border-border ",
        className
      )}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* LEFT: Info & Items per Page */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-medium order-3 lg:order-1 w-full lg:w-auto justify-center">
          <span className="whitespace-nowrap text-muted-foreground">
            Showing{" "}
            <span className="font-bold text-foreground">{startItem}</span> -{" "}
            <span className="font-bold text-foreground">{endItem}</span> of{" "}
            <span className="font-bold text-foreground">{totalItems}</span>
          </span>

          {onItemsPerPageChange && (
            <div className="flex items-center gap-2 border-l border-border pl-4 h-5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Rows:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="bg-background border border-input rounded-md px-2 py-0.5 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm hover:border-primary/50 transition-colors"
              >
                {[10, 20, 50, 100].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* MIDDLE: Main Navigation */}
        <div className="flex items-center gap-2 order-1 lg:order-2">
          <Button
            variant="outline"
            size="icon"
            // Thay đổi: Viền rõ, shadow nhẹ, nền trắng
            className="h-10 w-10 border-input shadow-sm bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="hidden md:flex items-center gap-1.5">
            {pageNumbers.map((page, index) =>
              page === "..." ? (
                <div
                  key={index}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground font-bold select-none"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              ) : (
                <Button
                  key={index}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-10 w-10 text-sm font-bold transition-all",
                    currentPage === page
                      ? "shadow-md shadow-primary/25 pointer-events-none bg-primary text-primary-foreground border-primary"
                      : "border-input bg-background shadow-sm hover:border-primary/50 hover:text-primary"
                  )}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          {/* Mobile indicator - Rõ ràng hơn */}
          <div className="md:hidden font-bold text-sm px-4 py-2 bg-muted/30 rounded-lg border border-border">
            Page {currentPage} / {totalPages}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 border-input shadow-sm bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* RIGHT: Jump to Page */}
        <form
          onSubmit={handleJump}
          className="flex items-center gap-2 order-2 lg:order-3"
        >
          <div className="relative flex items-center group">
            <Hash className="absolute left-3 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Page..."
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
              // Thay đổi: Input nền sáng, viền rõ
              className="h-9 w-24 pl-9 pr-3 rounded-lg border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm placeholder:text-muted-foreground/70"
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            className="h-9 px-4 text-xs font-bold uppercase tracking-wide bg-secondary hover:bg-secondary/80 border border-border shadow-sm"
          >
            Go
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Pagination;
