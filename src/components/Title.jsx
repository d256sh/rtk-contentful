import React from "react";
import { motion } from "framer-motion";

const SectionTitle = ({ text }) => (
  <motion.h2
    className="title"
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
  >
    {text}
  </motion.h2>
);

export default SectionTitle;
