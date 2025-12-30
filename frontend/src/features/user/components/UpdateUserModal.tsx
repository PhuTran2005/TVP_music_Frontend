import React from "react";
import { createPortal } from "react-dom";
import { X, UserCog } from "lucide-react";
import { useUpdateUserModalLogic } from "../hooks/useUpdateUserModalLogic";
import type { User } from "@/features/user/types";
import UserForm from "@/features/user/components/create-user-modal/UserForm";

interface UpdateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: User | null;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = (props) => {
  const { isOpen, onClose, userToEdit } = props;

  // Gọi Hook Logic (Đã bao gồm logic fill bio và password rỗng)
  const { form, onSubmit, isPending } = useUpdateUserModalLogic(props);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh]">
        {/* HEADER */}
        <div className="shrink-0 px-6 py-5 border-b border-border/60 flex justify-between items-start bg-muted/20">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2.5">
              <div className="p-1.5 bg-orange-500/10 rounded-lg">
                <UserCog className="w-5 h-5 text-orange-600" />
              </div>
              Cập nhật thông tin
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 ml-1">
              Chỉnh sửa hồ sơ <b>{userToEdit?.fullName}</b>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <UserForm
            // Ép kiểu as any là chấp nhận được ở đây vì logic form update và create hơi khác nhau về required password
            form={form as any}
            onSubmit={onSubmit}
            isPending={isPending}
            onClose={onClose}
            // 🔥 Quan trọng: Prop này báo cho UserForm biết đây là chế độ sửa
            isEditMode={true}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UpdateUserModal;
