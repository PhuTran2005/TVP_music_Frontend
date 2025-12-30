import { Skeleton } from "@/components/ui/skeleton";

export const SearchSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Top Result Skeleton */}
      <div>
        <Skeleton className="h-7 w-32 mb-4" />
        <Skeleton className="h-48 w-full max-w-md rounded-xl" />
      </div>
      {/* Songs Skeleton */}
      <div>
        <Skeleton className="h-7 w-24 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
