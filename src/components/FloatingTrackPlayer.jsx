import React from "react";
import Icon from "./Icon";
import { useSoundCloudPlayer } from "./SoundCloudPlayerProvider";

const FloatingTrackPlayer = () => {
  const {
    currentTrack,
    currentTime,
    isPlaying,
    previous,
    next,
    toggle,
    seekTo,
  } = useSoundCloudPlayer();

  if (!currentTrack) {
    return null;
  }

  const duration = currentTrack.duration ?? 0;
  const artwork =
    currentTrack.artwork_url || currentTrack.user?.avatar_url || "";

  return (
    <aside className="floating-player" aria-label="SoundCloud player">
      {artwork ? (
        <img src={artwork} alt="" className="floating-player__cover" />
      ) : (
        <div className="floating-player__cover" />
      )}

      <div className="floating-player__main">
        <a
          href={currentTrack.permalink_url}
          target="_blank"
          rel="noreferrer"
          className="floating-player__title"
        >
          {currentTrack.title}
        </a>
        <input
          type="range"
          min="0"
          max={duration}
          step="100"
          value={Math.min(currentTime, duration)}
          aria-label="Track progress"
          onChange={({ target }) => seekTo(Number(target.value))}
        />
      </div>

      <div className="floating-player__controls">
        <button
          type="button"
          onClick={previous}
          aria-label="Previous SoundCloud track"
        >
          ‹
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
          onClick={next}
          aria-label="Next SoundCloud track"
        >
          ›
        </button>
      </div>
    </aside>
  );
};

export default FloatingTrackPlayer;
