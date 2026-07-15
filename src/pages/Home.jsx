import React from "react";
import Banner from "../components/Banner";
import TourBanner from "../components/Tour/TourBanner";
import Tracks from "../components/Tracks";
import FooterBanner from "../components/FooterBanner";

const Home = () => {
  return (
    <main className="main">
      <Banner />
      <TourBanner />
      <Tracks />
      <FooterBanner />
    </main>
  );
};

export default Home;
