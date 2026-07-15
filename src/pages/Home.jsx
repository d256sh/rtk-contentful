import React from "react";
import Banner from "../components/Banner";
import TourBanner from "../components/Tour/TourBanner";
import FooterBanner from "../components/FooterBanner";
import FeaturedXVideo from "../components/FeaturedXVideo";
import SoundCloudTracks from "../components/SoundCloudTracks";

const Home = ({ tracksOnly = false }) => {
  return (
    <main className={`main${tracksOnly ? " tracks-page" : ""}`}>
      <div hidden={tracksOnly}>
        <Banner />
        <FeaturedXVideo />
        <TourBanner />
      </div>

      <SoundCloudTracks enableParallax={!tracksOnly} />

      <div hidden={tracksOnly}>
        <FooterBanner />
      </div>
    </main>
  );
};

export default Home;
