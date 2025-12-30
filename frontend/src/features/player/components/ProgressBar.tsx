import { memo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";

interface ProgressBarProps {
  progress: number;
  onSeek: (value: number) => void;
  onScrubStart: () => void;
  onScrubEnd: (value: number) => void;
}

export const ProgressBar = memo(
  ({ progress, onSeek, onScrubStart, onScrubEnd }: ProgressBarProps) => {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 260 }}
      >
        <Slider
          aria-label="Seek track"
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={(v) => onSeek(v[0])}
          onPointerDown={onScrubStart}
          onPointerUp={() => onScrubEnd(progress)}
          className="
            py-2
            [&>.relative>.bg-primary]:shadow-[0_0_14px_currentColor]
            [&>span]:h-5 [&>span]:w-5
          "
        />
      </motion.div>
    );
  }
);
