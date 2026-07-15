import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Section from "./Section/Section";
import SectionTitle from "./Title";
import Icon from "./Icon";
import Loader from "./Loader";

import { getLocaleDateString } from "../utils/common";

import { useTrackItems } from "../hooks/useTrackItems";

const trackVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.55,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

const Tracks = () => {
  const { items = [], isLoading } = useTrackItems();

  const [audio] = useState(new Audio());
  const [playing, setPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  const handleTrackClick = (track) => {
    setPlaying((prev) => {
      const isPlaying = track.sys.id === currentTrack?.sys?.id ? !prev : true;

      audio.src = track.link.url;
      !isPlaying ? audio.pause() : audio.play();

      return isPlaying;
    });

    setCurrentTrack(track);
  };

  useEffect(() => {
    return () => {
      audio.pause();
    };
  }, [audio]);

  return (
    <Section className="tracks-section">
      <div className="container">
        <SectionTitle text="Tracks" />

        {isLoading ? (
          <Loader />
        ) : (
          <div className="tracks">
            {items
              .filter((_, i) => i < 3)
              .map((track, i) => {
                const {
                  cover,
                  title,
                  sys: { id },
                  date,
                } = track;

                return (
                  <motion.div
                    key={id}
                    className="track-item"
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={trackVariants}
                  >
                    <div className="track" onClick={() => handleTrackClick(track)}>
                      <div className="track-image">
                        <img src={cover.url} alt={title} />
                        {!!playing && currentTrack.sys.id === id ? (
                          <Icon name="pause" />
                        ) : (
                          <Icon name="play" />
                        )}
                      </div>
                      <p className="track-date">
                        {getLocaleDateString(date, { month: "short" })}
                      </p>
                      <h3 className="track-title">{title}</h3>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        )}

        <Link
          to="/tracks"
          className="button-more"
        >
          All Tracks {">"}
        </Link>
      </div>
    </Section>
  );
};

export default Tracks;
