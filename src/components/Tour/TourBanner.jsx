import React, { useState } from "react";

import Section from "../Section/Section";

import video from "../../assets/videos/XM.webm";
const TourBanner = () => {
  return (
    <Section className="tour-banner">
      <div style={{ overflow: "hidden" }} className="container">
        <video
          style={{ scale: "1", filter: "contrast(500%)", cursor: "pointer" }}
          controls
        >
          <source src={video} type="video/webm" />
        </video>
      </div>
    </Section>
  );
};

export default TourBanner;
