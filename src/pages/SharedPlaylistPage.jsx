import React from "react";
import { Link } from "react-router-dom";
import { useSoundCloudPlayer } from "../components/SoundCloudPlayerProvider";
import { useSharePlaylist } from "../hooks/useSharePlaylist";
import Icon from "../components/Icon";
import FooterBanner from "../components/FooterBanner";
import ShareButton from "../components/Share/ShareButton";
import { handleImageError, PLACEHOLDER_IMAGE } from "../utils/common";

const SharedPlaylistPage = () => {
  const { sounds, currentIndex, isPlaying, selectTrack, toggle } = useSoundCloudPlayer();
  const { selectedIds } = useSharePlaylist();

  const tracks = selectedIds
    .map((soundIndex) => ({
      soundIndex,
      track: sounds[soundIndex],
    }))
    .filter(({ track }) => !!track);

  return (
    <main className="main shared-page">
      <div className="container shared-page__container">
        <div className="shared-page__header">
          <h1 className="shared-page__title">Fan's Shared Playlist</h1>
          <p className="shared-page__subtitle">
            Listen to this custom selection of tracks
          </p>
        </div>

        <div className="shared-page__content">
          {!tracks.length ? (
            <div className="shared-page__empty">
              <div className="shared-page__empty-icon">🎵</div>
              <h3>Loading tracks...</h3>
              <p>Or this playlist is empty.</p>
            </div>
          ) : (
            <div className="share-playlist shared-page__list-container">
              <div className="share-playlist__header">
                <h2 className="share-playlist__title">Playlist Tracks</h2>
                <span className="share-playlist__count">{tracks.length} track{tracks.length !== 1 ? "s" : ""}</span>
              </div>
              
              <ul className="share-playlist__list">
                {tracks.map(({ soundIndex, track }, posIndex) => {
                  const artwork = track.artwork_url || track.user?.avatar_url || "";
                  const isCurrent = soundIndex === currentIndex;

                  return (
                    <li
                      key={`${soundIndex}-${posIndex}`}
                      className={`share-playlist__item${isCurrent && isPlaying ? " playing" : ""}`}
                    >
                      <span className="share-playlist__number">
                        {String(posIndex + 1).padStart(2, "0")}
                      </span>

                      <button
                        type="button"
                        className="share-playlist__play"
                        onClick={() => (isCurrent ? toggle() : selectTrack(soundIndex))}
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
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        <div className="shared-page__footer">
          <ShareButton count={selectedIds.length} hidePreview={true} />
        </div>

        <FooterBanner fullWidth />
      </div>
    </main>
  );
};

export default SharedPlaylistPage;
