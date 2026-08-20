import React from "react";
import { useSoundCloudPlayer } from "../components/SoundCloudPlayerProvider";
import TrackBrowser from "../components/Share/TrackBrowser";
import CustomPlaylist from "../components/Share/CustomPlaylist";
import ShareButton from "../components/Share/ShareButton";
import { useSharePlaylist } from "../hooks/useSharePlaylist";

const SharePage = () => {
  const { sounds } = useSoundCloudPlayer();
  const { selectedIds, addTrack, removeTrack, moveTrack, clearAll, hasTrack, count } =
    useSharePlaylist();

  return (
    <main className="main share-page">
      <div className="container share-page__container">
        <div className="share-page__header">
          <h1 className="share-page__title">Create & Share Playlist</h1>
          <p className="share-page__subtitle">
            Pick your favorite tracks, arrange them your way, and share the link with friends
          </p>
        </div>
        <div className="share-page__grid">
          <TrackBrowser
            hasTrack={hasTrack}
            onAdd={addTrack}
            onRemove={removeTrack}
          />
          <CustomPlaylist
            selectedIds={selectedIds}
            sounds={sounds}
            onRemove={removeTrack}
            onMove={moveTrack}
            onClear={clearAll}
          />
        </div>

        <div className="share-page__footer" style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
          <ShareButton count={count} />
        </div>
      </div>
    </main>
  );
};

export default SharePage;

// Trigger HMR
