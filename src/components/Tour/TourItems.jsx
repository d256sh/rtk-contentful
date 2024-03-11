import React, { useEffect } from "react";
import Section from "../Section/Section";
import Title from "../Title";
import { useDispatch, useSelector } from "react-redux";
import { getTourItems } from "../../reducers/tourReducer";
import TourItem from "./TourItem";
import { sortByDate } from "../../utils/common";
import Loading from "../Loader.jsx";

const TourItems = () => {
  const dispatch = useDispatch();

  const { items = [], isLoading } = useSelector(({ tour }) => tour);

  const filtered = sortByDate(
    items
      .filter(({ soldOut, ticketLink }) => !soldOut && ticketLink)
      .filter((_, i) => i < 5)
  );

  useEffect(() => {
    dispatch(getTourItems());
  }, [dispatch]);

  return (
    <Section className="tour">
      <div className="container">
        <Title text="List" />
        {isLoading ? (
          <Loading />
        ) : (
          <ul className="tour-list">
            {filtered.map((item, i) => (
              <TourItem {...item} i={i} key={item.sys.id} />
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
};

export default TourItems;
