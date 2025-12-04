import PageHeader from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import { Disc, Edit2 } from "lucide-react";
const genresData = [
  { id: 1, name: "Pop", count: 1240, color: "from-pink-500 to-rose-500" },
  { id: 2, name: "Hip-Hop", count: 890, color: "from-orange-500 to-amber-500" },
  { id: 3, name: "Rock", count: 650, color: "from-red-500 to-red-700" },
  { id: 4, name: "Electronic", count: 430, color: "from-blue-500 to-cyan-500" },
  { id: 5, name: "R&B", count: 320, color: "from-purple-500 to-indigo-500" },
  { id: 6, name: "Jazz", count: 150, color: "from-yellow-400 to-amber-500" },
  {
    id: 7,
    name: "Classical",
    count: 90,
    color: "from-emerald-500 to-teal-500",
  },
  { id: 8, name: "Indie", count: 340, color: "from-lime-500 to-green-500" },
];

const GenrePage = () => {
  return (
    <>
      <PageHeader
        title="Genres"
        subtitle="Organize music categories."
        action={
          <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold">
            Add Genre
          </button>
        }
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {genresData.map((genre) => (
          <div
            key={genre.id}
            className={cn(
              "relative h-32 rounded-2xl p-4 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group bg-gradient-to-br",
              genre.color
            )}
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            <h3 className="relative z-10 text-white font-bold text-lg">
              {genre.name}
            </h3>
            <p className="relative z-10 text-white/80 text-xs">
              {genre.count} songs
            </p>
            <Disc className="absolute -bottom-4 -right-4 w-20 h-20 text-white/20 group-hover:rotate-45 transition-transform duration-500" />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 bg-white/20 rounded-full hover:bg-white/40 text-white">
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default GenrePage;
