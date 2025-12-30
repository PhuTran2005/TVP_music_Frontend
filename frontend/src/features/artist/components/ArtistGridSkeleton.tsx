// 2. Loading Skeleton
const ArtistGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
    {[...Array(10)].map((_, i) => (
      <div
        key={i}
        className="h-64 bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
      >
        <div className="h-32 bg-muted animate-pulse" />
        <div className="flex flex-col items-center px-4 -mt-10">
          <div className="w-20 h-20 rounded-full bg-muted border-4 border-card animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded mt-3 animate-pulse" />
          <div className="h-3 w-20 bg-muted rounded mt-2 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);
export default ArtistGridSkeleton;
