import React from "react";
import Banner from "../components/Banner";
import TourItems from "../components/Tour/TourItems";
import TourBanner from "../components/Tour/TourBanner";
import Tracks from "../components/Tracks";

const Home = () => {
  return (
    <main className="main">
      <Banner />
      <TourItems />
      <TourBanner />
      <Tracks />
    </main>
  );
};

export default Home;
