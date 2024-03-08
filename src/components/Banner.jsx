import React from "react";
import Section from "./Section/Section";

const Banner = () => {
  return (
    <Section>
      <div className="container">
        <h1 style={{ fontSize: 0, lineHeight: 0 }}>Banner Title</h1>
        <div className="banner">
          {/* <video className="banner-video" width="100%" height="auto" loop muted autoPlay>
            <source src={video} type="video/webm" />
          </video> */}
          <p className="banner-text">banner text</p>
        </div>
      </div>
    </Section>
  );
};

export default Banner;
