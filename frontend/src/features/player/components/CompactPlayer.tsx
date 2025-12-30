import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompactPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function CompactPlayer({ isPlaying, onToggle }: CompactPlayerProps) {
  return (
    <motion.div
      layout
      className="fixed bottom-0 inset-x-0 h-[80px] bg-background/80 backdrop-blur-xl border-t"
    >
      <div className="h-full flex items-center justify-center">
        <Button
          aria-label="Play / Pause"
          onClick={onToggle}
          className="rounded-full"
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>
      </div>
    </motion.div>
  );
}
