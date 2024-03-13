import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollAnimation from "react-animate-on-scroll";

import Section from "./Section/Section";
import SectionTitle from "./Title";
import Icon from "./Icon";
import Loader from "./Loader";

import { getLocaleDateString } from "../utils/common";

import { useTrackItems } from "../hooks/useTrackItems";

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
              .map((track) => {
                const {
                  cover,
                  title,
                  sys: { id },
                  date,
                } = track;

                return (
                  <ScrollAnimation
                    key={id}
                    className="track-item"
                    animateIn="fadeInLeft"
                    animateOut="fadeOutRight"
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
                  </ScrollAnimation>
                );
              })}
          </div>
        )}

        <Link
          style={{ zIndex: 20, color: "white", fontSize: "24px" }}
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
