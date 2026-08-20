import React from "react";
import Icon from "./Icon";
import { useSoundCloudPlayer } from "./SoundCloudPlayerProvider";
import { useSharePlaylist } from "../hooks/useSharePlaylist";
import { handleImageError, PLACEHOLDER_IMAGE } from "../utils/common";

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const FloatingTrackPlayer = () => {
  const {
    currentTrack,
    currentTime,
    isPlaying,
    previous,
    next,
    toggle,
    seekTo,
    currentIndex,
  } = useSoundCloudPlayer();

  const { hasTrack, addTrack, removeTrack } = useSharePlaylist();

  if (!currentTrack) {
    return null;
  }

  const duration = currentTrack.duration ?? 0;
  const artwork =
    currentTrack.artwork_url || currentTrack.user?.avatar_url || "";

  return (
    <aside className="floating-player" aria-label="SoundCloud player">
      <img 
        src={artwork || PLACEHOLDER_IMAGE} 
        alt="" 
        className="floating-player__cover" 
        onError={handleImageError}
      />

      <div className="floating-player__main">
        <a
          href={currentTrack.permalink_url}
          target="_blank"
          rel="noreferrer"
          className="floating-player__title"
        >
          {currentTrack.title}
        </a>
        <div className="floating-player__timeline">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            step="100"
            value={Math.min(currentTime, duration)}
            aria-label="Track progress"
            onChange={({ target }) => seekTo(Number(target.value))}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="floating-player__controls">
        <button
          type="button"
          className="floating-player__skip floating-player__skip--previous"
          onClick={previous}
          aria-label="Previous SoundCloud track"
        >
          <Icon name="arrow-right" />
        </button>
        <button
          type="button"
          className="floating-player__toggle"
          onClick={toggle}
          aria-label={isPlaying ? "Pause track" : "Play track"}
        >
          <Icon name={isPlaying ? "pause" : "play"} />
        </button>
        <button
          type="button"
          className="floating-player__skip"
          onClick={next}
          aria-label="Next SoundCloud track"
        >
          <Icon name="arrow-right" />
        </button>
        <button
          type="button"
          className={`floating-player__add-btn ${hasTrack(currentIndex) ? 'added' : ''}`}
          onClick={() => (hasTrack(currentIndex) ? removeTrack(currentIndex) : addTrack(currentIndex))}
          aria-label={hasTrack(currentIndex) ? "Remove from playlist" : "Add to playlist"}
          style={{ fontSize: "18px", lineHeight: 0, padding: 0 }}
        >
          {hasTrack(currentIndex) ? "✓" : "+"}
        </button>
      </div>
    </aside>
  );
};

export default FloatingTrackPlayer;
