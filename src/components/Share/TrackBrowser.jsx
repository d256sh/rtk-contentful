import React, { useState, useMemo } from "react";
import Icon from "../Icon";
import { useSoundCloudPlayer } from "../SoundCloudPlayerProvider";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const TrackBrowser = ({ hasTrack, onAdd, onRemove }) => {
  const { sounds, unavailableIndexes, currentIndex, isPlaying, selectTrack, toggle } =
    useSoundCloudPlayer();
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  const availableTracks = useMemo(() => {
    return sounds
      .map((track, index) => ({ track, index }))
      .filter(
        ({ track, index }) =>
          track.streamable !== false &&
          track.policy !== "BLOCK" &&
          !unavailableIndexes.includes(index)
      );
  }, [sounds, unavailableIndexes]);

  const filtered = useMemo(() => {
    if (!search.trim()) return availableTracks;
    const q = search.toLowerCase();
    return availableTracks.filter(({ track }) =>
      track.title?.toLowerCase().includes(q)
    );
  }, [availableTracks, search]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="share-browser">
      <div className="share-browser__header">
        <h2 className="share-browser__title">All Tracks</h2>
        <span className="share-browser__count">{availableTracks.length} available</span>
      </div>

      <div className="share-browser__search">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search tracks..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(20);
          }}
          className="share-browser__input"
        />
        {search && (
          <button
            type="button"
            className="share-browser__clear"
            onClick={() => setSearch("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      <ul
        className="share-browser__list"
        onScroll={({ currentTarget }) => {
          const distanceToBottom =
            currentTarget.scrollHeight -
            currentTarget.scrollTop -
            currentTarget.clientHeight;
          if (distanceToBottom < 80) {
            setVisibleCount((c) => Math.min(c + 20, filtered.length));
          }
        }}
      >
        {visible.map(({ track, index }) => {
          const artwork = track.artwork_url || track.user?.avatar_url || "";
          const added = hasTrack(index);
          const isCurrent = index === currentIndex;

          return (
            <li key={track.id} className={`share-browser__item${added ? " added" : ""}`}>
              <button
                type="button"
                className="share-browser__play"
                onClick={() => (isCurrent ? toggle() : selectTrack(index))}
                aria-label={isCurrent && isPlaying ? "Pause" : "Play"}
              >
                {artwork ? (
                  <img src={artwork} alt="" className="share-browser__cover" />
                ) : (
                  <div className="share-browser__cover share-browser__cover--empty" />
                )}
                <span className="share-browser__play-icon">
                  <Icon name={isCurrent && isPlaying ? "pause" : "play"} />
                </span>
              </button>

              <span className="share-browser__name">{track.title}</span>

              <button
                type="button"
                className={`share-browser__add${added ? " share-browser__add--added" : ""}`}
                onClick={() => (added ? onRemove(index) : onAdd(index))}
                aria-label={added ? "Remove from playlist" : "Add to playlist"}
              >
                {added ? "✓" : "+"}
              </button>
            </li>
          );
        })}

        {!visible.length && sounds.length > 0 && (
          <li className="share-browser__empty">
            No tracks match "{search}"
          </li>
        )}

        {!sounds.length && (
          <li className="share-browser__empty share-browser__loading">
            Loading tracks...
          </li>
        )}
      </ul>
    </div>
  );
};

export default TrackBrowser;
