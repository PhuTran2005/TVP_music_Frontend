import { useState } from "react";
import {
  Search,
  Menu,
  User,
  X,
  Home,
  Music,
  Users,
  Disc3,
  ListMusic,
  Settings,
  LogIn,
  NotebookPen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Đảm bảo đường dẫn đúng tới file UI của bạn
import { LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useAppSelector } from "@/store/store";
import { CLIENT_PATHS } from "@/config/paths";

export function Header() {
  const { user } = useAppSelector((state) => state.auth);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { label: "Home", icon: Home, path: CLIENT_PATHS.HOME },
    {
      label: "Browse",
      icon: Music,
      path: CLIENT_PATHS.CLIENT + CLIENT_PATHS.BROWSE,
    },
    {
      label: "Artists",
      icon: Users,
      path: CLIENT_PATHS.CLIENT + CLIENT_PATHS.ARTISTS,
    },
    {
      label: "Albums",
      icon: Disc3,
      path: CLIENT_PATHS.CLIENT + CLIENT_PATHS.ALBUMS,
    },
    {
      label: "Playlists",
      icon: ListMusic,
      path: CLIENT_PATHS.CLIENT + CLIENT_PATHS.PLAYLISTS,
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/50"
      >
        <div className="container flex h-16 items-center justify-between px-4 lg:px-6">
          <motion.div
            className="flex items-center gap-4 lg:gap-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                className="size-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <span className="text-primary-foreground font-bold">M</span>
              </motion.div>
              <span className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                MusicHub
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    to={item.path}
                    className={`relative transition-colors hover:text-primary group ${
                      location.pathname === item.path ? "text-primary" : ""
                    }`}
                  >
                    {item.label}
                    <motion.div
                      className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                      initial={{
                        width: location.pathname === item.path ? "100%" : 0,
                      }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 lg:gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.form
              className="relative hidden sm:block "
              whileHover={{ scale: 1.02 }}
              onSubmit={handleSearch}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder="Search music, artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px] lg:w-[300px] pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:bg-background transition-all duration-200"
              />
            </motion.form>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.div>
            </Button>
            <Link to="/search">
              <Button variant="ghost" size="sm" className="sm:hidden">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            {/* Phần User Avatar Dropdown */}
            {user && (
              <DropdownMenu>
                {/* Trigger: Phần tử để click vào */}
                <DropdownMenuTrigger asChild>
                  <motion.div
                    className="cursor-pointer" // Thêm cursor pointer
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="relative overflow-hidden rounded-full border border-border/50" // Thêm border cho đẹp
                    >
                      <User className="h-5 w-5" />
                      {/* Hiệu ứng nền khi hover cũ của bạn */}
                      <motion.div
                        className="absolute inset-0 bg-primary/20 rounded-full"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>

                {/* Content: Nội dung sổ xuống */}
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.username || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "email@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Mục Profile */}
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="cursor-pointer flex items-center w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* Mục Settings */}
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings"
                      className="cursor-pointer flex items-center w-full"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Mục Logout */}
                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/logout");
                    }}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!user && (
              <>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-b-gray-400 hidden lg:flex"
                >
                  <Link to="/login">
                    Login
                    <motion.div
                      className="absolute inset-0 bg-primary/20 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden lg:flex"
                >
                  <Link to="/register">
                    Register
                    <motion.div
                      className="absolute inset-0 bg-primary/20 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            // Thay đổi animation: Chuyển từ height sang opacity/y cho mượt hơn khi full màn hình
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            // CẬP NHẬT CLASS TẠI ĐÂY:
            // 1. fixed: Để cố định vị trí đè lên nội dung bên dưới
            // 2. top-16: Bắt đầu ngay bên dưới Header (h-16)
            // 3. left-0 w-full: Tràn chiều ngang
            // 4. h-[calc(100vh-4rem)]: Chiều cao bằng toàn màn hình trừ đi chiều cao Header
            // 5. overflow-y-auto: Cho phép cuộn nếu danh sách dài
            className="lg:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] z-40 bg-background/95 backdrop-blur-md border-t border-border/50 overflow-y-auto"
          >
            <div className="container px-4 py-6 pb-20">
              {" "}
              {/* Thêm padding bottom để không bị sát đáy */}
              <nav className="grid gap-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors text-lg font-medium ${
                          location.pathname === item.path
                            ? "bg-primary/10 text-primary"
                            : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-6 w-6" />{" "}
                        {/* Icon to hơn một chút cho mobile */}
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}

                {!user && (
                  <>
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length - 1) * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        to="/login"
                        className={`flex items-center gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors text-lg font-medium ${
                          location.pathname === "/login"
                            ? "bg-primary/10 text-primary"
                            : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LogIn className="h-6 w-6" />
                        Login
                      </Link>
                    </motion.div>
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        to="/register"
                        className={`flex items-center gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors text-lg font-medium ${
                          location.pathname === "/register"
                            ? "bg-primary/10 text-primary"
                            : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <NotebookPen className="h-6 w-6" />
                        Register
                      </Link>
                    </motion.div>
                  </>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
