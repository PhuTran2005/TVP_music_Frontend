import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, MoreHorizontal, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([35]);
  const [volume, setVolume] = useState([75]);
  const [isLiked, setIsLiked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one

  const currentTrack = {
    title: "Midnight Echoes",
    artist: "Aurora Dreams",
    album: "Digital Dreams",
    image: "https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXIlMjB2aW55bHxlbnwxfHx8fDE3NTg3NjgxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    duration: "3:24",
    currentTime: "1:12"
  };

  // Simulate progress when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newValue = prev[0] + 0.5;
          return newValue >= 100 ? [0] : [newValue];
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-t border-border/50">
        {/* Expanded View */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-b border-border/50 overflow-hidden"
            >
              <div className="container px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  {/* Album Art */}
                  <motion.div 
                    className="flex justify-center lg:justify-start"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: isPlaying ? 360 : 0 }}
                        transition={{ 
                          duration: 10, 
                          repeat: isPlaying ? Infinity : 0, 
                          ease: "linear" 
                        }}
                      >
                        <ImageWithFallback 
                          src={currentTrack.image}
                          alt={currentTrack.title}
                          className="w-32 h-32 lg:w-48 lg:h-48 rounded-2xl object-cover shadow-2xl"
                        />
                      </motion.div>
                      {isPlaying && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </motion.div>

                  {/* Track Info & Controls */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="text-center lg:text-left">
                      <motion.h2 
                        className="text-2xl lg:text-3xl font-bold mb-2"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {currentTrack.title}
                      </motion.h2>
                      <motion.p 
                        className="text-lg text-muted-foreground"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {currentTrack.artist}
                      </motion.p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <Slider
                        value={progress}
                        onValueChange={setProgress}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{currentTrack.currentTime}</span>
                        <span>{currentTrack.duration}</span>
                      </div>
                    </div>

                    {/* Enhanced Controls */}
                    <div className="flex items-center justify-center gap-4">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button 
                          variant={isShuffleOn ? "default" : "ghost"} 
                          size="sm"
                          onClick={() => setIsShuffleOn(!isShuffleOn)}
                        >
                          <Shuffle className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button variant="ghost" size="lg">
                          <SkipBack className="h-5 w-5" />
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          size="lg" 
                          className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-lg"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          <motion.div
                            key={isPlaying ? "pause" : "play"}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {isPlaying ? (
                              <Pause className="h-6 w-6" fill="currentColor" />
                            ) : (
                              <Play className="h-6 w-6" fill="currentColor" />
                            )}
                          </motion.div>
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button variant="ghost" size="lg">
                          <SkipForward className="h-5 w-5" />
                        </Button>
                      </motion.div>
                      
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button 
                          variant={repeatMode > 0 ? "default" : "ghost"} 
                          size="sm"
                          onClick={toggleRepeat}
                          className="relative"
                        >
                          <Repeat className="h-4 w-4" />
                          {repeatMode === 2 && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact Player */}
        <div className="container px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Current Track Info */}
            <motion.div 
              className="flex items-center gap-3 min-w-0 flex-1 lg:max-w-xs"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ 
                  duration: 10, 
                  repeat: isPlaying ? Infinity : 0, 
                  ease: "linear" 
                }}
              >
                <ImageWithFallback 
                  src={currentTrack.image}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded-lg object-cover shadow-lg"
                />
              </motion.div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium truncate">{currentTrack.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className="shrink-0"
                >
                  <motion.div
                    animate={{ 
                      scale: isLiked ? [1, 1.3, 1] : 1,
                      rotate: isLiked ? [0, 10, -10, 0] : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>

            {/* Player Controls */}
            <div className="hidden lg:flex flex-col items-center gap-2 flex-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant={isShuffleOn ? "default" : "ghost"} 
                    size="sm"
                    onClick={() => setIsShuffleOn(!isShuffleOn)}
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="sm">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="sm" 
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/80"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" fill="currentColor" />
                    ) : (
                      <Play className="h-4 w-4" fill="currentColor" />
                    )}
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="sm">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant={repeatMode > 0 ? "default" : "ghost"} 
                    size="sm"
                    onClick={toggleRepeat}
                    className="relative"
                  >
                    <Repeat className="h-4 w-4" />
                    {repeatMode === 2 && (
                      <motion.span 
                        className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      />
                    )}
                  </Button>
                </motion.div>
              </div>
              
              <div className="flex items-center gap-3 w-full max-w-md">
                <span className="text-xs text-muted-foreground min-w-0">
                  {currentTrack.currentTime}
                </span>
                <Slider
                  value={progress}
                  onValueChange={setProgress}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground min-w-0">
                  {currentTrack.duration}
                </span>
              </div>
            </div>

            {/* Volume & More */}
            <div className="flex items-center gap-2 flex-1 justify-end lg:max-w-xs">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </motion.div>
              <div className="hidden lg:flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}