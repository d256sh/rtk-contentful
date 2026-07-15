import React from "react";
import { motion } from "framer-motion";

import { getLocaleDateString } from "../../utils/common";
import Icon from "../Icon";

const TourItem = ({
  date,
  city,
  place,
  ticketLink,
  videoLink,
  soldOut,
  i,
  offset = 260,
}) => {
  return (
    <motion.li
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: i * 0.08,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <div className="tour-item">
        <div className="tour-item__info">
          <div className="tour-item__date">{getLocaleDateString(date, {})}</div>
          <p className="tour-item__place">{place}</p>
        </div>

        <p className="tour-item__city">{city}</p>

        <a href={videoLink} target="_blank" rel="noreferrer" className="tour-item__button">
          <span>Last video</span>
          <Icon name="arrow-right" />
        </a>
      </div>
    </motion.li>
  );
};

export default TourItem;
