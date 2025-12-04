const CardSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 animate-pulse"
      >
        <div className="aspect-square bg-gray-200 dark:bg-white/10 rounded-xl mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

export default CardSkeleton;
