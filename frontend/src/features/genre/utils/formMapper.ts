import { Genre } from "../types";
import { GenreFormValues } from "../schemas/genre.schema";

export const GENRE_DEFAULT_VALUES: GenreFormValues = {
  name: "",
  description: "",
  color: "#000000",
  gradient: "",
  parentId: null,
  priority: 0,
  isTrending: false,
  image: null,
};

export const mapEntityToForm = (genre?: Genre | null): GenreFormValues => {
  if (!genre) return GENRE_DEFAULT_VALUES;

  return {
    name: genre.name,
    description: genre.description || "",
    color: genre.color || "#000000",
    gradient: genre.gradient || "",
    // Xử lý parentId (nếu API trả về object populated -> lấy _id)
    parentId:
      typeof genre.parentId === "object"
        ? genre.parentId?._id
        : genre.parentId || null,
    priority: genre.priority || 0,
    isTrending: genre.isTrending || false,
    image: genre.image || null,
  };
};
