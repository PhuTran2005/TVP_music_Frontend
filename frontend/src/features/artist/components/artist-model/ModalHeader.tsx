import React from "react";
import { Mic2, X } from "lucide-react";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => (
  <div className="shrink-0 px-6 py-4 border-b border-border flex justify-between items-center bg-card/80 backdrop-blur-md rounded-t-3xl z-20 sticky top-0">
    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
      <Mic2 className="w-5 h-5 text-primary" /> {title}
    </h3>
    <button
      onClick={onClose}
      className="p-2 hover:bg-secondary rounded-full transition-colors active:scale-95"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
);

export default ModalHeader;
