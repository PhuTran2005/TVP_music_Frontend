import React from "react";
import { Loader2 } from "lucide-react";

interface ModalFooterProps {
  onClose: () => void;
  isPending: boolean;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ onClose, isPending }) => (
  <div className="shrink-0 p-5 border-t border-border bg-card flex justify-end gap-3 sm:rounded-b-3xl z-20 sticky bottom-0">
    <button
      type="button"
      onClick={onClose}
      disabled={isPending}
      className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-xl transition-colors disabled:opacity-50"
    >
      Hủy bỏ
    </button>
    <button
      type="submit"
      form="artist-form"
      disabled={isPending}
      className="px-6 py-2.5 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-70 active:scale-95"
    >
      {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
      {isPending ? "Đang xử lý..." : "Lưu thay đổi"}
    </button>
  </div>
);

export default ModalFooter;
