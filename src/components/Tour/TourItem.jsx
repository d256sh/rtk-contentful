import React from "react";
import { motion } from "framer-motion";

import { getLocaleDateString } from "../../utils/common";
import Icon from "../Icon";

const TourItem = ({
  date,
  city,
  place,
  country,
  videoLink,
  setlistCollection,
  i,
}) => {
  const setlist = setlistCollection?.items ?? [];

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
      <article className="tour-item">
        <div className="tour-item__summary">
          <div className="tour-item__info">
            <div className="tour-item__date">{getLocaleDateString(date, {})}</div>
            <p className="tour-item__place">{place}</p>
          </div>

          <p className="tour-item__city">
            {city}
            {country && `, ${country}`}
          </p>

          {videoLink && (
            <a
              href={videoLink}
              target="_blank"
              rel="noreferrer"
              className="tour-item__button"
            >
              <span>Concert video</span>
              <Icon name="arrow-right" />
            </a>
          )}
        </div>

        {!!setlist.length && (
          <div className="tour-item__setlist">
            <h3>Setlist</h3>
            <ol>
              {setlist.map((track) => (
                <li key={track.sys.id}>
                  <div className="tour-item__track">
                    <span>{track.title}</span>
                    {track.note && <p>{track.note}</p>}
                  </div>

                  {track.videoLink && (
                    <a href={track.videoLink} target="_blank" rel="noreferrer">
                      <span>Play video</span>
                      <Icon name="arrow-right" />
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}
      </article>
    </motion.li>
  );
};

export default TourItem;
