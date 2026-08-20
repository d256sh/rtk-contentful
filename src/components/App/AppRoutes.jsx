import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "../../pages/Home";
import PastTours from "../../pages/PastTours";
import SharePage from "../../pages/SharePage";

const AppRoutes = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isMediaPage = isHome;
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
          <Home />
        </div>
      )}

      <Routes>
        <Route index element={null} />
        <Route path="tour" element={<PastTours />} />
        <Route path="share" element={<SharePage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;

