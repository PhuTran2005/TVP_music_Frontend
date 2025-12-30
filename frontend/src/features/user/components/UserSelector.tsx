import React, { useState, useMemo, useCallback } from "react";
import {
  Check,
  ChevronDown,
  Loader2,
  Search,
  User as UserIcon,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAdminUsers, type User } from "@/features/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialsTextAvartar } from "@/utils/genTextAvartar";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Badge } from "@/components/ui/badge";

interface UserSelectorProps {
  value: string | string[] | null | undefined; // 🔥 Hỗ trợ cả string[] cho multi-select
  onChange: (value: any) => void;
  multi?: boolean; // 🔥 Bật chế độ chọn nhiều
  placeholder?: string;
  error?: string;
  initialUsers?: User[] | User | null; // 🔥 Nhận mảng user ban đầu
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  value,
  onChange,
  multi = false,
  placeholder = "Tìm kiếm người dùng...",
  error,
  initialUsers,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: userRes, isLoading } = useAdminUsers({
    page: 1,
    limit: 15,
    keyword: debouncedSearch,
  });

  const fetchedUsers = useMemo(() => userRes?.data?.data || [], [userRes]);

  // 🔥 Logic xác định những User đang được chọn
  const selectedUsers = useMemo(() => {
    const selectedIds = Array.isArray(value) ? value : value ? [value] : [];

    // Tổng hợp từ fetched và initial để lấy đầy đủ object profile
    const initialArr = Array.isArray(initialUsers)
      ? initialUsers
      : initialUsers
      ? [initialUsers]
      : [];
    const pool = [...fetchedUsers, ...initialArr];

    return selectedIds
      .map((id) => pool.find((u) => u._id === id))
      .filter(Boolean) as User[];
  }, [fetchedUsers, value, initialUsers]);

  const handleSelect = useCallback(
    (userId: string) => {
      if (multi) {
        const currentIds = Array.isArray(value) ? value : [];
        if (currentIds.includes(userId)) {
          onChange(currentIds.filter((id) => id !== userId));
        } else {
          onChange([...currentIds, userId]);
        }
      } else {
        onChange(userId);
        setIsOpen(false);
      }
    },
    [multi, value, onChange]
  );

  const isSelected = (userId: string) => {
    return Array.isArray(value) ? value.includes(userId) : value === userId;
  };

  return (
    <div className="relative w-full">
      {/* Trigger Area */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full min-h-10 px-3 py-1.5 rounded-xl border bg-background text-sm transition-all cursor-pointer select-none",
          isOpen
            ? "ring-2 ring-primary/20 border-primary"
            : "hover:border-primary/50",
          error && "border-destructive"
        )}
      >
        <div className="flex flex-wrap gap-1.5 overflow-hidden">
          {selectedUsers.length > 0 ? (
            selectedUsers.map((user) => (
              <Badge
                key={user._id}
                variant="secondary"
                className="gap-1 pl-1 pr-1.5 h-6 animate-in zoom-in-95"
                onClick={(e) => {
                  if (multi) {
                    e.stopPropagation();
                    handleSelect(user._id);
                  }
                }}
              >
                <Avatar className="size-4">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-[6px]">
                    {getInitialsTextAvartar(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[100px] truncate">{user.fullName}</span>
                {multi && <X className="size-3 opacity-50 hover:opacity-100" />}
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {selectedUsers.length > 0 && (
            <X
              className="size-3.5 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onChange(multi ? [] : null);
              }}
            />
          )}
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Dropdown Section */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-[100]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 8 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute left-0 right-0 z-[101] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-2 origin-top"
            >
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Tìm theo tên hoặc email..."
                  className="pl-9 h-9 bg-muted/30 border-none rounded-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="max-h-[250px] overflow-y-auto custom-scrollbar space-y-1">
                {isLoading ? (
                  <div className="py-10 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="size-5 animate-spin text-primary" />
                    <span className="text-xs uppercase font-bold tracking-tighter">
                      Đang tải người dùng...
                    </span>
                  </div>
                ) : fetchedUsers.length > 0 ? (
                  fetchedUsers.map((u) => (
                    <div
                      key={u._id}
                      onClick={() => handleSelect(u._id)}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all",
                        isSelected(u._id) ? "bg-primary/10" : "hover:bg-accent"
                      )}
                    >
                      <div className="relative">
                        <Avatar className="size-9 border">
                          <AvatarImage src={u.avatar} />
                          <AvatarFallback>
                            {getInitialsTextAvartar(u.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        {isSelected(u._id) && (
                          <div className="absolute -right-1 -bottom-1 bg-primary text-primary-foreground rounded-full p-0.5 border-2 border-card">
                            <Check className="size-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm truncate",
                            isSelected(u._id)
                              ? "font-bold text-primary"
                              : "font-medium"
                          )}
                        >
                          {u.fullName}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {u.email}
                        </p>
                      </div>

                      {multi && (
                        <div
                          className={cn(
                            "size-5 rounded-md border-2 transition-all flex items-center justify-center",
                            isSelected(u._id)
                              ? "bg-primary border-primary"
                              : "border-muted-foreground/30"
                          )}
                        >
                          {isSelected(u._id) && (
                            <Check className="size-3 text-white stroke-[4]" />
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-10 text-center text-muted-foreground">
                    <UserIcon className="size-8 mx-auto mb-2 opacity-20" />
                    <p className="text-xs">Không tìm thấy ai phù hợp</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
