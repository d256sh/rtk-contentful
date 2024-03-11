import React from "react";
import Banner from "../components/Banner";
import TourItems from "../components/Tour/TourItems";
import TourBanner from "../components/Tour/TourBanner";

const Home = () => {
  return (
    <main className="main">
      <Banner />
      <TourItems />
      <TourBanner />
    </main>
  );
};

export default Home;
