import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Info } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmationModalProps) => {
  // UX: Khóa cuộn trang & Phím tắt ESC
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
      document.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay: Glass effect nhẹ */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all animate-in fade-in duration-200"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-50 w-full max-w-md scale-100 gap-4 border bg-card p-6 shadow-lg rounded-xl duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 sm:zoom-in-95"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  isDestructive
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {isDestructive ? (
                  <AlertTriangle className="size-5" />
                ) : (
                  <Info className="size-5" />
                )}
              </div>
              <h3 className="text-lg font-semibold leading-none tracking-tight text-card-foreground">
                {title}
              </h3>
            </div>
            <div className="text-sm text-muted-foreground text-pretty pl-[52px]">
              {description}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 mt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              {cancelLabel}
            </Button>
            <Button
              variant={isDestructive ? "destructive" : "default"}
              onClick={onConfirm}
              className="w-full sm:w-auto shadow-sm"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
