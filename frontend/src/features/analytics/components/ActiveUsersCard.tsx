import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Activity } from "lucide-react";
import { LiveBadge } from "./AnalyticsShared";

interface ActiveUsersCardProps {
  activeUsers: number;
}

const ActiveUsersCard = ({ activeUsers }: ActiveUsersCardProps) => {
  return (
    <div className="lg:col-span-1 bg-card text-card-foreground rounded-2xl p-6 shadow-md border border-border relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.07] transition-opacity">
        <Activity size={140} />
      </div>

      <div className="flex justify-between items-start z-10 relative">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users size={18} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Concurrent Users
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeUsers}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-6xl font-black tracking-tighter tabular-nums text-foreground leading-none mt-2"
            >
              {activeUsers.toLocaleString()}
            </motion.div>
          </AnimatePresence>
        </div>
        <LiveBadge />
      </div>

      {/* Footer Stats (Server Load, etc.) */}
      <div className="mt-8 z-10 relative">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            Server Load
          </span>
          <span className="text-xs font-bold text-emerald-500">Stable</span>
        </div>
        <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "30%" }}
            animate={{ width: ["30%", "45%", "35%"] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersCard;
