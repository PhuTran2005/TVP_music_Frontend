import React, { useState, useEffect } from "react";
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
  Sparkles,
  Command,
  LayoutDashboard,
  KeyboardMusic,
  ChartBar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CLIENT_PATHS } from "@/config/paths";
import { cn } from "@/lib/utils";

// Components
import { ModeToggle } from "@/components/mode-toggle";
import UserDropdown from "@/features/user/components/UserDropdown";
import Avatar, { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logo from "../../../../public/LOGO.png";
import { useAppSelector } from "@/store/hooks";

export function Header() {
  const { user } = useAppSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // --- Logic Hooks ---
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // --- Navigation Data ---
  const navItems = [
    { label: "Home", icon: Home, path: CLIENT_PATHS.HOME },
    {
      label: "Charts",
      icon: ChartBar,
      path: CLIENT_PATHS.CLIENT + CLIENT_PATHS.CHART_TOP,
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
    {
      label: "Genres",
      icon: KeyboardMusic,
      path: CLIENT_PATHS.CLIENT + CLIENT_PATHS.GENRES,
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
        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container mx-auto flex h-16 lg:h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* --- LEFT SECTION: LOGO & BRAND --- */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            >
              <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary/20 to-primary/10 border border-primary/20 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-primary/30">
                <Avatar className="size-full rounded-xl">
                  <AvatarImage
                    src={logo}
                    alt="Logo"
                    className="object-cover p-1" // Padding nhẹ để logo không bị sát viền
                  />
                  <AvatarFallback className="bg-transparent font-bold text-primary">
                    TVP
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>

            {/* --- DESKTOP NAVIGATION --- */}
            <nav className="hidden lg:flex items-center gap-1 bg-muted/40 p-1 rounded-full border border-border/40">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "relative px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="desktop-nav-pill"
                        className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/20 z-0"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {/* Icon chỉ hiện khi active để tạo điểm nhấn */}
                      {isActive && <item.icon className="size-3.5" />}
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* --- RIGHT SECTION: SEARCH & ACTIONS --- */}
          <div className="flex items-center gap-3">
            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearch}
              className="relative hidden md:block group w-full max-w-[280px]"
            >
              <div className="relative flex items-center">
                <Search className="absolute left-3 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search music, artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-10 h-10 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-muted-foreground/70"
                />
                {/* Visual Shortcut Hint */}
                <div className="absolute right-3 hidden lg:flex items-center gap-0.5 text-[10px] font-bold text-muted-foreground/50 border border-border/50 px-1.5 py-0.5 rounded bg-background">
                  <Command className="size-3" /> K
                </div>
              </div>
            </form>

            <div className="h-6 w-px bg-border/60 hidden sm:block mx-1" />

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ModeToggle />
            </div>

            {/* Auth Actions */}
            {user ? (
              <UserDropdown user={user} navigate={navigate} />
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="font-semibold text-muted-foreground hover:text-foreground whitespace-nowrap"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform whitespace-nowrap"
                >
                  <Sparkles className="size-4 mr-2 fill-current" />
                  Sign up
                </Button>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground -mr-2 hover:bg-transparent active:scale-95"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                  >
                    <X className="size-7" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                  >
                    <Menu className="size-7" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* --- MOBILE NAVIGATION DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 top-[64px] z-40 bg-background/95 backdrop-blur-3xl lg:hidden flex flex-col"
          >
            <div className="flex flex-col h-full p-6 gap-6 overflow-y-auto">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-5" />
                <Input
                  placeholder="What do you want to listen to?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 h-12 rounded-2xl bg-muted/50 border-transparent text-lg focus:border-primary focus:bg-background"
                  autoFocus
                />
              </form>

              {/* Mobile Links Grid */}
              <div className="grid gap-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2">
                  Menu
                </p>
                {navItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
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
                          "flex items-center gap-4 px-4 py-4 rounded-xl transition-all text-lg font-medium",
                          isActive
                            ? "bg-primary/10 text-primary font-bold shadow-sm border border-primary/20"
                            : "text-foreground/80 hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "size-6",
                            isActive ? "fill-primary/20" : ""
                          )}
                        />
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}

                {user?.role === "admin" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-4 py-4 rounded-xl text-lg font-medium text-foreground/80 hover:bg-muted hover:text-foreground mt-2 border-t border-border/50"
                    >
                      <LayoutDashboard className="size-6" />
                      Admin Dashboard
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Mobile Auth & Footer */}
              {!user && (
                <div className="mt-auto pt-6 border-t border-border/50 space-y-4">
                  <Button
                    className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/25"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/register");
                    }}
                  >
                    Sign up free
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl text-lg font-semibold bg-transparent border-2 hover:bg-accent"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    <LogIn className="mr-2 size-5" /> Log in
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
