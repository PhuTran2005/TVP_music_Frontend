import CardSkeleton from "@/components/ui/CardSkeleton";
import PageHeader from "@/components/ui/PageHeader";
import { generateData } from "@/utils/generateData";
import Pagination from "@/utils/pagination";
import { Disc, Edit2, PlayCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const albumsData = generateData(24, (i) => ({
  id: i + 1,
  title: [
    "After Hours",
    "Future Nostalgia",
    "Certified Lover Boy",
    "Midnights",
    "Dawn FM",
  ][i % 5],
  artist: ["The Weeknd", "Dua Lipa", "Drake", "Taylor Swift", "The Weeknd"][
    i % 5
  ],
  year: 2020 + (i % 4),
  tracks: 10 + (i % 10),
  img: `https://images.unsplash.com/photo-${
    [
      "1619983081563-430f63602796",
      "1494790108377-be9c29b29330",
      "1570295999919-56ceb5ecca61",
    ][i % 3]
  }?w=300&h=300&fit=crop`,
}));

const AlbumPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [page]);
  const currentData = albumsData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  return (
    <>
      <PageHeader
        title="Albums"
        subtitle="Browse album collection."
        action={
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-lg">
            <Plus className="w-4 h-4" /> Add Album
          </button>
        }
      />
      {isLoading ? (
        <CardSkeleton count={8} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentData.map((album) => (
            <div
              key={album.id}
              className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="aspect-square rounded-xl overflow-hidden mb-4 shadow-md relative">
                <img
                  src={album.img}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  <button className="p-2 bg-white rounded-full text-black hover:scale-110 transition-transform">
                    <PlayCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white truncate">
                {album.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {album.artist} • {album.year}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                <Disc className="w-3 h-3" /> {album.tracks} tracks
              </div>
            </div>
          ))}
        </div>
      )}
      {!isLoading && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(albumsData.length / itemsPerPage)}
            onPageChange={setPage}
            totalItems={albumsData.length}
          />
        </div>
      )}
    </>
  );
};
export default AlbumPage;
