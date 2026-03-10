import { useState } from "react";
import {
  Plus,
  Shield,
  ShieldAlert,
  Users as UsersIcon,
  MoreHorizontal,
  Lock,
  Unlock,
  PenSquare,
  Trash2,
} from "lucide-react";
import { APP_CONFIG } from "@/config/constants";
import { cn } from "@/lib/utils";
import { getInitialsTextAvartar } from "@/utils/genTextAvartar";
import type { User } from "@/features/user/types";

// --- UI Components ---
import { Button } from "@/components/ui/button";
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
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/utils/pagination";
import MusicResult from "@/components/ui/Result";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import TableSkeleton from "@/components/ui/TableSkeleton";

// --- Feature Components ---
import { UserFilters } from "@/features/user/components/UserFilters";
import UserModal from "@/features/user/components/UserModal";

// --- Hooks Mới ---
import { useUserParams } from "@/features/user/hooks/useUserParams";
import { useUsersQuery } from "@/features/user/hooks/useUsersQuery";
import { useUserMutations } from "@/features/user/hooks/useUserMutations";

const UsersManagementPage = () => {
  // --- 1. STATE MANAGEMENT (URL) ---
  const {
    filterParams,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    clearFilters,
  } = useUserParams(APP_CONFIG.PAGINATION_LIMIT);

  // --- 2. DATA FETCHING ---
  const { data, isLoading, isError } = useUsersQuery(filterParams);
  console.log("Fetched users data:", data);
  // --- 3. MUTATIONS ---
  const {
    createUserAsync,
    updateUserAsync,
    toggleBlockUser,
    deleteUser,
    isMutating,
  } = useUserMutations();

  // --- 4. LOCAL UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToBlock, setUserToBlock] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Bóc tách data an toàn
  const userData = data?.users || [];
  const meta = data?.meta || {
    totalPages: 1,
    totalItems: 0,
    page: 1,
    pageSize: APP_CONFIG.PAGINATION_LIMIT,
  };

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  // 🔥 Xử lý Form Submit (Nhận FormData từ UserModal)
  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (userToEdit) {
        await updateUserAsync({ id: userToEdit._id, data: formData });
      } else {
        await createUserAsync(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save user", error);
      // Giữ modal mở nếu lỗi để user sửa
    }
  };

  const handleConfirmBlock = () => {
    if (userToBlock) {
      toggleBlockUser(userToBlock._id, {
        onSuccess: () => setUserToBlock(null),
      });
    }
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete._id, {
        onSuccess: () => setUserToDelete(null),
      });
    }
  };

  // --- RENDER HELPERS ---
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

  // Nếu API lỗi nặng
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
    <div className="space-y-8 pb-12">
      {/* --- HEADER --- */}
      <PageHeader
        title="Users Management"
        subtitle={`Managing ${meta.totalItems} members and their permissions.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-md bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6"
          >
            <Plus className="size-4 mr-2" /> Add User
          </Button>
        }
      />
      <div className="bg-card rounded-2xl shadow-sm">
        {/* --- FILTERS --- */}
        <UserFilters
          params={filterParams}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onReset={clearFilters}
        />
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[300px]">User Info</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">
                Joined Date
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton
                rows={meta.pageSize || APP_CONFIG.PAGINATION_LIMIT}
                cols={5}
                hasAvatar={true}
              />
            ) : userData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-[400px]">
                  <MusicResult
                    status="empty"
                    title="No users found"
                    description="Try adjusting your search or filters to find what you're looking for."
                    secondaryAction={{
                      label: "Clear Filters",
                      onClick: clearFilters,
                    }}
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
                          : "",
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

                        <DropdownMenuItem onClick={() => handleOpenEdit(user)}>
                          <PenSquare className="mr-2 size-4" /> Edit Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => setUserToBlock(user)}
                          className={cn(
                            user.isActive
                              ? "text-destructive focus:text-destructive focus:bg-destructive/10"
                              : "text-emerald-600 focus:text-emerald-600 focus:bg-emerald-500/10",
                          )}
                        >
                          {user.isActive ? (
                            <>
                              <Lock className="mr-2 size-4" /> Block User
                            </>
                          ) : (
                            <>
                              <Unlock className="mr-2 size-4" /> Unblock User
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => setUserToDelete(user)}
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 className="mr-2 size-4" /> Delete Account
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

      {/* --- PAGINATION --- */}

      {!isLoading && userData.length > 0 && (
        <div className="bg-card border rounded-2xl p-4 shadow-sm">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
            totalItems={meta.totalItems}
            itemsPerPage={meta.pageSize || APP_CONFIG.PAGINATION_LIMIT}
          />
        </div>
      )}
      {/* ================= MODALS ================= */}

      {/* 1. Create/Edit User Modal */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userToEdit={userToEdit}
          onSubmit={handleFormSubmit}
          isPending={isMutating}
        />
      )}

      {/* 2. Block/Unblock Confirmation */}
      <ConfirmationModal
        isOpen={!!userToBlock}
        onCancel={() => setUserToBlock(null)}
        onConfirm={handleConfirmBlock}
        isLoading={isMutating}
        title={
          userToBlock?.isActive ? "Block User Account" : "Restore User Access"
        }
        description={
          userToBlock?.isActive
            ? `Are you sure you want to block ${userToBlock.fullName}? They will immediately be logged out and lose access to the platform.`
            : `Are you sure you want to unblock ${userToBlock?.fullName}? They will regain full access immediately.`
        }
        confirmLabel={userToBlock?.isActive ? "Yes, Block" : "Yes, Unblock"}
        isDestructive={userToBlock?.isActive}
      />

      {/* 3. Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!userToDelete}
        onCancel={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isMutating}
        title="Permanently Delete User?"
        description={
          <span>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">
              {userToDelete?.fullName}
            </strong>
            ?
            <br />
            <span className="text-destructive font-bold text-sm mt-2 block bg-destructive/10 p-2 rounded border border-destructive/20">
              This action cannot be undone. All data associated with this user
              will be permanently removed.
            </span>
          </span>
        }
        confirmLabel="Yes, Delete Permanently"
        isDestructive
      />
    </div>
  );
};

export default UsersManagementPage;
