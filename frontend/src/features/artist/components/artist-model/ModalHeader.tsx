import React from "react";
import { Mic2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => (
  <div className="shrink-0 px-6 py-4 border-b border-border flex justify-between items-center bg-card z-20">
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Mic2 className="size-5" />
      </div>
      <h3 className="text-lg font-bold text-foreground leading-tight">
        {title}
      </h3>
    </div>
    <Button
      variant="ghost"
      size="icon"
      onClick={onClose}
      className="size-9 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
    >
      <X className="size-5" />
    </Button>
  </div>
);

export default ModalHeader;
