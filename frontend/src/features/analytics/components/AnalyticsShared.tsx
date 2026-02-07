import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// 1. Badge Live
export const LiveBadge = () => (
  <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </span>
    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
      Live
    </span>
  </div>
);

// 2. Custom Tooltip cho Chart
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl border border-gray-700">
        <p className="font-bold mb-1">{label}</p>
        <p className="text-indigo-400">
          Value:{" "}
          <span className="font-mono text-white ml-1">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

// 3. Stat Card (KPI)
interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: any;
}

export const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
}: StatCardProps) => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-2">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
        <Icon size={18} />
      </div>
      <div
        className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
          change >= 0
            ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10"
            : "text-red-600 bg-red-50 dark:bg-red-500/10"
        )}
      >
        {change >= 0 ? (
          <ArrowUpRight size={12} />
        ) : (
          <ArrowDownRight size={12} />
        )}
        {Math.abs(change)}%
      </div>
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
      {value}
    </div>
    <div className="text-xs text-gray-500 mt-1">{title}</div>
  </div>
);
