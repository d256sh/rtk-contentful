import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import YouTubePlayer from "./YouTubePlayer";

const VideoModal = ({ video, onClose }) => {
  useEffect(() => {
    if (!video) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = ({ key }) => {
      if (key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [video, onClose]);

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
          <button type="button" onClick={onClose} aria-label="Close video">
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
