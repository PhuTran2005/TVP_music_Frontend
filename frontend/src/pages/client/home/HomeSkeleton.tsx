import { Skeleton } from "@/components/ui/skeleton";

export const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-background pb-20 space-y-12">
      {/* Hero Skeleton */}
      <div className="w-full h-[500px] bg-muted/30 animate-pulse relative">
        <div className="container mx-auto px-6 h-full flex items-center">
          <div className="space-y-6 w-full max-w-xl">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-14 w-40 rounded-full" />
              <Skeleton className="h-14 w-40 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="container mx-auto px-6 space-y-16">
        {[1, 2].map((section) => (
          <div key={section} className="space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5].map((card) => (
                <div key={card} className="space-y-3">
                  <Skeleton className="aspect-square rounded-2xl w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
