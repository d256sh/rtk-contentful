import React from "react";
import ScrollAnimation from "react-animate-on-scroll";

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
    <li>
      <ScrollAnimation
        className="tour-item"
        animateIn="fadeInLeft"
        animateOut="fadeOutRight"
        delay={i * 100}
        offset={offset}
      >
        <div className="tour-item__info">
          <div className="tour-item__date">{getLocaleDateString(date, {})}</div>
          <p className="tour-item__place">{place}</p>
        </div>

        <p className="tour-item__city">{city}</p>

        <a href={videoLink} target="__black" className="tour-item__button">
          <span>Last video</span>
          <Icon name="arrow-right" />
        </a>
      </ScrollAnimation>
    </li>
  );
};

export default TourItem;
