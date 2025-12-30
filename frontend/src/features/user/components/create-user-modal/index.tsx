// src/features/user/components/CreateUserModal.tsx
import React from "react";
import { createPortal } from "react-dom";
import { X, UserPlus, CheckCircle2 } from "lucide-react";

// UI Sub-components
import UserForm from "./UserForm";
import SuccessView from "./SuccessView";
import { useCreateUserModalLogic } from "@/features/user/hooks/useCreateUserModalLogic";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = (props) => {
  const { isOpen, onClose } = props;

  // 🔥 Gọi hook để lấy logic
  const { form, step, generatedUser, isPending, onSubmit } =
    useCreateUserModalLogic(props);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 overflow-hidden max-h-[90vh]">
        {/* HEADER */}
        <div className="shrink-0 px-6 py-5 border-b border-border/60 flex justify-between items-start bg-muted/20">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2.5">
              {step === "form" ? (
                <>
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <UserPlus className="w-5 h-5 text-primary" />
                  </div>
                  Tạo người dùng
                </>
              ) : (
                <>
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  Thành công!
                </>
              )}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 ml-1">
              {step === "form"
                ? "Điền thông tin để cấp quyền truy cập mới."
                : "Tài khoản đã được khởi tạo trên hệ thống."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {step === "form" ? (
            <UserForm
              form={form}
              onSubmit={onSubmit}
              isPending={isPending}
              onClose={onClose}
            />
          ) : (
            <SuccessView
              email={generatedUser?.email || ""}
              password={generatedUser?.password || ""}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateUserModal;
