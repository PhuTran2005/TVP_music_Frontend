import { memo } from "react";
import { motion } from "framer-motion";

interface ControlButtonProps {
  icon: React.ElementType;
  onClick?: () => void;
  isActive?: boolean;
  size?: "normal" | "large";
  ariaLabel: string;
}

export const ControlButton = memo(
  ({
    icon: Icon,
    onClick,
    isActive,
    size = "normal",
    ariaLabel,
  }: ControlButtonProps) => {
    return (
      <motion.button
        aria-label={ariaLabel}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.85 }}
        onClick={onClick}
        className={`
          flex items-center justify-center rounded-full transition-colors
          ${
            isActive
              ? "text-primary bg-primary/10"
              : "text-muted-foreground hover:bg-white/5"
          }
          ${size === "large" ? "w-14 h-14" : "w-12 h-12"}
        `}
      >
        <Icon className={size === "large" ? "h-7 w-7" : "h-6 w-6"} />
      </motion.button>
    );
  }
);
