import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  MEDIA_PLAY_EVENT,
  notifyAudioPause,
  notifyAudioPlayback,
} from "../utils/common";
import { decodePlaylist } from "../hooks/useSharePlaylist";

const WIDGET_API_URL = "https://w.soundcloud.com/player/api.js";
const PLAYER_URL =
  "https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Fusers%2F48084634%3Flimit%3D500&auto_play=false&hide_related=true&show_comments=false&show_reposts=false";

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
  const pausedForMediaRef = useRef(false);
  const [sounds, setSounds] = useState([]);
  const [unavailableIndexes, setUnavailableIndexes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackError, setPlaybackError] = useState(null);

  const isSkippingRef = useRef(false);

  const currentContextIdsRef = useRef(null);

  const getPlayableIndex = (index, direction = 1, contextIds = currentContextIdsRef.current, isSkip = false) => {
    const nextSounds = soundsRef.current;
    
    // If we are skipping, we want to look at the NEXT track (offset = 1)
    // If we are selecting a specific track, we want to look at THAT track (offset = 0)
    const startOffset = isSkip ? 1 : 0;
    
    // If we have a specific context (like a custom playlist), cycle through those IDs
    if (contextIds && contextIds.length > 0) {
      // Find where we are in the context list (if we are in it)
      let posIndex = contextIds.indexOf(index);
      
      // If the current track isn't in the context list, default to the first track in context
      if (posIndex === -1) {
        posIndex = direction === 1 ? -1 : 0; // offset will fix this to 0 or length-1
      }

      for (let offset = startOffset; offset <= contextIds.length; offset += 1) {
        const candidatePos =
          (posIndex + offset * direction + contextIds.length) %
          contextIds.length;
        const candidateId = contextIds[candidatePos];
        const sound = nextSounds[candidateId];

        if (
          sound?.streamable !== false &&
          sound?.policy !== "BLOCK" &&
          !unavailableIndexesRef.current.has(candidateId)
        ) {
          return candidateId;
        }
      }
      return null;
    }

    // Otherwise, fallback to the global list
    for (let offset = startOffset; offset < nextSounds.length; offset += 1) {
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

  const selectTrack = (index, direction = 1, contextIds = currentContextIdsRef.current, isSkip = false) => {
    if (!soundsRef.current.length || !widgetRef.current) {
      return;
    }

    // If they clicked a track explicitly (not skipping), update the context
    if (contextIds) {
      currentContextIdsRef.current = contextIds;
    }

    const nextIndex = getPlayableIndex(index, direction, contextIds, isSkip);

    if (nextIndex === null) {
      return;
    }

    const track = soundsRef.current[nextIndex];
    
    // Optimistically update our UI state
    currentIndexRef.current = nextIndex;
    currentTimeRef.current = 0;
    setCurrentIndex(nextIndex);
    setCurrentTrack(track);
    setCurrentTime(0);
    
    isSkippingRef.current = true;
    
    // Try skipping (fastest if track is already loaded in widget's internal DOM)
    widgetRef.current.skip(nextIndex);
    widgetRef.current.play();

    // Verify if skip actually worked (SC widget ignores skip if track is too far ahead)
    setTimeout(() => {
      if (widgetRef.current) {
        widgetRef.current.getCurrentSoundIndex((actualIndex) => {
          // If the widget didn't change to our requested index, force load it
          if (actualIndex !== currentIndexRef.current) {
            widgetRef.current.load(track.permalink_url || track.uri, { auto_play: true });
          }
          
          // Reset the skipping flag after a short delay to allow load/play events to settle
          setTimeout(() => {
            isSkippingRef.current = false;
          }, 500);
        });
      }
    }, 300);
  };

  useEffect(() => {
    let script;
    let widget;
    const refreshTimers = [];

    const updateCurrentTrack = () => {
      if (isSkippingRef.current) {
        return;
      }
      widget?.getCurrentSound((sound) => {
        if (sound) {
          setCurrentTrack(sound);
        }
      });
      widget?.getCurrentSoundIndex((index) => {
        // If we used widget.load(), the internal playlist has 1 track (index 0).
        // We shouldn't overwrite our actual currentIndex with 0 in this case.
        if (index === 0 && currentIndexRef.current !== 0) {
          return;
        }
        currentIndexRef.current = index;
        setCurrentIndex(index);
      });
    };

    let initialized = false;

    const initPlayer = (currentSounds, force = false) => {
      if (initialized) return;

      const playableIndexes = currentSounds.reduce((indexes, sound, index) => {
        if (sound.streamable !== false && sound.policy !== "BLOCK") {
          indexes.push(index);
        }
        return indexes;
      }, []);

      const sharedPlaylistIds = decodePlaylist(window.location.hash);
      
      if (sharedPlaylistIds.length > 0) {
        const targetId = sharedPlaylistIds[0];
        // If the target track hasn't loaded yet, wait for subsequent getSounds calls (unless forced)
        if (!force && targetId >= currentSounds.length) {
          return;
        }
      }

      initialized = true;
      let defaultIndex;

      if (sharedPlaylistIds.length > 0 && playableIndexes.includes(sharedPlaylistIds[0])) {
        defaultIndex = sharedPlaylistIds[0];
      } else {
        defaultIndex =
          playableIndexes[
            Math.floor(Math.random() * playableIndexes.length)
          ] ?? 0;
      }

      currentIndexRef.current = defaultIndex;
      currentTimeRef.current = 0;
      setCurrentIndex(defaultIndex);
      setCurrentTrack(currentSounds[defaultIndex]);
      setCurrentTime(0);
      widgetRef.current?.skip(defaultIndex);
    };

    const handleReady = () => {
      widget.getSounds((nextSounds) => {
        if (!nextSounds?.length || (soundsRef.current.length > 0 && nextSounds.length < soundsRef.current.length)) {
          return;
        }

        soundsRef.current = nextSounds;
        setSounds(nextSounds);
        initPlayer(nextSounds, false);

        let unchangedCount = 0;
        const pollTracks = () => {
          refreshTimers.push(
            window.setTimeout(() => {
              widget.getSounds((refreshedSounds) => {
                const currentLength = soundsRef.current.length;
                if (refreshedSounds?.length > currentLength) {
                  soundsRef.current = refreshedSounds;
                  setSounds(refreshedSounds);
                  initPlayer(refreshedSounds, false);
                  unchangedCount = 0; // reset counter since it grew
                  pollTracks(); // keep polling
                } else {
                  unchangedCount++;
                  if (unchangedCount < 5) {
                    // Try a few more times to be sure it's fully loaded
                    pollTracks();
                  } else {
                    // Force initialization if it hasn't happened yet
                    initPlayer(soundsRef.current, true);
                  }
                }
              });
            }, 1000)
          );
        };
        pollTracks();
      });
    };

    const handlePlay = () => {
      if (widgetRef.current !== widget) {
        return;
      }

      document
        .querySelectorAll("video:not([data-media-independent])")
        .forEach((video) => video.pause());
      notifyAudioPlayback();
      pausedForMediaRef.current = false;
      isPlayingRef.current = true;
      setIsPlaying(true);
      updateCurrentTrack();
    };

    const handlePause = () => {
      if (widgetRef.current === widget) {
        isPlayingRef.current = false;
        setIsPlaying(false);

        if (!pausedForMediaRef.current) {
          notifyAudioPause();
        }

        pausedForMediaRef.current = false;
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

      const nextIndex = getPlayableIndex(failedIndex, 1, currentContextIdsRef.current, true);

      if (nextIndex !== null) {
        currentIndexRef.current = nextIndex;
        currentTimeRef.current = 0;
        setCurrentIndex(nextIndex);
        setCurrentTrack(soundsRef.current[nextIndex]);
        setCurrentTime(0);
        widget.skip(nextIndex);
        if (isPlayingRef.current) {
          widget.play();
        }
      }
    };
    const handleFinish = () => {
      if (widgetRef.current !== widget) {
        return;
      }
      
      // Auto-advance to the next playable track
      const failedIndex = currentIndexRef.current;
      const nextIndex = getPlayableIndex(failedIndex, 1, currentContextIdsRef.current, true);

      if (nextIndex !== null) {
        currentIndexRef.current = nextIndex;
        currentTimeRef.current = 0;
        setCurrentIndex(nextIndex);
        setCurrentTrack(soundsRef.current[nextIndex]);
        setCurrentTime(0);
        
        const track = soundsRef.current[nextIndex];
        widget.skip(nextIndex);
        widget.play();
        
        setTimeout(() => {
          if (widgetRef.current) {
            widgetRef.current.getCurrentSoundIndex((actualIndex) => {
              if (actualIndex !== currentIndexRef.current) {
                widgetRef.current.load(track.permalink_url || track.uri, { auto_play: true });
              }
            });
          }
        }, 300);
      }
    };

    const pauseForMedia = () => {
      pausedForMediaRef.current = true;
      widgetRef.current?.pause();
    };

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
      widget.bind(window.SC.Widget.Events.FINISH, handleFinish);
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
        try {
          widget.unbind(window.SC.Widget.Events.READY);
          widget.unbind(window.SC.Widget.Events.PLAY);
          widget.unbind(window.SC.Widget.Events.PAUSE);
          widget.unbind(window.SC.Widget.Events.PLAY_PROGRESS);
          widget.unbind(window.SC.Widget.Events.ERROR);
          widget.unbind(window.SC.Widget.Events.FINISH);
        } catch (e) {
          // Ignore errors during unmount (e.g., iframe.contentWindow is null)
        }
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
    try {
      hiddenWidgetRef.current.skip(currentIndexRef.current);
      hiddenWidgetRef.current.seekTo(currentTimeRef.current);

      if (isPlayingRef.current) {
        hiddenWidgetRef.current.play();
      }
    } catch (e) {
      // Ignore errors during unmount
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
      
      // Since external tracks are always the global list (the embedded playlist), clear any custom context
      if (currentContextIdsRef.current !== null) {
        currentContextIdsRef.current = null;
      }

      setCurrentIndex(index);
      setCurrentTrack(track);
    },
    syncExternalPlaying: (playing) => {
      isPlayingRef.current = playing;
      setIsPlaying(playing);

      if (playing) {
        pausedForMediaRef.current = false;
        document
          .querySelectorAll("video:not([data-media-independent])")
          .forEach((video) => video.pause());
        notifyAudioPlayback();
      } else {
        if (!pausedForMediaRef.current) {
          notifyAudioPause();
        }

        pausedForMediaRef.current = false;
      }
    },
    syncExternalProgress: (milliseconds) => {
      currentTimeRef.current = milliseconds;
      setCurrentTime(milliseconds);
    },
    previous: () => selectTrack(currentIndexRef.current, -1, currentContextIdsRef.current, true),
    next: () => selectTrack(currentIndexRef.current, 1, currentContextIdsRef.current, true),
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
        allow="autoplay; encrypted-media"
      />
      {children}
    </SoundCloudPlayerContext.Provider>
  );
};

export default SoundCloudPlayerProvider;
