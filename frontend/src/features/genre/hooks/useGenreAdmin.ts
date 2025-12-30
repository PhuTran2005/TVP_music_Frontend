import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import genreApi from "../api/genreApi";
import { toast } from "sonner";
import type { CreateGenreInput, UpdateGenreInput } from "../types";

export const useGenres = (params: {
  page: number;
  limit: number;
  keyword?: string;
  isTrending?: boolean;
  parentId?: string | "root";
  sort: "popular" | "priority" | "newest" | "oldest" | "name";
}) => {
  return useQuery({
    queryKey: ["genres", params],
    queryFn: () => genreApi.getAll(params),
    placeholderData: (prev) => prev,
  });
};

export const useCreateGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGenreInput) => genreApi.create(data),
    onSuccess: () => {
      toast.success("Tạo thể loại thành công!");
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi tạo"),
  });
};

export const useUpdateGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateGenreInput) => genreApi.update(data),
    onSuccess: () => {
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi cập nhật"),
  });
};

export const useToggleGenreStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => genreApi.toggleStatus(id),
    onSuccess: () => {
      toast.success("Đã thay đổi trạng thái");
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
    onError: () => toast.error("Lỗi thay đổi trạng thái"),
  });
};

export const useDeleteGenre = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => genreApi.delete(id),
    onSuccess: () => {
      toast.success("Đã xóa thể loại");
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi xóa"),
  });
};
