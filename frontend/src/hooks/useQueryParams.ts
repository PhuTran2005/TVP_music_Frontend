import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

/**
 * Hook Generic quản lý URL Search Params
 * @param defaultParams Giá trị mặc định và định hình kiểu dữ liệu
 */
export const useQueryParams = <T extends Record<string, any>>(
  defaultParams: T,
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Parse URL Generic
  const params = useMemo(() => {
    const currentParams = {} as T;

    // Lấy tất cả key từ defaultParams để quét URL
    Object.keys(defaultParams).forEach((key) => {
      const value = searchParams.get(key);
      if (value === null) {
        // @ts-ignore
        currentParams[key] = defaultParams[key];
      } else {
        // Auto parse cơ bản (Số, Boolean, String)
        if (!isNaN(Number(value)) && typeof defaultParams[key] === "number") {
          // @ts-ignore
          currentParams[key] = Number(value);
        } else if (value === "true" || value === "false") {
          // @ts-ignore
          currentParams[key] = value === "true";
        } else {
          // @ts-ignore
          currentParams[key] = value;
        }
      }
    });

    return currentParams;
  }, [searchParams, defaultParams]);

  // 2. Set Params Generic
  const setParams = useCallback(
    (newParams: Partial<T>) => {
      setSearchParams((prev) => {
        const current = Object.fromEntries(prev.entries());
        const merged = { ...current, ...newParams };

        const cleanParams: Record<string, string> = {};
        Object.entries(merged).forEach(([key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value !== "all"
          ) {
            cleanParams[key] = String(value);
          }
        });
        return cleanParams;
      });
    },
    [setSearchParams],
  );

  return { params, setParams, searchParams };
};
