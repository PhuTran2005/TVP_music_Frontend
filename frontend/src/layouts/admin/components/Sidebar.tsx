import { ADMIN_PATHS } from "@/config/paths";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Disc,
  LayoutDashboard,
  ListMusic,
  LogOut,
  MessageSquare,
  Mic2,
  Moon,
  Music,
  Settings,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
const SidebarItem = ({
  icon: Icon,
  label,
  active,
  onClick,
  collapsed,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}) => (
  <button
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
      active
        ? "text-indigo-600 dark:text-white bg-indigo-50 dark:bg-white/10 font-semibold shadow-sm"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white",
      collapsed && "justify-center px-2"
    )}
  >
    {active && (
      <div
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full",
          collapsed && "left-0 h-4 w-1"
        )}
      />
    )}
    <Icon
      className={cn(
        "w-5 h-5 transition-transform group-hover:scale-110 shrink-0",
        active
          ? "text-indigo-600 dark:text-indigo-400"
          : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-500"
      )}
    />
    {!collapsed && (
      <span className="text-sm whitespace-nowrap transition-opacity duration-300">
        {label}
      </span>
    )}
  </button>
);
const sidebarGroups = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: ADMIN_PATHS.ADMIN + "/" + ADMIN_PATHS.DASHBOARD,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        label: "Songs",
        path: ADMIN_PATHS.ADMIN + "/" + ADMIN_PATHS.SONGS,
        icon: Music,
      },
      {
        label: "Albums",
        path: ADMIN_PATHS.ADMIN + "/" + ADMIN_PATHS.ALBUMS,
        icon: Disc,
      },
      {
        label: "Artists",
        path: ADMIN_PATHS.ADMIN + "/" + ADMIN_PATHS.ARTISTS,
        icon: Mic2,
      },
      {
        label: "Genres",
        path: ADMIN_PATHS.ADMIN + "/" + ADMIN_PATHS.GENRES,
        icon: ListMusic,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Users",
        path: ADMIN_PATHS.ADMIN + "/" + ADMIN_PATHS.USERS,
        icon: Users,
      },
      { label: "Comments", path: "/comments", icon: MessageSquare },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Analytics",
        path: ADMIN_PATHS.ADMIN + "/" + ADMIN_PATHS.ANALYTICS,
        icon: BarChart3,
      },
      {
        label: "Settings",
        path: ADMIN_PATHS.ADMIN + "/" + ADMIN_PATHS.SETTINGS,
        icon: Settings,
      },
    ],
  },
];
interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed: boolean;
  toggleTheme: () => void;
  isDarkMode: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isCollapsed,
  toggleTheme,
  isDarkMode,
  toggleSidebar,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.pathname);
  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#09090b]/95 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 transition-all duration-300 ease-in-out flex flex-col shadow-2xl lg:shadow-none",
          // Mobile state: Fixed, transform based on isSidebarOpen
          // Desktop state: Relative (in-flow)
          "lg:static",
          isSidebarOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-72"
        )}
      >
        <div
          className={cn(
            "h-20 flex items-center border-b border-gray-100 dark:border-white/5",
            isCollapsed ? "justify-center px-0" : "px-8 justify-between"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 shrink-0">
              M
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
                MusicHub
              </span>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 dark:text-gray-400"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6 custom-scrollbar">
          {sidebarGroups.map((group) => (
            <div key={group.title}>
              {!isCollapsed && (
                <p className="px-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 whitespace-nowrap transition-opacity duration-300">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    active={location.pathname.includes(`${item.path}`)}
                    onClick={() => navigate(item.path)}
                    collapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-gray-100 dark:border-white/5 space-y-2">
          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex w-full items-center justify-center p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors mb-2"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={toggleTheme}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors",
              isCollapsed && "justify-center"
            )}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 shrink-0" />
            ) : (
              <Moon className="w-5 h-5 shrink-0" />
            )}
            {!isCollapsed && (
              <span className="text-sm font-medium whitespace-nowrap">
                Theme
              </span>
            )}
          </button>

          <button
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group",
              isCollapsed && "justify-center"
            )}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-white/10 overflow-hidden shrink-0">
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            {!isCollapsed && (
              <>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    Admin
                  </p>
                  <p className="text-xs text-gray-500 truncate">Super Admin</p>
                </div>
                <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
