import React from "react";
import Section from "./Section/Section";
import { Link } from "react-router-dom";
import ScrollAnimation from "react-animate-on-scroll";
import logo from "../assets/images/handwhite.png";
import x from "../assets/images/x.png";

const footerBanner = () => {
  return (
    <Section className="footer-banner__section">
      <div className="container">
        <div className="footer-banner__wrapper">
          <Link to="/footer">
            <ScrollAnimation
              animateIn="fadeInLeft"
              animateOut="fadeOutLeft"
              className="footer-banner__text"
            >
              <p className="footer-banner__subtitle">RIP</p>
              <p className="footer-banner__title">XXXTENTACION</p>
            </ScrollAnimation>
            <ScrollAnimation
              animateIn="fadeInRight"
              animateOut="fadeOutRight"
              className="footer-banner__logo"
            >
              <img src={logo} alt="logo" />
            </ScrollAnimation>
            <ScrollAnimation
              animateIn="fadeInRight"
              animateOut="fadeOutRight"
              className="footer-banner__image"
            >
              <img style={{ height: "400px" }} src={x} alt="XXX" />
            </ScrollAnimation>
          </Link>
        </div>
      </div>
    </Section>
  );
};

export default footerBanner;
