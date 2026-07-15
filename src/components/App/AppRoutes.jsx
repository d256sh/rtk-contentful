import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../../pages/Home";
import PastTours from "../../pages/PastTours";
import TracksPage from "../../pages/TracksPage";

const AppRoutes = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="tour" element={<PastTours />} />
    <Route path="tracks" element={<TracksPage />} />
  </Routes>
);

export default AppRoutes;
