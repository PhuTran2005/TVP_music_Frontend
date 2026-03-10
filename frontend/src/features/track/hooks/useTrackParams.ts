import { useMemo, useCallback } from "react";
import { useQueryParams } from "@/hooks/useQueryParams";
import { TrackFilterParams } from "../types";

const DEFAULT_PARAMS: TrackFilterParams = {
  page: 1,
  limit: 10,
  keyword: "",
  sort: "newest",
  status: undefined,
  genreId: undefined,
  albumId: undefined,
  artistId: undefined,
  isPublic: undefined,
};

export const useTrackParams = (initialLimit = 10) => {
  const { params: rawParams, setParams } = useQueryParams({
    ...DEFAULT_PARAMS,
    limit: initialLimit,
  });

  const filterParams = useMemo((): TrackFilterParams => {
    return {
      ...rawParams,
      // Convert các params đặc biệt nếu cần (VD: boolean string -> boolean)
      // sort: validateSort(rawParams.sort),
    };
  }, [rawParams]);

  // --- Handlers ---
  const handlePageChange = useCallback(
    (page: number) => setParams({ page }),
    [setParams],
  );

  const handleSearch = useCallback(
    (keyword: string) => setParams({ keyword, page: 1 }),
    [setParams],
  );

  const handleFilterChange = useCallback(
    <K extends keyof TrackFilterParams>(
      key: K,
      value: TrackFilterParams[K],
    ) => {
      setParams({ [key]: value, page: 1 });
    },
    [setParams],
  );

  const clearFilters = useCallback(() => {
    setParams({ ...DEFAULT_PARAMS, limit: filterParams.limit });
  }, [setParams, filterParams.limit]);

  return {
    filterParams,
    handlePageChange,
    handleSearch,
    handleFilterChange,
    clearFilters,
  };
};
