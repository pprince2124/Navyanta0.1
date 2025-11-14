import React, { useEffect, useState } from "react";

const GalleryModal = ({ images = [], activeIndex = 0, onClose }) => {
  const [index, setIndex] = useState(activeIndex);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "auto";
    };
  }, [images.length, onClose]);

  // Auto-slide every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextImage = () => setIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  if (!images.length) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      tabIndex={0}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl"
      >
        ✕
      </button>

      <div className="relative w-full max-w-5xl px-4">
        {/* Navigation header */}
        <div className="flex items-center justify-between mb-4 text-white">
          <button onClick={prevImage} className="text-3xl px-4">←</button>
          <span className="text-sm">
            {index + 1} / {images.length}
          </span>
          <button onClick={nextImage} className="text-3xl px-4">→</button>
        </div>

        {/* Image viewer */}
        <div className="overflow-hidden rounded-lg">
          <img
            src={images[index]}
            alt={`Gallery ${index}`}
            onClick={nextImage} // click image to advance
            className="w-full max-h-[80vh] object-contain transition duration-500 ease-in-out transform hover:scale-105 cursor-zoom-in"
          />
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;