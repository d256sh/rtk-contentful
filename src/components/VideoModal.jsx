import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import YouTubePlayer from "./YouTubePlayer";

const VideoModal = ({
  video,
  position,
  total,
  onPrevious,
  onNext,
  onClose,
}) => {
  useEffect(() => {
    if (!video) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = ({ key }) => {
      if (key === "Escape") {
        onClose();
      } else if (total > 1 && key === "ArrowLeft") {
        onPrevious();
      } else if (total > 1 && key === "ArrowRight") {
        onNext();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [video, total, onPrevious, onNext, onClose]);

  if (!video) {
    return null;
  }

  return createPortal(
    <div
      className="video-modal"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="video-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
      >
        <div className="video-modal__header">
          <h2 id="video-modal-title">{video.title}</h2>

          <div className="video-modal__controls">
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={onPrevious}
                  aria-label="Previous setlist video"
                >
                  ←
                </button>
                <span>
                  {position} / {total}
                </span>
                <button
                  type="button"
                  onClick={onNext}
                  aria-label="Next setlist video"
                >
                  →
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            className="video-modal__close"
            onClick={onClose}
            aria-label="Close video"
          >
            ×
          </button>
        </div>

        <YouTubePlayer
          key={video.url}
          url={video.url}
          title={`${video.title} live video`}
        />
      </div>
    </div>,
    document.body
  );
};

export default VideoModal;
