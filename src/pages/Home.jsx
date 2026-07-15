import React from "react";
import Banner from "../components/Banner";
import TourBanner from "../components/Tour/TourBanner";
import FooterBanner from "../components/FooterBanner";
import FeaturedXVideo from "../components/FeaturedXVideo";
import SoundCloudPlayer from "../components/SoundCloudPlayer";

const Home = () => {
  return (
    <main className="main">
      <Banner />
      <FeaturedXVideo />
      <TourBanner />
      <SoundCloudPlayer />
      <FooterBanner />
    </main>
  );
};

export default Home;
