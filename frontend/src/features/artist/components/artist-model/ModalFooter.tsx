import React from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalFooterProps {
  onClose: () => void;
  isPending: boolean;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ onClose, isPending }) => (
  <div className="px-6 py-4 flex justify-end gap-3">
    <Button
      variant="ghost"
      type="button"
      onClick={onClose}
      disabled={isPending}
      className="font-semibold text-muted-foreground hover:text-foreground h-10 px-6 rounded-md"
    >
      Hủy bỏ
    </Button>
    <Button
      type="submit"
      form="artist-form"
      disabled={isPending}
      className="h-10 px-8 rounded-md font-bold text-sm shadow-sm transition-all"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin mr-2" />
      ) : (
        <Save className="size-4 mr-2" />
      )}
      {isPending ? "Đang xử lý..." : "Lưu nghệ sĩ"}
    </Button>
  </div>
);

export default ModalFooter;
