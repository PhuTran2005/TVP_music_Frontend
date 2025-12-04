import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
interface HeaderProps {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({
  setIsSidebarOpen,
  toggleTheme,
  isDarkMode,
}) => {
  return (
    <>
      <header className="h-20 flex items-center justify-between px-6 lg:px-10 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#08080a]/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden sm:flex items-center relative group">
            <Search className="absolute left-3 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="w-64 h-10 bg-gray-100 dark:bg-[#1a1a1c] border border-transparent focus:border-indigo-500/50 dark:focus:border-white/10 rounded-full pl-10 pr-4 text-sm text-gray-900 dark:text-gray-200 placeholder:text-gray-500 focus:outline-none focus:bg-white dark:focus:bg-[#202022] focus:ring-2 focus:ring-indigo-500/10 transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="hidden sm:flex p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button className="relative p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#08080a]" />
          </button>
        </div>
      </header>
    </>
  );
};
export default Header;
