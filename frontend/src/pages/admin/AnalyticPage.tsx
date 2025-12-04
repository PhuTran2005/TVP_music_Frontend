import PageHeader from "@/components/ui/PageHeader";

const AnalyticPage = () => (
  <>
    <PageHeader
      title="Analytics"
      subtitle="Performance metrics."
      action={
        <div className="flex bg-white dark:bg-white/5 rounded-lg p-1 border border-gray-200 dark:border-white/10">
          <button className="px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded">
            7 Days
          </button>
          <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-white rounded">
            30 Days
          </button>
        </div>
      }
    />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex justify-between">
          User Growth <span className="text-emerald-500 text-sm">+12%</span>
        </h3>
        <div className="h-64 flex items-end gap-2 px-2">
          {[40, 60, 45, 70, 50, 80, 65, 85, 75, 90, 60, 95].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-indigo-50 dark:bg-indigo-500/10 rounded-t-sm relative group cursor-pointer"
            >
              <div
                style={{ height: `${h}%` }}
                className="absolute bottom-0 inset-x-0 bg-indigo-500 rounded-t-sm transition-all duration-500 group-hover:bg-indigo-400"
              ></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-gray-500 font-mono">
          <span>Jan 01</span>
          <span>Dec 31</span>
        </div>
      </div>
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-6">
          Revenue Sources
        </h3>
        <div className="h-64 flex items-center justify-center relative">
          <div
            className="w-48 h-48 rounded-full border-[12px] border-emerald-500 border-r-indigo-500 border-b-purple-500 border-l-pink-500 rotate-45 relative animate-[spin_10s_linear_infinite]"
            style={{ animationDuration: "20s" }}
          ></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              $12.4k
            </span>
            <span className="text-xs text-gray-500">Total Revenue</span>
          </div>
        </div>
      </div>
    </div>
  </>
);
export default AnalyticPage;
