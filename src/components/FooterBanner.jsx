import React from "react";
import Section from "./Section/Section";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/images/handwhite.png";
import x from "../assets/images/xx.png";

const FooterBanner = () => {
  return (
    <Section className="footer-banner__section">
      <div className="container">
        <div className="footer-banner__wrapper">
          <Link to="/footer" className="footer-banner">

            <motion.div
              className="footer-banner__text"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="">
                <motion.div
                  className="footer-banner__logo"
                  initial={{ opacity: 0, scale: 1, rotate: 0, translateY: 50 }}
                  whileInView={{ opacity: 1, scale: 1.5, rotate: 23, translateY: 20 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                >
                  <img src={logo} alt="logo" />
                </motion.div>
                <p className="footer-banner__title">XXXTENTACION</p>
              </div>
              <p className="footer-banner__subtitle">RIP</p>

            </motion.div>

            <motion.div
              className="footer-banner__image"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
            >
              <img
                style={{ maxHeight: "400px", filter: "brightness(130%) contrast(130%)" }}
                src={x}
                alt="XXX"
              />
            </motion.div>
          </Link>
        </div>
      </div>
    </Section>
  );
};

export default FooterBanner;
