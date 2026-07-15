import React from "react";
import Header from "../Header/Header";
import AppRoutes from "./AppRoutes";
import FloatingTrackPlayer from "../FloatingTrackPlayer";

const AppLayout = () => (
  <>
    <Header />
    <AppRoutes />
    <FloatingTrackPlayer />
  </>
);

export default AppLayout;
