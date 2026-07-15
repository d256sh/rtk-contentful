import React from "react";
import Banner from "../components/Banner";
import TourBanner from "../components/Tour/TourBanner";
import Tracks from "../components/Tracks";
import FooterBanner from "../components/FooterBanner";
import FeaturedXVideo from "../components/FeaturedXVideo";

const Home = () => {
  return (
    <main className="main">
      <Banner />
      <FeaturedXVideo />
      <TourBanner />
      <Tracks />
      <FooterBanner />
    </main>
  );
};

export default Home;
