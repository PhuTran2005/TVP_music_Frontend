const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr
        key={i}
        className="animate-pulse border-b border-gray-100 dark:border-white/5"
      >
        {Array.from({ length: cols }).map((_, j) => (
          <td key={j} className="px-6 py-4">
            <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-full"></div>
          </td>
        ))}
      </tr>
    ))}
  </>
);
export default TableSkeleton;
