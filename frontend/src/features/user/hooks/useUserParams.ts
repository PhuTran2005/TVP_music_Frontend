import { useMemo, useCallback } from "react";
import { useQueryParams } from "@/hooks/useQueryParams";
import { UserFilterParams } from "../types";

const DEFAULT_PARAMS: UserFilterParams = {
  page: 1,
  limit: 10,
  keyword: "",
  role: undefined,
  sort: "newest",
  isVerified: undefined,
  isActive: undefined,
};

export const useUserParams = (initialLimit = 10) => {
  const { params: rawParams, setParams } = useQueryParams({
    ...DEFAULT_PARAMS,
    limit: initialLimit,
  });

  const filterParams = useMemo(
    (): UserFilterParams => ({ ...rawParams }),
    [rawParams],
  );

  const handleSearch = useCallback(
    (keyword: string) => setParams({ keyword, page: 1 }),
    [setParams],
  );
  const handlePageChange = useCallback(
    (page: number) => setParams({ page }),
    [setParams],
  );
  const handleFilterChange = useCallback(
    (key: keyof UserFilterParams, value: any) => {
      setParams({ [key]: value, page: 1 });
    },
    [setParams],
  );
  const clearFilters = useCallback(() => {
    // Reset về default nhưng giữ limit
    setParams({
      ...DEFAULT_PARAMS,
      limit: filterParams.limit,
    });
  }, [setParams, filterParams.limit]);

  return {
    filterParams,
    handleSearch,
    handlePageChange,
    handleFilterChange,
    clearFilters,
  };
};
