import { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  PenSquare,
  Trash2,
  Music,
  Eye,
  EyeOff,
  CornerDownRight,
  TrendingUp,
  ListMusic,
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

const GenreManagementPage = () => {
  const [params, setParams] = useState<GenreFilterParams>({
    page: 1,
    limit: APP_CONFIG.PAGINATION_LIMIT,
    sort: "priority",
    keyword: "",
    status: undefined,
    parentId: undefined,
    isTrending: undefined,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genreToEdit, setGenreToEdit] = useState<Genre | null>(null);
  const [genreToDelete, setGenreToDelete] = useState<Genre | null>(null);

  const { data, isLoading, isError, isFetching } = useGenres(params);
  const deleteMutation = useDeleteGenre();
  const toggleStatusMutation = useToggleGenreStatus();

  const genreData = data?.data.data || [];
  const totalPages = data?.data.meta.totalPages || 0;
  const totalItems = data?.data.meta.totalItems || 0;

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
    <div className="space-y-8 pb-10">
      {/* --- HEADER --- */}
      <PageHeader
        title="Genres Management"
        subtitle={`Managing ${totalItems} genres in hierarchy structure.`}
        action={
          <Button
            onClick={handleOpenCreate}
            className="shadow-md bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6"
          >
            <Plus className="size-4 mr-2" /> Add Genre
          </Button>
        }
      />

      {/* --- FILTERS --- */}
      <GenreFilters params={params} setParams={setParams} />

      {/* --- TABLE --- */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="w-[60px] font-bold text-foreground/80">
                #
              </TableHead>
              <TableHead className="w-[300px] font-bold text-foreground/80">
                Genre Info
              </TableHead>
              <TableHead className="font-bold text-foreground/80">
                Parent Genre
              </TableHead>
              <TableHead className="font-bold text-foreground/80">
                Stats
              </TableHead>
              <TableHead className="font-bold text-foreground/80">
                Priority
              </TableHead>
              <TableHead className="font-bold text-foreground/80">
                Status
              </TableHead>
              <TableHead className="text-right font-bold text-foreground/80">
                Actions
              </TableHead>
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
                    ? (genre.parentId as Genre).name
                    : null;
                return (
                  <TableRow
                    key={genre._id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-mono text-muted-foreground text-xs font-medium">
                      {(params.page - 1) * APP_CONFIG.PAGINATION_LIMIT +
                        index +
                        1}
                    </TableCell>

                    {/* --- INFO --- */}
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="size-11 rounded-lg overflow-hidden border border-border bg-background flex items-center justify-center shrink-0 relative shadow-sm">
                          {genre.image ? (
                            <img
                              src={genre.image}
                              alt={genre.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Music className="size-5 text-muted-foreground/50" />
                          )}
                          {/* Color Dot */}
                          <div
                            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white shadow-sm"
                            style={{ backgroundColor: genre.color || "#000" }}
                          />
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-sm text-foreground flex items-center gap-2">
                            {genre.parentId && (
                              <CornerDownRight className="size-3 text-muted-foreground" />
                            )}
                            {genre.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {genre.description || "No description provided"}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* --- PARENT --- */}
                    <TableCell>
                      {parentName ? (
                        <Badge
                          variant="outline"
                          className="font-medium text-foreground/80 bg-background border-input"
                        >
                          {parentName}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground italic font-medium opacity-60">
                          Root Level
                        </span>
                      )}
                    </TableCell>

                    {/* --- STATS --- */}
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                        <ListMusic className="size-3.5 text-primary" />
                        <span>{genre.trackCount || 0} Tracks</span>
                      </div>
                    </TableCell>

                    {/* --- PRIORITY --- */}
                    <TableCell>
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className="font-mono text-xs bg-muted/50 px-2 py-0.5 rounded border border-border">
                          {genre.priority || 0}
                        </span>
                        {genre.isTrending && (
                          <Badge
                            variant="secondary"
                            className="bg-orange-500/10 text-orange-600 border-orange-200 text-[10px] px-1.5 py-0 h-5 font-bold"
                          >
                            <TrendingUp className="size-3 mr-1" /> Trending
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* --- STATUS --- */}
                    <TableCell>
                      <Badge
                        variant={genre.isActive ? "default" : "secondary"}
                        className={cn(
                          "rounded-full font-bold shadow-none cursor-pointer hover:opacity-90 transition-all px-3 py-0.5 border",
                          genre.isActive
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border hover:bg-muted/80",
                        )}
                        onClick={() => handleToggle(genre)}
                      >
                        {genre.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </TableCell>

                    {/* --- ACTIONS --- */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1">
                          <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(genre)}
                            className="font-medium cursor-pointer"
                          >
                            <PenSquare className="mr-2 size-4 text-primary" />{" "}
                            Edit details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggle(genre)}
                            className="font-medium cursor-pointer"
                          >
                            {genre.isActive ? (
                              <>
                                <EyeOff className="mr-2 size-4 text-muted-foreground" />{" "}
                                Hide genre
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 size-4 text-emerald-600" />{" "}
                                Show genre
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 bg-border/50" />
                          <DropdownMenuItem
                            onClick={() => setGenreToDelete(genre)}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10 font-medium cursor-pointer"
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
        <Pagination
          currentPage={params.page}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={APP_CONFIG.PAGINATION_LIMIT}
        />
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
            <span className="text-destructive font-bold text-sm mt-2 block bg-destructive/10 p-2 rounded border border-destructive/20">
              Warning: All child genres (if any) will become root genres.
            </span>
          </span>
        }
        confirmLabel="Yes, Delete"
        isDestructive
      />
    </div>
  );
};

export default GenreManagementPage;
