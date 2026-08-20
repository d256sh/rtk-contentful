import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import AppRoutes from "./AppRoutes";
import FloatingTrackPlayer from "../FloatingTrackPlayer";
import SoundCloudPlayerProvider from "../SoundCloudPlayerProvider";

const AppLayout = () => {
  const { pathname } = useLocation();
  const hidePlayer = pathname.startsWith("/shared");

  return (
    <SoundCloudPlayerProvider>
      <Header />
      <AppRoutes />
      <FloatingTrackPlayer />
    </SoundCloudPlayerProvider>
  );
};

export default AppLayout;
