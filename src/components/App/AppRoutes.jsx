import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "../../pages/Home";
import PastTours from "../../pages/PastTours";

const AppRoutes = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isTracksPage = pathname === "/tracks";
  const isMediaPage = isHome || isTracksPage;
  const [hasMountedMediaPage, setHasMountedMediaPage] = useState(isMediaPage);

  useEffect(() => {
    if (isMediaPage) {
      setHasMountedMediaPage(true);
    }
  }, [isMediaPage]);

  return (
    <>
      {hasMountedMediaPage && (
        <div hidden={!isMediaPage}>
          <Home tracksOnly={isTracksPage} />
        </div>
      )}

      <Routes>
        <Route index element={null} />
        <Route path="tour" element={<PastTours />} />
        <Route path="tracks" element={null} />
      </Routes>
    </>
  );
};

export default AppRoutes;
