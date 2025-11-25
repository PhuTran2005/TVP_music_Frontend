import { useState } from "react";
import { Search, Menu, User, X, Home, Music, Users, Disc3, ListMusic, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Browse", icon: Music, path: "/browse" },
    { label: "Artists", icon: Users, path: "/artists" },
    { label: "Albums", icon: Disc3, path: "/albums" },
    { label: "Playlists", icon: ListMusic, path: "/playlists" },
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
                      location.pathname === item.path ? 'text-primary' : ''
                    }`}
                  >
                    {item.label}
                    <motion.div
                      className="absolute -bottom-1 left-0 h-0.5 bg-primary"
                      initial={{ width: location.pathname === item.path ? "100%" : 0 }}
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
              className="relative hidden sm:block"
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
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.div>
            </Button>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="relative overflow-hidden">
                  <User className="h-5 w-5" />
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
              <Link to="/settings">
                <Button variant="ghost" size="sm" className="relative overflow-hidden">
                  <Settings className="h-5 w-5" />
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Button>
              </Link>
            </motion.div>

            <Link to="/search">
              <Button 
                variant="ghost" 
                size="sm" 
                className="sm:hidden"
              >
                <Search className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/95 backdrop-blur-md border-b border-border/50 sticky top-16 z-40"
          >
            <div className="container px-4 py-4">
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
                        className={`flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors ${
                          location.pathname === item.path ? 'bg-primary/10 text-primary' : ''
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}