import { useState } from "react";
import {
  Plus,
  Search,
  Shield,
  ShieldAlert,
  Users as UsersIcon,
  MoreHorizontal,
  Lock,
  Unlock,
  PenSquare,
} from "lucide-react";
import {
  useAdminUsers,
  useBlockUser,
} from "@/features/user/hooks/useUserAdmin";
import { useDebounce } from "@/hooks/useDebounce";
import { APP_CONFIG } from "@/config/constants";
import { cn } from "@/lib/utils";
import type { User } from "@/features/user/types";
import { getInitialsTextAvartar } from "@/utils/genTextAvartar";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Pagination from "@/utils/pagination";
import MusicResult from "@/components/ui/Result";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import CreateUserModal from "@/features/user/components/create-user-modal";
import UpdateUserModal from "@/features/user/components/UpdateUserModal";
import TableSkeleton from "@/components/ui/TableSkeleton";

const roles = [
  { key: "All", value: "all" },
  { key: "Admin", value: "admin" },
  { key: "Artist", value: "artist" }, // Lưu ý: API có thể phân biệt hoa thường
  { key: "User", value: "user" },
];

const UsersPage = () => {
  // --- STATE ---
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);

  // --- MODAL STATE ---
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // --- HOOKS ---
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { data, isLoading, isError, isFetching } = useAdminUsers({
    page,
    limit: APP_CONFIG.PAGINATION_LIMIT,
    keyword: debouncedSearch,
    role: roleFilter,
  });
  const { mutate: blockUser } = useBlockUser();

  const userData = data?.data.data || [];
  const totalPages = data?.data.meta.totalPages || 0;
  const totalItems = data?.data.meta.totalItems || 0;

  // --- HANDLERS ---
  const handleConfirmBlock = () => {
    if (userToBlock) {
      blockUser(userToBlock._id, {
        onSuccess: () => setUserToBlock(null),
      });
    }
  };

  const renderRoleBadge = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower === "admin") {
      return (
        <Badge variant="destructive" className="gap-1">
          <ShieldAlert className="size-3" /> Admin
        </Badge>
      );
    }
    if (roleLower === "artist") {
      return (
        <Badge
          variant="secondary"
          className="bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 gap-1 hover:bg-amber-200"
        >
          <Shield className="size-3" /> Artist
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="gap-1 text-muted-foreground">
        <UsersIcon className="size-3" /> User
      </Badge>
    );
  };

  if (isError) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <MusicResult
          status="error"
          title="Failed to load users"
          description="Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- HEADER & ACTIONS --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Users Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your team members and their account permissions here.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="shadow-lg shadow-primary/20"
        >
          <Plus className="size-4 mr-2" /> Add User
        </Button>
      </div>

      {/* --- FILTERS --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-background/50"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {roles.map((role) => (
            <Button
              key={role.key}
              variant={
                (role.value === "all" && !roleFilter) ||
                role.value === roleFilter
                  ? "secondary"
                  : "ghost"
              }
              size="sm"
              onClick={() => {
                setRoleFilter(role.value === "all" ? undefined : role.value);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-4 text-xs font-medium h-8 border",
                (role.value === "all" && !roleFilter) ||
                  role.value === roleFilter
                  ? "border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
                  : "border-transparent text-muted-foreground"
              )}
            >
              {role.key}
            </Button>
          ))}
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[300px]">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || (isFetching && page === 1) ? (
              <TableSkeleton rows={APP_CONFIG.PAGINATION_LIMIT} cols={5} />
            ) : userData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-[400px]">
                  <MusicResult
                    status="empty"
                    title="No users found"
                    description="Try adjusting your search or filters to find what you're looking for."
                  />
                </TableCell>
              </TableRow>
            ) : (
              userData.map((user: User) => (
                <TableRow key={user._id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 border">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.username}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {getInitialsTextAvartar(user?.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-foreground truncate max-w-[150px]">
                          {user.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{renderRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.isActive ? "default" : "destructive"}
                      className={cn(
                        "rounded-full font-medium shadow-none",
                        user.isActive
                          ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20 dark:text-emerald-400"
                          : ""
                      )}
                    >
                      {user.isActive ? "Active" : "Blocked"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs font-mono">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground"
                        >
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setUserToEdit(user)}>
                          <PenSquare className="mr-2 size-4" /> Edit details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setUserToBlock(user)}
                          className={cn(
                            user.isActive
                              ? "text-destructive focus:text-destructive"
                              : "text-emerald-600 focus:text-emerald-600"
                          )}
                        >
                          {user.isActive ? (
                            <>
                              <Lock className="mr-2 size-4" /> Block user
                            </>
                          ) : (
                            <>
                              <Unlock className="mr-2 size-4" /> Unblock user
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- FOOTER PAGINATION --- */}
      {userData.length > 0 && (
        <div className="pt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages || 1}
            onPageChange={setPage}
            totalItems={totalItems}
            itemsPerPage={APP_CONFIG.PAGINATION_LIMIT}
          />
        </div>
      )}

      {/* --- MODALS --- */}
      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {userToEdit && (
        <UpdateUserModal
          isOpen={!!userToEdit}
          onClose={() => setUserToEdit(null)}
          userToEdit={userToEdit}
        />
      )}

      <ConfirmationModal
        isOpen={!!userToBlock}
        onCancel={() => setUserToBlock(null)}
        onConfirm={handleConfirmBlock}
        title={userToBlock?.isActive ? "Block Access" : "Restore Access"}
        description={
          userToBlock?.isActive
            ? "Are you sure you want to block this user? They will immediately lose access to the platform."
            : "Are you sure you want to unblock this user? They will regain access immediately."
        }
        confirmLabel={userToBlock?.isActive ? "Block User" : "Unblock User"}
        isDestructive={userToBlock?.isActive}
      />
    </div>
  );
};

export default UsersPage;
