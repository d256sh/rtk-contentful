import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  MEDIA_PLAY_EVENT,
  notifyAudioPlayback,
} from "../utils/common";

const WIDGET_API_URL = "https://w.soundcloud.com/player/api.js";
const PLAYER_URL =
  "https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Fusers%2F48084634&auto_play=false&hide_related=true&show_comments=false&show_reposts=false";

const SoundCloudPlayerContext = createContext(null);

export const useSoundCloudPlayer = () =>
  useContext(SoundCloudPlayerContext);

const SoundCloudPlayerProvider = ({ children }) => {
  const iframeRef = useRef(null);
  const widgetRef = useRef(null);
  const hiddenWidgetRef = useRef(null);
  const soundsRef = useRef([]);
  const unavailableIndexesRef = useRef(new Set());
  const currentIndexRef = useRef(0);
  const currentTimeRef = useRef(0);
  const isPlayingRef = useRef(false);
  const [sounds, setSounds] = useState([]);
  const [unavailableIndexes, setUnavailableIndexes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackError, setPlaybackError] = useState(null);

  const getPlayableIndex = (index, direction = 1) => {
    const nextSounds = soundsRef.current;

    for (let offset = 0; offset < nextSounds.length; offset += 1) {
      const candidate =
        (index + offset * direction + nextSounds.length) %
        nextSounds.length;
      const sound = nextSounds[candidate];

      if (
        sound?.streamable !== false &&
        sound?.policy !== "BLOCK" &&
        !unavailableIndexesRef.current.has(candidate)
      ) {
        return candidate;
      }
    }

    return null;
  };

  const selectTrack = (index, direction = 1) => {
    if (!soundsRef.current.length || !widgetRef.current) {
      return;
    }

    const nextIndex = getPlayableIndex(index, direction);

    if (nextIndex === null) {
      return;
    }

    currentIndexRef.current = nextIndex;
    currentTimeRef.current = 0;
    setCurrentIndex(nextIndex);
    setCurrentTrack(soundsRef.current[nextIndex]);
    setCurrentTime(0);
    widgetRef.current.skip(nextIndex);
    widgetRef.current.play();
  };

  useEffect(() => {
    let script;
    let widget;
    const refreshTimers = [];

    const updateCurrentTrack = () => {
      widget?.getCurrentSound((sound) => {
        if (sound) {
          setCurrentTrack(sound);
        }
      });
      widget?.getCurrentSoundIndex((index) => {
        currentIndexRef.current = index;
        setCurrentIndex(index);
      });
    };

    const handleReady = () => {
      widget.getSounds((nextSounds) => {
        if (!nextSounds?.length) {
          return;
        }

        soundsRef.current = nextSounds;
        const playableIndexes = nextSounds.reduce((indexes, sound, index) => {
          if (sound.streamable !== false && sound.policy !== "BLOCK") {
            indexes.push(index);
          }

          return indexes;
        }, []);
        const randomIndex =
          playableIndexes[
            Math.floor(Math.random() * playableIndexes.length)
          ] ?? 0;
        currentIndexRef.current = randomIndex;
        currentTimeRef.current = 0;
        setSounds(nextSounds);
        setCurrentIndex(randomIndex);
        setCurrentTrack(nextSounds[randomIndex]);
        setCurrentTime(0);
        widgetRef.current?.skip(randomIndex);
        widgetRef.current?.play();

        [400, 1000, 2000, 4000].forEach((delay) => {
          refreshTimers.push(
            window.setTimeout(() => {
              widget.getSounds((refreshedSounds) => {
                if (refreshedSounds?.length > soundsRef.current.length) {
                  soundsRef.current = refreshedSounds;
                  setSounds(refreshedSounds);
                }
              });
            }, delay)
          );
        });
      });
    };

    const handlePlay = () => {
      if (widgetRef.current !== widget) {
        return;
      }

      document.querySelectorAll("video").forEach((video) => video.pause());
      notifyAudioPlayback();
      isPlayingRef.current = true;
      setIsPlaying(true);
      updateCurrentTrack();
    };

    const handlePause = () => {
      if (widgetRef.current === widget) {
        isPlayingRef.current = false;
        setIsPlaying(false);
      }
    };
    const handleProgress = ({ currentPosition }) => {
      if (widgetRef.current !== widget) {
        return;
      }

      currentTimeRef.current = currentPosition;
      setCurrentTime(currentPosition);
    };
    const handleError = () => {
      if (widgetRef.current !== widget) {
        return;
      }

      const failedIndex = currentIndexRef.current;
      const failedTrack = soundsRef.current[failedIndex];
      unavailableIndexesRef.current.add(failedIndex);
      setUnavailableIndexes(Array.from(unavailableIndexesRef.current));
      setPlaybackError({
        index: failedIndex,
        track: failedTrack,
      });

      const nextIndex = getPlayableIndex(failedIndex + 1);

      if (nextIndex !== null) {
        currentIndexRef.current = nextIndex;
        currentTimeRef.current = 0;
        setCurrentIndex(nextIndex);
        setCurrentTrack(soundsRef.current[nextIndex]);
        setCurrentTime(0);
        widget.skip(nextIndex);
        widget.play();
      }
    };
    const pauseForMedia = () => widgetRef.current?.pause();

    const connectWidget = () => {
      if (!window.SC?.Widget || !iframeRef.current) {
        return;
      }

      widget = window.SC.Widget(iframeRef.current);
      hiddenWidgetRef.current = widget;
      widgetRef.current = widget;
      widget.bind(window.SC.Widget.Events.READY, handleReady);
      widget.bind(window.SC.Widget.Events.PLAY, handlePlay);
      widget.bind(window.SC.Widget.Events.PAUSE, handlePause);
      widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, handleProgress);
      widget.bind(window.SC.Widget.Events.ERROR, handleError);
      window.addEventListener(MEDIA_PLAY_EVENT, pauseForMedia);
    };

    script = document.querySelector(`script[src="${WIDGET_API_URL}"]`);

    if (window.SC?.Widget) {
      connectWidget();
    } else if (script) {
      script.addEventListener("load", connectWidget);
    } else {
      script = document.createElement("script");
      script.src = WIDGET_API_URL;
      script.async = true;
      script.addEventListener("load", connectWidget);
      document.body.appendChild(script);
    }

    return () => {
      script?.removeEventListener("load", connectWidget);
      window.removeEventListener(MEDIA_PLAY_EVENT, pauseForMedia);
      refreshTimers.forEach(window.clearTimeout);

      if (widget && window.SC?.Widget) {
        widget.unbind(window.SC.Widget.Events.READY);
        widget.unbind(window.SC.Widget.Events.PLAY);
        widget.unbind(window.SC.Widget.Events.PAUSE);
        widget.unbind(window.SC.Widget.Events.PLAY_PROGRESS);
        widget.unbind(window.SC.Widget.Events.ERROR);
      }
    };
  }, []);

  const activateExternalWidget = (externalWidget) => {
    widgetRef.current = externalWidget;
    hiddenWidgetRef.current?.pause();
    externalWidget.skip(currentIndexRef.current);
    externalWidget.seekTo(currentTimeRef.current);

    if (isPlayingRef.current) {
      externalWidget.play();
    }
  };

  const deactivateExternalWidget = (externalWidget) => {
    if (widgetRef.current !== externalWidget || !hiddenWidgetRef.current) {
      return;
    }

    widgetRef.current = hiddenWidgetRef.current;
    hiddenWidgetRef.current.skip(currentIndexRef.current);
    hiddenWidgetRef.current.seekTo(currentTimeRef.current);

    if (isPlayingRef.current) {
      hiddenWidgetRef.current.play();
    }
  };

  const value = {
    sounds,
    unavailableIndexes,
    currentTrack,
    currentIndex,
    currentTime,
    isPlaying,
    playbackError,
    selectTrack,
    activateExternalWidget,
    deactivateExternalWidget,
    syncExternalTrack: (track, index) => {
      if (currentIndexRef.current !== index) {
        currentTimeRef.current = 0;
        setCurrentTime(0);
      }
      currentIndexRef.current = index;
      setCurrentIndex(index);
      setCurrentTrack(track);
    },
    syncExternalPlaying: (playing) => {
      isPlayingRef.current = playing;
      setIsPlaying(playing);

      if (playing) {
        document.querySelectorAll("video").forEach((video) => video.pause());
        notifyAudioPlayback();
      }
    },
    syncExternalProgress: (milliseconds) => {
      currentTimeRef.current = milliseconds;
      setCurrentTime(milliseconds);
    },
    previous: () => selectTrack(currentIndexRef.current - 1, -1),
    next: () => selectTrack(currentIndexRef.current + 1),
    refreshSounds: () =>
      widgetRef.current?.getSounds((nextSounds) => {
        if (nextSounds?.length > soundsRef.current.length) {
          soundsRef.current = nextSounds;
          setSounds(nextSounds);
        }
      }),
    toggle: () =>
      isPlaying ? widgetRef.current?.pause() : widgetRef.current?.play(),
    pause: () => widgetRef.current?.pause(),
    clearPlaybackError: () => setPlaybackError(null),
    seekTo: (milliseconds) => {
      widgetRef.current?.seekTo(milliseconds);
      currentTimeRef.current = milliseconds;
      setCurrentTime(milliseconds);
    },
  };

  return (
    <SoundCloudPlayerContext.Provider value={value}>
      <iframe
        ref={iframeRef}
        className="floating-player__engine"
        title="SoundCloud playback engine"
        src={PLAYER_URL}
        allow="autoplay"
      />
      {children}
    </SoundCloudPlayerContext.Provider>
  );
};

export default SoundCloudPlayerProvider;
