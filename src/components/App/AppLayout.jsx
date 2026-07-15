import React from "react";
import Header from "../Header/Header";
import AppRoutes from "./AppRoutes";
import FloatingTrackPlayer from "../FloatingTrackPlayer";
import SoundCloudPlayerProvider from "../SoundCloudPlayerProvider";

const AppLayout = () => (
  <SoundCloudPlayerProvider>
    <Header />
    <AppRoutes />
    <FloatingTrackPlayer />
  </SoundCloudPlayerProvider>
);

export default AppLayout;
