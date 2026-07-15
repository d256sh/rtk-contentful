import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../../pages/Home";
import PastTours from "../../pages/PastTours";

const AppRoutes = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="tour" element={<PastTours />} />
  </Routes>
);

export default AppRoutes;
