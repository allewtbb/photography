import { X } from "lucide-react";
import { useEffect } from "react";

type Photo = {
  id: string;
  src: string;
  alt: string;
};

type ImageModalProps = {
  photo: Photo | null;
  onClose: () => void;
};

export function ImageModal({ photo, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (photo) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
      data-testid="modal-image"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover-elevate active-elevate-2 p-2 rounded-md"
        data-testid="button-close-modal"
      >
        <X className="w-6 h-6" />
      </button>

      <img
        src={photo.src}
        alt={photo.alt}
        className="max-w-full max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
