import React, { useState } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { cn } from "@/lib/utils";
import {
  Mic2,
  Music,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboardAnalytics } from "@/features/dashboard/hooks/useDashboard";
import { DashboardSkeleton } from "@/features/dashboard/components/DashboardSkeleton";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback"; // Component ảnh của bạn
import { formatNumber } from "@/utils/format";

const DashboardPage = () => {
  // Mặc định Dashboard xem 7 ngày
  const { data, isLoading, isError, refetch } = useDashboardAnalytics("7d");

  if (isLoading) return <DashboardSkeleton />;

  if (isError)
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h3 className="text-xl font-bold">Could not load dashboard data</h3>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );

  const { overview, charts, topLists } = data!;

  // Map API Data sang format của StatCard
  const stats = [
    {
      label: "Total Users",
      value: overview.users.value,
      change: overview.users.growth,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Tracks",
      value: overview.tracks.value,
      change: overview.tracks.growth,
      icon: Music,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Total Albums",
      value: overview.albums.value,
      change: overview.albums.growth,
      icon: Mic2,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
    },
    {
      label: "Total Plays",
      value: overview.plays.value,
      change: overview.plays.growth,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Dashboard"
        subtitle="Real-time overview of your platform."
        action={
          <div className="flex items-center gap-2 text-sm bg-white dark:bg-white/5 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              System Healthy
            </span>
          </div>
        }
      />

      {/* 1. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} item={stat} />
        ))}
      </div>

      {/* 2. Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart: Content Growth (Tracks) */}
        <div className="lg:col-span-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm flex flex-col">
          <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Content Growth
              </h2>
              <p className="text-sm text-gray-500">
                New tracks uploaded (Last 7 Days)
              </p>
            </div>
          </div>

          <div className="p-6 flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.trackGrowth} barSize={32}>
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
                  tickFormatter={(val) => val.split("-").slice(1).join("/")} // Format MM/DD
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#888" }}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#8b5cf6"
                  radius={[6, 6, 0, 0]}
                  name="New Tracks"
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* List: Top Artists */}
        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 dark:text-white">
              Top Artists
            </h3>
            <span className="text-xs text-gray-400">By Total Plays</span>
          </div>

          <div className="space-y-5 overflow-y-auto flex-1 pr-2 custom-scrollbar max-h-[350px]">
            {topLists.topArtists.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No data available
              </p>
            ) : (
              topLists.topArtists.map((artist, i) => (
                <div
                  key={artist._id}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="relative">
                    <span
                      className={cn(
                        "absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold border-2 border-white dark:border-[#1a1a1a] z-10",
                        i === 0
                          ? "bg-yellow-400 text-yellow-900"
                          : i === 1
                          ? "bg-gray-300 text-gray-800"
                          : i === 2
                          ? "bg-orange-400 text-orange-900"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                      )}
                    >
                      {i + 1}
                    </span>
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-500 transition-all">
                      <ImageWithFallback
                        src={artist.avatar}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">
                      {artist.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {formatNumber(artist.totalPlays)} plays
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component StatCard giữ nguyên logic hiển thị
const StatCard = ({ item }: { item: any }) => {
  const isPositive = item.change >= 0;
  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-xl transition-colors", item.bg)}>
          <item.icon className={cn("w-6 h-6", item.color)} />
        </div>
        <span
          className={cn(
            "text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1",
            isPositive
              ? "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10"
              : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/10"
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(item.change)}%
        </span>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {formatNumber(item.value)}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
        {item.label}
      </p>
    </div>
  );
};

export default DashboardPage;
