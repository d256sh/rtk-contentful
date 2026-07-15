import React, { useState } from "react";
import Section from "./Section/Section";
import Title from "./Title";
import Loader from "./Loader";
import Icon from "./Icon";
import { useSoundCloudPlayer } from "./SoundCloudPlayerProvider";

const SoundCloudTracks = () => {
  const {
    sounds,
    unavailableIndexes,
    currentIndex,
    isPlaying,
    selectTrack,
    toggle,
    refreshSounds,
  } = useSoundCloudPlayer();
  const [visibleCount, setVisibleCount] = useState(10);
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
      </div>
    </Section>
  );
};

export default SoundCloudTracks;
