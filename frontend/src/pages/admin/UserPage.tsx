import PageHeader from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import { generateData } from "@/utils/generateData";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
const usersData = generateData(32, (i: number) => ({
  id: i + 1,
  name: [
    "Alex Doe",
    "Sarah Smith",
    "John Wick",
    "Emily Blunt",
    "Michael Scott",
  ][i % 5],
  email: `user${i}@example.com`,
  role: ["Admin", "User", "Artist", "User", "Manager"][i % 5],
  status: i % 5 === 0 ? "Inactive" : "Active",
  img: `https://i.pravatar.cc/150?img=${(i % 10) + 1}`,
}));
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}) => (
  <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
    <span className="text-sm text-gray-500 dark:text-gray-400">
      Showing{" "}
      <span className="font-medium text-gray-900 dark:text-white">
        {(currentPage - 1) * 5 + 1}
      </span>{" "}
      to{" "}
      <span className="font-medium text-gray-900 dark:text-white">
        {Math.min(currentPage * 5, totalItems)}
      </span>{" "}
      of{" "}
      <span className="font-medium text-gray-900 dark:text-white">
        {totalItems}
      </span>{" "}
      results
    </span>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);
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

const UsersPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [page]);
  const currentData = usersData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  return (
    <>
      <PageHeader
        title="Users"
        subtitle="Manage user access."
        action={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-lg">
              <Plus className="w-4 h-4" /> Add User
            </button>
          </div>
        }
      />
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider bg-gray-50/50 dark:bg-white/[0.02]">
                <th className="px-6 py-4 font-semibold">User Info</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-white/5">
              {isLoading ? (
                <TableSkeleton rows={8} cols={4} />
              ) : (
                currentData.map((user) => (
                  <tr
                    key={user.id}
                    className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.img}
                          className="w-10 h-10 rounded-full object-cover shadow-sm"
                        />
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white block">
                            {user.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1.5",
                          user.status === "Active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                            : "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400"
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            user.status === "Active"
                              ? "bg-emerald-500"
                              : "bg-gray-500"
                          )}
                        />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(usersData.length / itemsPerPage)}
          onPageChange={setPage}
          totalItems={usersData.length}
        />
      </div>
    </>
  );
};
export default UsersPage;
