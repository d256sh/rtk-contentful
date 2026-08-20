import React, { useRef, useState } from "react";
import Icon from "../Icon";
import { useSoundCloudPlayer } from "../SoundCloudPlayerProvider";
import { handleImageError, PLACEHOLDER_IMAGE } from "../../utils/common";

const CustomPlaylist = ({ selectedIds, sounds, onRemove, onMove, onClear }) => {
  const { currentIndex, isPlaying, selectTrack, toggle } = useSoundCloudPlayer();
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragNodeRef = useRef(null);

  const tracks = selectedIds
    .map((soundIndex) => ({
      soundIndex,
      track: sounds[soundIndex],
    }))
    .filter(({ track }) => !!track);

  const handleDragStart = (e, posIndex) => {
    setDragIndex(posIndex);
    dragNodeRef.current = e.currentTarget;
    e.currentTarget.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(posIndex));
  };

  const handleDragOver = (e, posIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(posIndex);
  };

  const handleDrop = (e, toPos) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== toPos) {
      onMove(dragIndex, toPos);
    }
    cleanup();
  };

  const handleDragEnd = () => {
    if (dragNodeRef.current) {
      dragNodeRef.current.classList.remove("dragging");
    }
    cleanup();
  };

  const cleanup = () => {
    setDragIndex(null);
    setDragOverIndex(null);
    dragNodeRef.current = null;
  };

  if (!tracks.length) {
    return (
      <div className="share-playlist share-playlist--empty">
        <div className="share-playlist__empty-state">
          <div className="share-playlist__empty-icon">🎵</div>
          <h3>Your playlist is empty</h3>
          <p>Add tracks from the list to create your custom playlist and share it with friends!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="share-playlist">
      <div className="share-playlist__header">
        <h2 className="share-playlist__title">Your Playlist</h2>
        <div className="share-playlist__meta">
          <span className="share-playlist__count">{tracks.length} track{tracks.length !== 1 ? "s" : ""}</span>
          <button
            type="button"
            className="share-playlist__clear"
            onClick={onClear}
          >
            Clear All
          </button>
        </div>
      </div>

      <ul className="share-playlist__list">
        {tracks.map(({ soundIndex, track }, posIndex) => {
          const artwork = track.artwork_url || track.user?.avatar_url || "";
          const isCurrent = soundIndex === currentIndex;
          const isDragOver = dragOverIndex === posIndex && dragIndex !== posIndex;

          return (
            <li
              key={`${soundIndex}-${posIndex}`}
              className={`share-playlist__item${isDragOver ? " drag-over" : ""}${isCurrent && isPlaying ? " playing" : ""}`}
              draggable
              onDragStart={(e) => handleDragStart(e, posIndex)}
              onDragOver={(e) => handleDragOver(e, posIndex)}
              onDrop={(e) => handleDrop(e, posIndex)}
              onDragEnd={handleDragEnd}
            >
              <span className="share-playlist__grip" aria-hidden="true">⠿</span>

              <span className="share-playlist__number">
                {String(posIndex + 1).padStart(2, "0")}
              </span>

              <button
                type="button"
                className="share-playlist__play"
                onClick={() => (isCurrent ? toggle() : selectTrack(soundIndex, 1, selectedIds))}
                aria-label={isCurrent && isPlaying ? "Pause" : "Play"}
              >
                <img 
                  src={artwork || PLACEHOLDER_IMAGE} 
                  alt="" 
                  className="share-playlist__cover" 
                  onError={handleImageError}
                />
                <span className="share-playlist__play-icon">
                  <Icon name={isCurrent && isPlaying ? "pause" : "play"} />
                </span>
              </button>

              <span className="share-playlist__name">{track.title}</span>

              <button
                type="button"
                className="share-playlist__remove"
                onClick={() => onRemove(soundIndex)}
                aria-label={`Remove ${track.title}`}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CustomPlaylist;
