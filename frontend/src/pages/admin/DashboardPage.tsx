import PageHeader from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import { generateData } from "@/utils/generateData";
import { Mic2, Music, TrendingUp, Users } from "lucide-react";
const StatCard = ({ item }: { item: (typeof stats)[0] }) => (
  <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md dark:hover:bg-white/[0.07] transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={cn("p-3 rounded-xl transition-colors", item.bg)}>
        <item.icon className={cn("w-6 h-6", item.color)} />
      </div>
      <span
        className={cn(
          "text-xs font-semibold px-2.5 py-1 rounded-full",
          item.change.startsWith("+")
            ? "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10"
            : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/10"
        )}
      >
        {item.change}
      </span>
    </div>
    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
      {item.value}
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
      {item.label}
    </p>
  </div>
);

const stats = [
  {
    label: "Total Users",
    value: "24.5k",
    change: "+12%",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10 dark:bg-blue-500/10 bg-blue-50",
  },
  {
    label: "Total Songs",
    value: "10,234",
    change: "+58",
    icon: Music,
    color: "text-purple-500",
    bg: "bg-purple-500/10 dark:bg-purple-500/10 bg-purple-50",
  },
  {
    label: "Active Artists",
    value: "843",
    change: "+4%",
    icon: Mic2,
    color: "text-pink-500",
    bg: "bg-pink-500/10 dark:bg-pink-500/10 bg-pink-50",
  },
  {
    label: "Revenue",
    value: "$12,450",
    change: "+23%",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/10 bg-emerald-50",
  },
];
const artistsData = generateData(20, (i) => ({
  id: i + 1,
  name: ["The Weeknd", "Dua Lipa", "Drake", "Taylor Swift", "Post Malone"][
    i % 5
  ],
  followers: `${(Math.random() * 50).toFixed(1)}M`,
  tracks: 15 + i * 2,
  img: `https://i.pravatar.cc/150?img=${20 + i}`,
}));

const DashboardPage = () => (
  <>
    <PageHeader
      title="Dashboard"
      subtitle="Welcome back, here's what's happening today."
      action={
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10">
          <span className="font-semibold text-gray-900 dark:text-white">
            Oct 24, 2024
          </span>
        </div>
      }
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} item={stat} />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Revenue Overview
          </h2>
        </div>
        <div className="p-6">
          <div className="h-64 flex items-end gap-3">
            {generateData(12, (i) => (
              <div key={i} className="flex-1 flex flex-col justify-end group">
                <div
                  style={{ height: `${30 + Math.random() * 70}%` }}
                  className="w-full bg-indigo-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all"
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">
          Top Artists
        </h3>
        <div className="space-y-4">
          {artistsData.slice(0, 5).map((artist, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-400 w-4">
                {i + 1}
              </span>
              <img
                src={artist.img}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {artist.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {artist.followers} followers
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);
export default DashboardPage;
