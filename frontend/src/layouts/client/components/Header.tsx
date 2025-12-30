import { useState, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  Home,
  Music,
  Users,
  Disc3,
  ListMusic,
  LogIn,
  NotebookPen,
  ChartColumn,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/store/store";
import { CLIENT_PATHS } from "@/config/paths";
import { cn } from "@/lib/utils";

// Components
import { ModeToggle } from "@/components/mode-toggle";
import UserDropdown from "@/features/user/components/UserDropdown";
import Avatar, { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "../../../../public/LOGO.png";
export function Header() {
  const { user } = useAppSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Đóng mobile menu khi chuyển route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Khóa scroll body khi mở mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

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
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        // Use semantic colors & borders
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60"
      >
        <div className="container mx-auto flex h-16 lg:h-[72px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* --- LEFT: LOGO & NAV --- */}
          <div className="flex items-center gap-6 xl:gap-10">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group relative z-10 focus-visible:outline-none"
            >
              <motion.div
                className="size-10 rounded-xl flex items-center justify-center shadow-md shadow-primary/20 text-primary-foreground"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Avatar className="size-15 sm:size-10 border border-border/50 shadow-sm cursor-pointer">
                  <AvatarImage
                    src={logo}
                    alt={user?.fullName || "User Avatar"}
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                    TVP
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="relative px-4 py-2 group focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        "text-sm font-medium transition-colors relative z-10",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground" // Use foreground on hover
                      )}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="desktop-navbar-underline"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* --- RIGHT: SEARCH, MODE & AUTH --- */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Desktop Search */}
            <form
              onSubmit={handleSearch}
              className="relative hidden sm:block group"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                // Use --input, --background vars
                className="w-[180px] lg:w-60 pl-9 h-10 bg-muted/50 border-transparent focus:bg-background focus:border-primary/30 focus:ring-2 focus:ring-primary/20 transition-all rounded-full"
              />
            </form>

            {/* Mobile Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
              onClick={() => navigate("/search")}
            >
              <Search className="size-5" />
            </Button>

            {/* Desktop Mode Toggle */}
            <div className="hidden lg:flex">
              <ModeToggle />
            </div>

            {/* Divider (Desktop only) */}
            <div className="hidden lg:block h-6 w-px bg-border mx-1"></div>

            {/* Auth Buttons */}
            {user ? (
              <UserDropdown user={user} navigate={navigate} />
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6 shadow-md shadow-primary/20 h-10 border-none"
                >
                  Sign up
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-muted -mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="size-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="size-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed top-16 lg:top-[72px] left-0 z-40 w-full bg-background/95 backdrop-blur-2xl border-t border-border overflow-hidden lg:hidden flex flex-col"
          >
            {/* Scrollable Content */}
            <div className="overflow-y-auto p-4 sm:p-6 flex flex-col gap-6 flex-1">
              {/* Mobile Search Input */}
              <form onSubmit={handleSearch} className="relative sm:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input
                  placeholder="Search music..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 h-11 bg-muted/50 border-transparent rounded-xl focus:bg-background focus:border-primary/30"
                />
              </form>

              {/* Nav Items */}
              <nav className="flex flex-col gap-1">
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium text-base",
                          isActive
                            ? "bg-primary/10 text-primary font-bold shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-5",
                            isActive ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
                {user?.role === "admin" && (
                  <motion.div
                    key={"admin"}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + navItems.length * 0.05 }}
                  >
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium text-base",
                        "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <ChartColumn
                        className={cn("size-5", "text-muted-foreground")}
                      />
                      Admin Dashboard
                    </Link>
                  </motion.div>
                )}
              </nav>
            </div>

            {/* --- MOBILE FOOTER --- */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                // Use border-t border-border
                className="p-4 sm:p-6 border-t border-border bg-muted/30 sm:pb-8 shrink-0"
              >
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl text-base border-border bg-background hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    <LogIn className="mr-2 size-4" />
                    Log in
                  </Button>
                  <Button
                    className="w-full h-11 rounded-xl text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 border-none"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/register");
                    }}
                  >
                    <NotebookPen className="mr-2 size-4" />
                    Sign up
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
