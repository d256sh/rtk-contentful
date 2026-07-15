import React, { useEffect, useRef, useState } from "react";
import Section from "./Section/Section";
import Title from "./Title";
import Loader from "./Loader";
import Icon from "./Icon";
import { useSoundCloudPlayer } from "./SoundCloudPlayerProvider";
import {
  AUDIO_PLAY_EVENT,
  notifyMediaPlayback,
} from "../utils/common";

const EMBED_PLAY_EVENT = "app:soundcloud-embed-play";
const WIDGET_API_URL = "https://w.soundcloud.com/player/api.js";

const SoundCloudEmbeddedPlayer = ({
  url,
  title,
  height = 166,
  synchronized = false,
}) => {
  const iframeRef = useRef(null);
  const playerIdRef = useRef(Symbol("soundcloud-player"));
  const playerContext = useSoundCloudPlayer();
  const playerContextRef = useRef(playerContext);
  playerContextRef.current = playerContext;

  useEffect(() => {
    let script;
    let widget;
    let readyTimer;
    let eventsBound = false;

    const handlePlay = () => {
      if (synchronized) {
        widget.getCurrentSound((track) => {
          widget.getCurrentSoundIndex((index) => {
            playerContextRef.current.syncExternalTrack(track, index);
          });
        });
        playerContextRef.current.syncExternalPlaying(true);
      } else {
        notifyMediaPlayback();
      }

      window.dispatchEvent(
        new CustomEvent(EMBED_PLAY_EVENT, {
          detail: playerIdRef.current,
        })
      );
    };
    const handlePause = () => {
      if (synchronized) {
        playerContextRef.current.syncExternalPlaying(false);
      }
    };
    const handleProgress = ({ currentPosition }) => {
      if (synchronized) {
        playerContextRef.current.syncExternalProgress(currentPosition);
      }
    };
    const pauseForCustomPlayer = () => widget.pause();
    const pauseForOtherEmbed = ({ detail }) => {
      if (detail !== playerIdRef.current) {
        widget.pause();
      }
    };

    const bindPlaybackEvents = () => {
      if (!widget || eventsBound) {
        return;
      }

      eventsBound = true;
      widget.bind(window.SC.Widget.Events.PLAY, handlePlay);
      widget.bind(window.SC.Widget.Events.PAUSE, handlePause);
      widget.bind(window.SC.Widget.Events.PLAY_PROGRESS, handleProgress);
      if (!synchronized) {
        window.addEventListener(AUDIO_PLAY_EVENT, pauseForCustomPlayer);
      }
      window.addEventListener(EMBED_PLAY_EVENT, pauseForOtherEmbed);

      if (synchronized) {
        playerContextRef.current.activateExternalWidget(widget);
        widget.getCurrentSound((track) => {
          widget.getCurrentSoundIndex((index) => {
            playerContextRef.current.syncExternalTrack(track, index);
          });
        });
        widget.getPosition((position) => {
          playerContextRef.current.syncExternalProgress(position);
        });
        widget.isPaused((paused) => {
          playerContextRef.current.syncExternalPlaying(!paused);
        });
      }
    };

    const handleReady = () => bindPlaybackEvents();

    const connectWidget = () => {
      if (!window.SC?.Widget || !iframeRef.current || widget) {
        return;
      }

      widget = window.SC.Widget(iframeRef.current);
      widget.bind(window.SC.Widget.Events.READY, handleReady);
      widget.getSounds(() => bindPlaybackEvents());
      readyTimer = window.setTimeout(() => {
        widget.getSounds(() => bindPlaybackEvents());
      }, 750);
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
      window.clearTimeout(readyTimer);

      if (synchronized && widget && eventsBound) {
        playerContextRef.current.deactivateExternalWidget(widget);
      }

      widget?.unbind(window.SC.Widget.Events.READY);
      widget?.unbind(window.SC.Widget.Events.PLAY);
      widget?.unbind(window.SC.Widget.Events.PAUSE);
      widget?.unbind(window.SC.Widget.Events.PLAY_PROGRESS);
      window.removeEventListener(AUDIO_PLAY_EVENT, pauseForCustomPlayer);
      window.removeEventListener(EMBED_PLAY_EVENT, pauseForOtherEmbed);
    };
  }, [synchronized]);

  const playerUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(
    url
  )}&color=%23ffa600&auto_play=false&show_artwork=true&hide_related=true&show_comments=false&show_reposts=false&show_teaser=false&visual=${height > 200}`;

  return (
    <iframe
      ref={iframeRef}
      title={title}
      width="100%"
      height={height}
      scrolling="no"
      frameBorder="0"
      allow="autoplay; encrypted-media"
      src={playerUrl}
    />
  );
};

const SoundCloudTracks = () => {
  const {
    sounds,
    unavailableIndexes,
    currentIndex,
    isPlaying,
    selectTrack,
    toggle,
    refreshSounds,
    playbackError,
    pause,
    clearPlaybackError,
  } = useSoundCloudPlayer();
  const [visibleCount, setVisibleCount] = useState(10);
  const [showFallbackPlayer, setShowFallbackPlayer] = useState(false);
  const availableTracks = sounds
    .map((track, index) => ({ track, index }))
    .filter(
      ({ track, index }) =>
        track.streamable !== false &&
        track.policy !== "BLOCK" &&
        !unavailableIndexes.includes(index)
    );
  const visibleTracks = availableTracks.slice(0, visibleCount);

  return (
    <Section className="soundcloud-tracks-section" disableParallax>
      <div className="container">
        <Title text="SoundCloud Tracks" />

        {!sounds.length ? (
          <Loader />
        ) : (
          <ul
            className="soundcloud-tracks"
            onScroll={({ currentTarget }) => {
              const distanceToBottom =
                currentTarget.scrollHeight -
                currentTarget.scrollTop -
                currentTarget.clientHeight;

              if (distanceToBottom < 80) {
                setVisibleCount((count) =>
                  Math.min(count + 10, availableTracks.length)
                );
                refreshSounds();
              }
            }}
          >
            {visibleTracks.map(({ track, index }) => {
              const isCurrent = index === currentIndex;
              const artwork =
                track.artwork_url || track.user?.avatar_url || "";

              return (
                <li
                  key={track.id}
                  className={isCurrent ? "active" : undefined}
                >
                  <button
                    type="button"
                    onClick={() =>
                      isCurrent ? toggle() : selectTrack(index)
                    }
                  >
                    <span className="soundcloud-tracks__number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {artwork && (
                      <img
                        src={artwork}
                        alt=""
                        className="soundcloud-tracks__cover"
                      />
                    )}

                    <span className="soundcloud-tracks__title">
                      {track.title}
                    </span>

                    <span className="soundcloud-tracks__action">
                      <Icon
                        name={isCurrent && isPlaying ? "pause" : "play"}
                      />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {playbackError?.track && (
          <div className="soundcloud-error" role="alert">
            <div>
              <strong>Track playback failed</strong>
              <p>
                “{playbackError.track.title}” could not be played in the
                custom player.
              </p>
            </div>

            <div className="soundcloud-error__actions">
              <button
                type="button"
                onClick={() => {
                  pause();
                  setShowFallbackPlayer((visible) => !visible);
                }}
              >
                {showFallbackPlayer
                  ? "Hide SoundCloud player"
                  : "Listen in SoundCloud player"}
              </button>
              <button
                type="button"
                className="soundcloud-error__dismiss"
                onClick={() => {
                  setShowFallbackPlayer(false);
                  clearPlaybackError();
                }}
                aria-label="Dismiss playback error"
              >
                ×
              </button>
            </div>

            {showFallbackPlayer && (
              <div className="soundcloud-error__player">
                <SoundCloudEmbeddedPlayer
                  key={playbackError.track.id}
                  url={
                    playbackError.track.permalink_url ||
                    "https://soundcloud.com/jahseh-onfroy"
                  }
                  title={`Listen to ${playbackError.track.title} on SoundCloud`}
                />
              </div>
            )}
          </div>
        )}

        <div className="soundcloud-original">
          <h3>Original SoundCloud Playlist</h3>
          <SoundCloudEmbeddedPlayer
            url="https://soundcloud.com/jahseh-onfroy"
            title="XXXTENTACION original SoundCloud playlist"
            height={450}
            synchronized
          />
        </div>
      </div>
    </Section>
  );
};

export default SoundCloudTracks;
