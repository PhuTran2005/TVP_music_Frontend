import Header from "@/layouts/admin/components/Header";
import Sidebar from "@/layouts/admin/components/Sidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // New state for desktop collapse
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsCollapsed(!isCollapsed); // Desktop toggle
  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.5); }
      `}</style>
      <div
        className={cn(
          "min-h-screen font-sans transition-colors duration-300",
          isDarkMode ? "dark bg-[#09090b]" : "bg-gray-50"
        )}
      >
        {isDarkMode && (
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
          </div>
        )}
        <div className="flex h-screen overflow-hidden relative z-10">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isCollapsed={isCollapsed}
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
            toggleSidebar={toggleSidebar}
          />
          <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            <Header
              setIsSidebarOpen={setIsSidebarOpen}
              toggleTheme={toggleTheme}
              isDarkMode={isDarkMode}
            />
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 custom-scrollbar">
              <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
                <Outlet />
              </div>
            </div>
          </main>
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default AdminLayout;
