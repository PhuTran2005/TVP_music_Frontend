import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useDashboardAnalytics } from "@/features/dashboard/hooks/useDashboard";
import { DashboardRange } from "@/features/dashboard/types";
import { DashboardSkeleton } from "@/features/dashboard/components/DashboardSkeleton";
import { formatNumber } from "@/utils/formatters";

const AnalyticPage = () => {
  // 1. State quản lý range (lọc data)
  const [timeRange, setTimeRange] = useState<DashboardRange>("7d");

  // 2. Hook tự động fetch lại khi timeRange đổi
  const { data, isLoading } = useDashboardAnalytics(timeRange);

  if (isLoading) return <DashboardSkeleton />;
  if (!data) return null;

  const { charts, overview } = data;

  // Mock data cho PieChart (Backend chưa có phần này, ta mock tạm để UI đẹp)
  const revenueSourceData = [
    { name: "Subscription", value: 65, color: "#10b981" },
    { name: "Ads", value: 20, color: "#6366f1" },
    { name: "Merch", value: 15, color: "#ec4899" },
  ];

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Analytics"
        subtitle="Detailed growth analysis & metrics."
        action={
          <div className="flex bg-gray-100 dark:bg-white/5 rounded-lg p-1 border border-gray-200 dark:border-white/10">
            {(["7d", "30d", "90d"] as DashboardRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-1.5 text-xs font-semibold rounded-md transition-all",
                  timeRange === range
                    ? "bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                {range === "7d"
                  ? "7 Days"
                  : range === "30d"
                  ? "30 Days"
                  : "3 Months"}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: User Growth (Area Chart) */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                User Growth
              </h3>
              <p className="text-xs text-gray-500">New user registrations</p>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full",
                overview.users.growth >= 0
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-red-500/10 text-red-500"
              )}
            >
              <span className="text-sm font-bold">
                {overview.users.growth > 0 ? "+" : ""}
                {overview.users.growth}%
              </span>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.userGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#333"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                  dy={10}
                  tickFormatter={(val) => val.split("-").slice(1).join("/")}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="New Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Revenue Sources (Pie Chart - Mocked for UI) */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 text-center">
            Revenue Distribution
          </h3>
          <p className="text-xs text-gray-500 mb-6 text-center">
            Estimated breakdown (Mock Data)
          </p>

          <div className="h-[300px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {revenueSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                100%
              </span>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Total
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {revenueSourceData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticPage;
