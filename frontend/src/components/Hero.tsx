import { useState } from "react";
import { Play, Heart, Share2, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <section className="relative min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with parallax effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1709731191876-899e32264420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBsaWdodHN8ZW58MXx8fHwxNzU4NjUzNjU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Concert stage with lights"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 z-15">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container relative z-20 px-4 lg:px-6">
        <div className="max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content */}
            <motion.div
              className="space-y-6 lg:space-y-8 text-white"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-12 h-0.5 bg-gradient-to-r from-white to-transparent" />
                  <p className="text-sm uppercase tracking-wider opacity-90">
                    Featured Album
                  </p>
                </motion.div>

                <motion.h1
                  className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Midnight
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Echoes
                  </span>
                </motion.h1>

                <motion.p
                  className="text-xl lg:text-2xl opacity-90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  by <span className="font-semibold">Aurora Dreams</span>
                </motion.p>
              </div>

              <motion.p
                className="text-base lg:text-lg opacity-80 max-w-2xl leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                An ethereal journey through ambient soundscapes and electronic
                beats. Experience the perfect blend of modern production and
                timeless melodies that will transport you to another dimension.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-white/90 shadow-2xl"
                    >
                      <Play className="mr-2 h-5 w-5" fill="currentColor" />
                      Play Album
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/50 text-white hover:bg-white hover:text-black backdrop-blur-sm"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <motion.div
                        animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart
                          className={`mr-2 h-4 w-4 ${
                            isLiked ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </motion.div>
                      {isLiked ? "Liked" : "Add to Favorites"}
                    </Button>
                  </motion.div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 backdrop-blur-sm"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Album Art */}
            <motion.div
              className="hidden lg:flex justify-center"
              initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05, rotateY: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl blur-xl transform rotate-6" />
                <div className="relative bg-gradient-to-br from-gray-900 to-black p-1 rounded-2xl shadow-2xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXIlMjB2aW55bHxlbnwxfHx8fDE3NTg3NjgxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Midnight Echoes Album Cover"
                    className="w-80 h-80 object-cover rounded-xl"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
