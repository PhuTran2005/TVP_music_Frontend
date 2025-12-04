import CardSkeleton from "@/components/ui/CardSkeleton";
import PageHeader from "@/components/ui/PageHeader";
import { generateData } from "@/utils/generateData";
import Pagination from "@/utils/pagination";
import { useEffect, useState } from "react";

const artistsData = generateData(20, (i) => ({
  id: i + 1,
  name: ["The Weeknd", "Dua Lipa", "Drake", "Taylor Swift", "Post Malone"][
    i % 5
  ],
  followers: `${(Math.random() * 50).toFixed(1)}M`,
  tracks: 15 + i * 2,
  img: `https://i.pravatar.cc/150?img=${20 + i}`,
}));

const ArtistPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, [page]);
  const currentData = artistsData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  return (
    <>
      <PageHeader
        title="Artists"
        subtitle="Verified artist profiles."
        action={
          <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-lg">
            Add Artist
          </button>
        }
      />
      {isLoading ? (
        <CardSkeleton count={8} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentData.map((artist) => (
            <div
              key={artist.id}
              className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-lg transition-all group text-center p-6 relative"
            >
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 shadow-lg ring-4 ring-gray-50 dark:ring-white/5 group-hover:ring-indigo-500/20 transition-all">
                <img src={artist.img} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {artist.name}
              </h3>
              <p className="text-sm text-indigo-500 font-medium mb-4">
                {artist.followers} Followers
              </p>
              <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-6 left-0 right-0 px-6 bg-white/90 dark:bg-[#08080a]/90 backdrop-blur-sm py-2">
                <button className="flex-1 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700">
                  Edit
                </button>
                <button className="flex-1 py-1.5 border border-red-500/30 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-500/10">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {!isLoading && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(artistsData.length / itemsPerPage)}
            onPageChange={setPage}
            totalItems={artistsData.length}
          />
        </div>
      )}
    </>
  );
};
export default ArtistPage;
