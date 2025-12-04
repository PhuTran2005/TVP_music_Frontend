import PageHeader from "@/components/ui/PageHeader";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { cn } from "@/lib/utils";
import { generateData } from "@/utils/generateData";
import Pagination from "@/utils/pagination";
import {
  AlertCircle,
  CheckCircle,
  Edit2,
  Filter,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

const songsData = generateData(45, (i) => ({
  id: i + 1,
  title: ["Midnight City", "Starboy", "Nightcall", "Resonance", "After Dark"][
    i % 5
  ],
  artist: ["M83", "The Weeknd", "Kavinsky", "Home", "Mr.Kitty"][i % 5],
  album: ["Hurry Up", "Starboy", "OutRun", "Odyssey", "Time"][i % 5],
  duration: ["4:03", "3:50", "4:18", "3:32", "4:17"][i % 5],
  status: i % 7 === 0 ? "Pending" : "Active",
  img: `https://images.unsplash.com/photo-${
    [
      "1493225255756-d9584f8606e9",
      "1614613535308-eb5fbd3d2c17",
      "1470225620780-dba8ba36b745",
    ][i % 3]
  }?w=100&h=100&fit=crop`,
}));

const SongPage = () => {
  /* ... Code cũ ... */
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [page]);
  const currentData = songsData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  return (
    <>
      <PageHeader
        title="Songs"
        subtitle="Manage your music library."
        action={
          <>
            <button className="p-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10">
              <Filter className="w-5 h-5" />
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-lg">
              <Plus className="w-4 h-4" /> Upload
            </button>
          </>
        }
      />
      <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider bg-gray-50/50 dark:bg-white/[0.02]">
                <th className="px-6 py-4 font-semibold w-16">#</th>
                <th className="px-6 py-4 font-semibold">Track</th>
                <th className="px-6 py-4 font-semibold hidden sm:table-cell">
                  Artist
                </th>
                <th className="px-6 py-4 font-semibold hidden md:table-cell">
                  Album
                </th>
                <th className="px-6 py-4 font-semibold hidden sm:table-cell">
                  Duration
                </th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-white/5">
              {isLoading ? (
                <TableSkeleton rows={8} cols={7} />
              ) : (
                currentData.map((song) => (
                  <tr
                    key={song.id}
                    className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-500">{song.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={song.img}
                          className="w-10 h-10 rounded-lg object-cover shadow-sm"
                        />
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white block">
                            {song.title}
                          </span>
                          <span className="text-xs text-gray-500 sm:hidden">
                            {song.artist}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                      {song.artist}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {song.album}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono hidden sm:table-cell">
                      {song.duration}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold border inline-flex items-center gap-1",
                          song.status === "Active"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                            : "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"
                        )}
                      >
                        {song.status === "Active" ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {song.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(songsData.length / itemsPerPage)}
          onPageChange={setPage}
          totalItems={songsData.length}
        />
      </div>
    </>
  );
};
export default SongPage;
