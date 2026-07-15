import React from "react";
import { motion } from "framer-motion";
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
          <motion.p
            className="banner-text"
            initial={{ opacity: 0, letterSpacing: "0.6em", textAlign: "center" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          >
            Welcome back to spring 2018
          </motion.p>
        </div>
      </div>
    </Section>
  );
};

export default Banner;
