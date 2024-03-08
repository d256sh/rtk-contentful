import React from "react";
import ScrollAnimation from "react-animate-on-scroll";

const Title = ({ text }) => (
  <ScrollAnimation animation="fadeInLeft" animateOut="fadeOutLeft">
    <h2>{text}</h2>
  </ScrollAnimation>
);

export default Title;
