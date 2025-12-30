import React from "react";
import { createPortal } from "react-dom";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import ImageSection from "./ImageSection";
import InfoSection from "./InfoSection";
import SocialSection from "./SocialSection";
import SettingsSection from "./SettingsSection";
import GallerySection from "./GallerySection"; // Đảm bảo đường dẫn này đúng
import { useArtistModalLogic } from "@/features/artist/hooks/useArtistModalLogic";

const ArtistModal: React.FC<any> = (props) => {
  const { isOpen, onClose, artistToEdit } = props;
  const { form, onSubmit, isPending } = useArtistModalLogic(props);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[95vh] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* HEADER Cố định */}
        <ModalHeader
          title={artistToEdit ? "Edit Artist Profile" : "Create New Artist"}
          onClose={onClose}
        />

        {/* BODY Có thể cuộn */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <form id="artist-form" onSubmit={onSubmit} className="flex flex-col">
            {/* 1. Phần ảnh bìa và Avatar (thường full width ở đầu modal) */}
            <ImageSection form={form} initialData={artistToEdit} />

            {/* 2. Các Section nội dung có padding nội bộ */}
            <div className="px-6 md:px-10 pb-10 space-y-10">
              <InfoSection form={form} artistToEdit={artistToEdit} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <SocialSection form={form} />
                <SettingsSection form={form} />
              </div>

              {/* TÍCH HỢP GALLERY Ở ĐÂY */}
              <GallerySection form={form} />
            </div>
          </form>
        </div>

        {/* FOOTER Cố định */}
        <ModalFooter onClose={onClose} isPending={isPending} />
      </div>
    </div>,
    document.body
  );
};

export default ArtistModal;
