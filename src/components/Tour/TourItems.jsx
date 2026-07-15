import React, { useEffect, useState } from "react";
import Section from "../Section/Section";
import Title from "../Title";
import { useDispatch, useSelector } from "react-redux";
import { getTourItems } from "../../reducers/tourReducer";
import TourItem from "./TourItem";
import Loading from "../Loader.jsx";
import VideoModal from "../VideoModal";
import { notifyMediaPlayback } from "../../utils/common";

const TourItems = () => {
  const dispatch = useDispatch();
  const [videoModal, setVideoModal] = useState(null);
  const [activeConcertVideo, setActiveConcertVideo] = useState(null);

  const { items = [], isLoading } = useSelector(({ tour }) => tour);

  const pastTours = items
    .filter(({ date }) => date && new Date(date) <= new Date())
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  useEffect(() => {
    dispatch(getTourItems());
  }, [dispatch]);

  return (
    <>
      <Section className="tour" disableParallax>
        <div className="container">
          <Title text="Past Tours" />
          {isLoading ? (
            <Loading />
          ) : pastTours.length ? (
            <ul className="tour-list">
              {pastTours.map((item, i) => (
                <TourItem
                  {...item}
                  i={i}
                  key={item.sys.id}
                  isConcertVideoOpen={activeConcertVideo === item.sys.id}
                  onToggleConcertVideo={() => {
                    setVideoModal(null);
                    if (activeConcertVideo !== item.sys.id) {
                      notifyMediaPlayback();
                    }
                    setActiveConcertVideo((current) =>
                      current === item.sys.id ? null : item.sys.id
                    );
                  }}
                  onPlayVideo={(videos, index = 0) => {
                    notifyMediaPlayback();
                    setActiveConcertVideo(null);
                    setVideoModal({ videos, index });
                  }}
                />
              ))}
            </ul>
          ) : (
            <p className="tour-empty">No past concerts found.</p>
          )}
        </div>
      </Section>

      <VideoModal
        video={videoModal?.videos[videoModal.index]}
        position={videoModal ? videoModal.index + 1 : 0}
        total={videoModal?.videos.length ?? 0}
        onPrevious={() =>
          setVideoModal((current) => ({
            ...current,
            index:
              (current.index - 1 + current.videos.length) %
              current.videos.length,
          }))
        }
        onNext={() =>
          setVideoModal((current) => ({
            ...current,
            index: (current.index + 1) % current.videos.length,
          }))
        }
        onClose={() => setVideoModal(null)}
      />
    </>
  );
};

export default TourItems;
