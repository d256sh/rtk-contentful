import React, { useEffect, useRef, useState } from "react";
import { useTrackItems } from "../hooks/useTrackItems";
import Icon from "./Icon";
import {
  MEDIA_PLAY_EVENT,
  notifyAudioPlayback,
} from "../utils/common";

const FloatingTrackPlayer = () => {
  const { items = [] } = useTrackItems();
  const audioRef = useRef(null);
  const initializedRef = useRef(false);
  const shouldPlayRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack =
    currentIndex === null ? null : items[currentIndex] ?? null;

  const playAudio = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    document.querySelectorAll("video").forEach((video) => video.pause());
    notifyAudioPlayback();

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const selectTrack = (index) => {
    if (!items.length) {
      return;
    }

    const nextIndex = (index + items.length) % items.length;
    shouldPlayRef.current = true;

    if (nextIndex === currentIndex) {
      audioRef.current.currentTime = 0;
      playAudio();
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  useEffect(() => {
    if (items.length && !initializedRef.current) {
      initializedRef.current = true;
      shouldPlayRef.current = true;
      setCurrentIndex(Math.floor(Math.random() * items.length));
    }
  }, [items]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrack) {
      return;
    }

    audio.load();
    setCurrentTime(0);
    setDuration(0);

    if (shouldPlayRef.current) {
      shouldPlayRef.current = false;
      playAudio();
    }
  }, [currentTrack]);

  useEffect(() => {
    const pauseForMedia = () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    };

    window.addEventListener(MEDIA_PLAY_EVENT, pauseForMedia);

    return () => {
      window.removeEventListener(MEDIA_PLAY_EVENT, pauseForMedia);
    };
  }, []);

  if (!currentTrack) {
    return null;
  }

  const { title, cover, link } = currentTrack;

  return (
    <aside className="floating-player" aria-label="Contentful track player">
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={({ currentTarget }) =>
          setCurrentTime(currentTarget.currentTime)
        }
        onLoadedMetadata={({ currentTarget }) =>
          setDuration(currentTarget.duration)
        }
        onEnded={() => selectTrack(currentIndex + 1)}
      >
        <source src={link.url} />
      </audio>

      <img src={cover.url} alt="" className="floating-player__cover" />

      <div className="floating-player__main">
        <p className="floating-player__title">{title}</p>
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(currentTime, duration || 0)}
          aria-label="Track progress"
          onChange={({ target }) => {
            const nextTime = Number(target.value);
            audioRef.current.currentTime = nextTime;
            setCurrentTime(nextTime);
          }}
        />
      </div>

      <div className="floating-player__controls">
        <button
          type="button"
          onClick={() => selectTrack(currentIndex - 1)}
          aria-label="Previous track"
        >
          ‹
        </button>
        <button
          type="button"
          className="floating-player__toggle"
          onClick={() => {
            if (audioRef.current.paused) {
              playAudio();
            } else {
              audioRef.current.pause();
            }
          }}
          aria-label={isPlaying ? "Pause track" : "Play track"}
        >
          <Icon name={isPlaying ? "pause" : "play"} />
        </button>
        <button
          type="button"
          onClick={() => selectTrack(currentIndex + 1)}
          aria-label="Next track"
        >
          ›
        </button>
      </div>
    </aside>
  );
};

export default FloatingTrackPlayer;
