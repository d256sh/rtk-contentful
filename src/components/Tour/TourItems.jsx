import React, { useEffect, useState } from "react";
import Section from "../Section/Section";
import Title from "../Title";
import { useDispatch, useSelector } from "react-redux";
import { getTourItems } from "../../reducers/tourReducer";
import TourItem from "./TourItem";
import Loading from "../Loader.jsx";
import VideoModal from "../VideoModal";

const TourItems = () => {
  const dispatch = useDispatch();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const { items = [], isLoading } = useSelector(({ tour }) => tour);

  const pastTours = items
    .filter(({ date }) => date && new Date(date) <= new Date())
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  useEffect(() => {
    dispatch(getTourItems());
  }, [dispatch]);

  return (
    <>
      <Section className="tour">
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
                  onPlayVideo={setSelectedVideo}
                />
              ))}
            </ul>
          ) : (
            <p className="tour-empty">No past concerts found.</p>
          )}
        </div>
      </Section>

      <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </>
  );
};

export default TourItems;
