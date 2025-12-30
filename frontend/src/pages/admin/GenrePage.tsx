import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  PenSquare,
  Trash2,
  Music,
  Eye,
  EyeOff,
  CornerDownRight, // Icon for child genres
  TrendingUp, // Icon Trending
  ListMusic, // Icon Track Count
} from "lucide-react";

import { APP_CONFIG } from "@/config/constants";
import { cn } from "@/lib/utils";
import type { Genre, GenreFilterParams } from "@/features/genre/types";
import {
  useDeleteGenre,
  useGenres,
  useToggleGenreStatus,
} from "@/features/genre/hooks/useGenreAdmin";

// --- UI Components ---
import { Button } from "@/components/ui/button";
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
import GenreModal from "@/features/genre/components/GenreModal";
import TableSkeleton from "@/components/ui/TableSkeleton";
import GenreFilters from "@/features/genre/components/GenreFilters";

const GenresPage = () => {
  // --- 1. STATE MANAGEMENT WITH NEW INTERFACE ---
  const [params, setParams] = useState<GenreFilterParams>({
    page: 1,
    limit: APP_CONFIG.PAGINATION_LIMIT,
    sort: "priority", // Default sort by priority
    keyword: "",
    status: undefined,
    parentId: undefined,
    isTrending: undefined,
  });

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genreToEdit, setGenreToEdit] = useState<Genre | null>(null);
  const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null);

  // --- HOOKS ---
  // Pass the entire 'params' object to the hook
  const { data, isLoading, isError, isFetching } = useGenres(params);
  const deleteMutation = useDeleteGenre();
  const toggleStatusMutation = useToggleGenreStatus();

  const genreData = data?.data.data || [];
  const totalPages = data?.data.meta.totalPages || 0;
  const totalItems = data?.data.meta.totalItems || 0;

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setGenreToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (genre: Genre) => {
    setGenreToEdit(genre);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (genreToDelete)
      deleteMutation.mutate(genreToDelete._id, {
        onSuccess: () => setGenreToDelete(null),
      });
  };

  const handleToggle = (genre: Genre) => {
    toggleStatusMutation.mutate(genre._id);
  };

  // Helper to change page
  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  if (isError) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <MusicResult
          status="error"
          title="Failed to load genres"
          description="Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- HEADER --- */}
      <PageHeader
        title="Genres Management"
        subtitle={`Managing ${totalItems} genres in hierarchy structure.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-lg shadow-primary/20"
          >
            <Plus className="size-4 mr-2" /> Add Genre
          </Button>
        }
      />

      {/* --- 2. INTEGRATE NEW FILTER COMPONENT --- */}
      <GenreFilters params={params} setParams={setParams} />

      {/* --- TABLE --- */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="w-[280px]">Genre Info</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || (isFetching && params.page === 1) ? (
              <TableSkeleton rows={APP_CONFIG.PAGINATION_LIMIT} cols={7} />
            ) : genreData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-[300px]">
                  <MusicResult
                    status="empty"
                    title="No genres found"
                    description="Create a new genre to get started."
                  />
                </TableCell>
              </TableRow>
            ) : (
              genreData.map((genre: Genre, index: number) => {
                const parentName =
                  typeof genre.parentId === "object" && genre.parentId
                    ? (genre.parentId as any).name
                    : null;
                return (
                  <TableRow key={genre._id} className="group">
                    <TableCell className="font-mono text-muted-foreground text-xs">
                      {(params.page - 1) * APP_CONFIG.PAGINATION_LIMIT +
                        index +
                        1}
                    </TableCell>

                    {/* --- COL: INFO --- */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* Image */}
                        <div className="size-10 rounded-lg overflow-hidden border bg-muted flex items-center justify-center shrink-0 relative">
                          {genre.image ? (
                            <img
                              src={genre.image}
                              alt={genre.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Music className="size-5 text-muted-foreground" />
                          )}
                          {/* Color Dot Indicator */}
                          <div
                            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-card"
                            style={{ backgroundColor: genre.color || "#000" }}
                          />
                        </div>

                        {/* Name & Desc */}
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                            {genre.parentId && (
                              <CornerDownRight className="size-3 text-muted-foreground" />
                            )}
                            {genre.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {genre.description || "No description"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* --- COL: PARENT --- */}
                    <TableCell>
                      {parentName ? (
                        <Badge
                          variant="outline"
                          className="font-normal text-muted-foreground"
                        >
                          {parentName}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground/50 italic">
                          -- Root --
                        </span>
                      )}
                    </TableCell>

                    {/* --- COL: STATS --- */}
                    <TableCell>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1" title="Tracks">
                          <ListMusic className="size-3.5" />
                          <span className="font-medium text-foreground">
                            {genre.trackCount || 0}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* --- COL: PRIORITY & TRENDING --- */}
                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                          Pr: {genre.priority || 0}
                        </span>
                        {genre.isTrending && (
                          <Badge
                            variant="secondary"
                            className="bg-orange-500/10 text-orange-600 border-orange-200 text-[10px] px-1 py-0 h-5"
                          >
                            <TrendingUp className="size-3 mr-1" /> Hot
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* --- COL: STATUS --- */}
                    <TableCell>
                      <Badge
                        variant={genre.isActive ? "default" : "secondary"}
                        className={cn(
                          "rounded-full font-medium shadow-none cursor-pointer hover:opacity-80 transition-opacity px-2.5",
                          genre.isActive
                            ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        )}
                        onClick={() => handleToggle(genre)}
                      >
                        {genre.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </TableCell>

                    {/* --- COL: ACTIONS --- */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(genre)}
                          >
                            <PenSquare className="mr-2 size-4" /> Edit details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggle(genre)}>
                            {genre.isActive ? (
                              <>
                                <EyeOff className="mr-2 size-4" /> Hide genre
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 size-4" /> Show genre
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setGenreToDelete(genre)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 size-4" /> Delete genre
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- FOOTER --- */}
      {genreData.length > 0 && (
        <div className="pt-4">
          <Pagination
            currentPage={params.page}
            totalPages={totalPages || 1}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={APP_CONFIG.PAGINATION_LIMIT}
          />
        </div>
      )}

      {/* --- MODALS --- */}
      <GenreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        genreToEdit={genreToEdit}
      />

      <ConfirmationModal
        isOpen={!!genreToDelete}
        onCancel={() => setGenreToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Genre?"
        description={
          <span>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">{genreToDelete?.name}</strong>?
            <br />
            <span className="text-destructive text-sm mt-1 block">
              Warning: All child genres (if any) will become root genres.
            </span>
          </span>
        }
        confirmLabel="Delete"
        isDestructive
      />
    </div>
  );
};

export default GenresPage;
