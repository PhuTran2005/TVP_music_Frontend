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
  RefreshCcw,
  Zap,
  Activity,
  Layers,
  Disc,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useDashboardAnalytics } from "@/features/dashboard/hooks/useDashboard";
import { DashboardSkeleton } from "@/features/dashboard/components/DashboardSkeleton";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { formatNumber } from "@/utils/format";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardRange } from "@/features/dashboard/schemas/dashboard.schema";
import { SystemHealthDialog } from "@/features/dashboard/components/SystemHealthDialog";

const DashboardPage = () => {
  const [range, setRange] = useState<DashboardRange>("7d");
  const { data, isLoading, isError, refetch, isRefetching } =
    useDashboardAnalytics(range);

  if (isLoading) return <DashboardSkeleton />;

  if (isError)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in duration-300 p-6 text-center">
        <div className="p-6 bg-destructive/10 rounded-full ring-4 ring-destructive/5">
          <AlertCircle className="w-16 h-16 text-destructive" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-2xl font-bold text-foreground tracking-tight">
            Data Retrieval Failed
          </h3>
          <p className="text-muted-foreground">
            We encountered an issue while fetching the dashboard metrics. Please
            check your connection and try again.
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          size="lg"
          className="gap-2 shadow-lg shadow-primary/20"
        >
          <RefreshCcw className="w-4 h-4" /> Reload Dashboard
        </Button>
      </div>
    );

  const { overview, charts, topLists, systemHealth } = data!;

  const systemHasIssue =
    systemHealth.queue.failed > 0 || systemHealth.trackStatus.failed > 0;

  // Cấu hình Stats với màu sắc và icon tinh tế hơn
  const stats = [
    {
      label: "Total Users",
      value: overview.users.value,
      change: overview.users.growth,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800",
    },
    {
      label: "Total Tracks",
      value: overview.tracks.value,
      change: overview.tracks.growth,
      icon: Music,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-800",
    },
    {
      label: "Total Albums",
      value: overview.albums.value,
      change: overview.albums.growth,
      icon: Disc, // Đổi icon cho hợp lý hơn
      color: "text-pink-600 dark:text-pink-400",
      bg: "bg-pink-50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-800",
    },
    {
      label: "Total Plays",
      value: overview.plays.value,
      change: overview.plays.growth,
      icon: Activity, // Đổi icon để tránh trùng lặp ý nghĩa visual
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-800",
    },
  ];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <PageHeader
          title="Overview"
          subtitle="Real-time insights into platform performance."
        />

        <div className="flex flex-wrap items-center gap-3">
          {/* Range Selector - Thiết kế gọn gàng hơn */}
          <Select
            value={range}
            onValueChange={(v) => setRange(v as DashboardRange)}
          >
            <SelectTrigger className="w-[150px] h-10 bg-background border-input font-medium shadow-sm transition-all hover:border-primary/50 focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
            </SelectContent>
          </Select>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className={cn(
              "h-10 w-10 bg-background border-input hover:bg-accent hover:text-accent-foreground shadow-sm transition-all",
              isRefetching && "animate-spin text-primary border-primary"
            )}
            title="Refresh Data"
          >
            <RefreshCcw className="w-4 h-4" />
          </Button>

          {/* System Health Badge */}
          <SystemHealthDialog data={systemHealth}>
            <button
              className={cn(
                "group flex items-center gap-2.5 h-10 px-4 rounded-lg border text-sm font-bold shadow-sm transition-all hover:shadow-md active:scale-95",
                systemHasIssue
                  ? "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20"
                  : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400"
              )}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    systemHasIssue ? "bg-destructive" : "bg-emerald-500"
                  )}
                ></span>
                <span
                  className={cn(
                    "relative inline-flex rounded-full h-2.5 w-2.5",
                    systemHasIssue ? "bg-destructive" : "bg-emerald-500"
                  )}
                ></span>
              </span>
              <span className="hidden sm:inline">
                System {systemHasIssue ? "Issues" : "Healthy"}
              </span>
            </button>
          </SystemHealthDialog>
        </div>
      </div>

      {/* --- HERO SECTION: Active Users --- */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary text-primary-foreground rounded-3xl p-8 shadow-xl shadow-primary/20">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 pointer-events-none">
          <Zap className="w-64 h-64 rotate-12" />
        </div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 opacity-10 pointer-events-none">
          <TrendingUp className="w-48 h-48 -rotate-12" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary-foreground/80 font-bold uppercase tracking-wider text-sm">
              <Zap className="w-4 h-4" /> Live Activity
            </div>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Real-time Engagement
            </h3>
            <p className="text-primary-foreground/70 font-medium max-w-md">
              Monitoring active sessions across all platforms in the last 24
              hours.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 min-w-[280px] flex flex-col items-center md:items-end shadow-inner">
            <span className="text-sm font-bold text-primary-foreground/80 uppercase tracking-widest mb-1">
              Active Users
            </span>
            <span className="text-5xl md:text-6xl font-black tracking-tighter tabular-nums drop-shadow-sm">
              {formatNumber(overview.activeUsers24h)}
            </span>
          </div>
        </div>
      </div>

      {/* --- KEY METRICS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} item={stat} />
        ))}
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="space-y-8">
        {/* User Growth Chart */}
        <UserGrowthChart data={charts.userGrowth} range={range} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Content Growth (Tracks) */}
          <div className="xl:col-span-2 bg-card border border-border rounded-3xl shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-6 border-b border-border/60 flex items-center justify-between bg-muted/20">
              <div>
                <h2 className="text-xl font-bold text-card-foreground flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" /> Content Growth
                </h2>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  New tracks published over time
                </p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground border border-border px-3 py-1.5 rounded-lg bg-background shadow-sm">
                Last {range}
              </span>
            </div>
            <div className="p-6 h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.trackGrowth} barSize={36}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                    opacity={0.6}
                  />
                  <XAxis
                    dataKey="_id"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                      fontWeight: 600,
                    }}
                    dy={15}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                      fontWeight: 600,
                    }}
                    dx={-10}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted)/0.3)", radius: 8 }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
                      backgroundColor: "hsl(var(--popover))",
                      color: "hsl(var(--popover-foreground))",
                      fontWeight: 600,
                      padding: "10px 16px",
                    }}
                    formatter={(value: number) => [value, "New Tracks"]}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString()
                    }
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                    name="New Tracks"
                    className="hover:opacity-80 transition-all cursor-pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Artists List */}
          <div className="bg-card border border-border rounded-3xl shadow-sm flex flex-col h-[500px] overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="p-6 border-b border-border/60 bg-muted/20 shrink-0">
              <h3 className="font-bold text-card-foreground text-xl flex items-center gap-2">
                <Mic2 className="w-5 h-5 text-orange-500" /> Top Artists
              </h3>
              <p className="text-sm text-muted-foreground font-medium mt-1">
                Ranking by total plays
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {topLists.topArtists.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 space-y-3">
                  <div className="p-4 bg-muted rounded-full">
                    <Music className="w-8 h-8" />
                  </div>
                  <p className="font-semibold">No data available</p>
                </div>
              ) : (
                topLists.topArtists.map((artist, i) => (
                  <div
                    key={artist._id}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-muted/60 transition-all border border-transparent hover:border-border cursor-pointer group"
                  >
                    <div className="relative shrink-0">
                      <span
                        className={cn(
                          "absolute -top-1 -left-1 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black z-10 shadow-md border-2 border-card",
                          i === 0
                            ? "bg-yellow-400 text-yellow-950"
                            : i === 1
                            ? "bg-slate-300 text-slate-900"
                            : i === 2
                            ? "bg-orange-400 text-orange-950"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {i + 1}
                      </span>
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all shadow-sm">
                        <ImageWithFallback
                          src={artist.avatar}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {artist.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 tabular-nums">
                          {formatNumber(artist.totalPlays)} plays
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS (Tối ưu hóa) ---

const StatCard = ({ item }: { item: any }) => {
  const isPositive = item.change >= 0;
  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group relative overflow-hidden">
      {/* Background Glow Effect */}
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-bl-full pointer-events-none transition-opacity group-hover:opacity-10",
          item.color.replace("text-", "from-").replace(" dark:", " dark:from-")
        )}
      ></div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div
          className={cn(
            "p-3.5 rounded-2xl transition-transform group-hover:scale-110 duration-300 border shadow-sm",
            item.bg
          )}
        >
          <item.icon className={cn("w-6 h-6", item.color)} />
        </div>
        <span
          className={cn(
            "text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border shadow-sm",
            isPositive
              ? "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
              : "text-red-700 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          {Math.abs(item.change)}%
        </span>
      </div>
      <div className="relative z-10">
        <h3 className="text-4xl font-black text-card-foreground tracking-tighter tabular-nums">
          {formatNumber(item.value)}
        </h3>
        <p className="text-sm text-muted-foreground font-semibold mt-1">
          {item.label}
        </p>
      </div>
    </div>
  );
};

const UserGrowthChart = ({ data, range }: { data: any[]; range: string }) => {
  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold text-card-foreground flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" /> User Growth
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            Tracking new registrations over time
          </p>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground border border-border px-3 py-1.5 rounded-lg bg-muted/30 self-start sm:self-auto shadow-sm">
          Last {range}
        </span>
      </div>

      <div className="h-[350px] sm:h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              opacity={0.6}
            />
            <XAxis
              dataKey="_id"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "hsl(var(--muted-foreground))",
                fontWeight: 600,
              }}
              dy={15}
              tickFormatter={(val) => {
                const d = new Date(val);
                return `${d.getDate()}/${d.getMonth() + 1}`;
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "hsl(var(--muted-foreground))",
                fontWeight: 600,
              }}
              dx={-10}
            />
            <Tooltip
              cursor={{
                stroke: "hsl(var(--primary))",
                strokeWidth: 2,
                strokeDasharray: "5 5",
              }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid hsl(var(--border))",
                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
                backgroundColor: "hsl(var(--popover))",
                color: "hsl(var(--popover-foreground))",
                fontWeight: 600,
                padding: "10px 16px",
              }}
              formatter={(value: number) => [value, "New Users"]}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorUsers)"
              activeDot={{
                r: 8,
                strokeWidth: 4,
                fill: "hsl(var(--background))",
                stroke: "hsl(var(--primary))",
              }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;
