import React from "react";
import { cn } from "@/lib/utils";
import { TableRow, TableCell } from "@/components/ui/table";

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  hasAvatar?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 10,
  cols = 5,
  hasAvatar = true, // Bật lên nếu bảng là User/Artist (có hình đại diện)
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow
          key={rowIndex}
          // Hiệu ứng gợn sóng chạy từ trên xuống dưới theo từng dòng
          style={{ animationDelay: `${rowIndex * 80}ms` }}
          className="animate-pulse hover:bg-transparent border-b border-border/50"
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <TableCell key={colIndex} className="py-4">
              {/* CỘT 1: Thường là Thông tin chính (Có hình ảnh, Tên, Subtext) */}
              {colIndex === 0 ? (
                <div className="flex items-center gap-3">
                  {hasAvatar && (
                    <div className="size-9 rounded-full bg-muted shrink-0" />
                  )}
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-3.5 w-32 sm:w-48 bg-muted rounded-md" />
                    <div className="h-2.5 w-24 sm:w-32 bg-muted/60 rounded-md" />
                  </div>
                </div>
              ) : /* CỘT CUỐI: Thường là Action Buttons (Dropdown Menu) */
              colIndex === cols - 1 ? (
                <div className="flex justify-end">
                  <div className="size-8 rounded-md bg-muted/80" />
                </div>
              ) : (
                /* CÁC CỘT GIỮA: Badge, Trạng thái, Ngày tháng */
                <div className="flex flex-col gap-1">
                  {/* Random chiều rộng để nhìn tự nhiên hơn, không bị đều tăm tắp */}
                  <div
                    className={cn(
                      "h-5 bg-muted rounded-full",
                      colIndex % 2 === 0 ? "w-20" : "w-16",
                    )}
                  />
                </div>
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
