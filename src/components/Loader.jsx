import React from "react";
import { motion } from "framer-motion";

const Loader = () => (
  <div className="loader">
    <motion.div
      className="loader-spinner"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export default Loader;
