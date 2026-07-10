import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

const VideoPlayerModal = ({
  isOpen,
  onClose,
  full_url,
  title,
  description,
  shortcode,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-black rounded overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-1.5 transition-colors"
        >
          <FiX size={18} />
        </button>

        <div className="relative pt-[56.25%]">
          <video
            ref={videoRef}
            src={full_url}
            controls
            autoPlay
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {(title || description || shortcode) && (
          <div className="p-3 bg-gray-900">
            {title && (
              <h3 className="text-white text-sm font-medium">{title}</h3>
            )}
            {description && (
              <p className="text-gray-400 text-xs mt-1">{description}</p>
            )}
            {shortcode && (
              <code className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                {shortcode}
              </code>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayerModal;
