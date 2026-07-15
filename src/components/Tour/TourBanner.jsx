import React from "react";

import Section from "../Section/Section";

import video from "../../assets/videos/XM.webm";

const TourBanner = () => {
  return (
    <Section className="tour-banner">
      <div className="container">
        <video
          style={{ filter: "contrast(150%)" }}
          autoPlay
          muted
          loop
          playsInline
          data-media-independent
        >
          <source src={video} type="video/webm" />
        </video>
      </div>
    </Section>
  );
};

export default TourBanner;
