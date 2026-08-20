import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HASH_KEY = "ids";

const encodePlaylist = (ids) => {
  if (!ids.length) return "";
  return `#${HASH_KEY}=${ids.join(",")}`;
};

const decodePlaylist = (hash) => {
  if (!hash) return [];

  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const raw = params.get(HASH_KEY);

  if (!raw) return [];

  return raw
    .split(",")
    .map(Number)
    .filter((n) => !Number.isNaN(n) && n >= 0);
};

export const useSharePlaylist = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const skipNextHashSync = useRef(false);

  const [selectedIds, setSelectedIds] = useState(() =>
    decodePlaylist(location.hash)
  );

  // Sync hash → state when URL changes externally (e.g. browser back/forward)
  useEffect(() => {
    if (skipNextHashSync.current) {
      skipNextHashSync.current = false;
      return;
    }

    const fromHash = decodePlaylist(location.hash);
    setSelectedIds((prev) => {
      if (
        prev.length === fromHash.length &&
        prev.every((id, i) => id === fromHash[i])
      ) {
        return prev;
      }
      return fromHash;
    });
  }, [location.hash]);

  // Sync state → hash when selectedIds change
  useEffect(() => {
    const newHash = encodePlaylist(selectedIds);
    const currentHash = window.location.hash || "";

    if (newHash !== currentHash) {
      skipNextHashSync.current = true;
      navigate({ hash: newHash }, { replace: true });
    }
  }, [selectedIds, navigate]);

  const addTrack = useCallback((index) => {
    setSelectedIds((prev) => {
      if (prev.includes(index)) return prev;
      return [...prev, index];
    });
  }, []);

  const removeTrack = useCallback((index) => {
    setSelectedIds((prev) => prev.filter((id) => id !== index));
  }, []);

  const moveTrack = useCallback((fromPos, toPos) => {
    setSelectedIds((prev) => {
      if (
        fromPos < 0 ||
        fromPos >= prev.length ||
        toPos < 0 ||
        toPos >= prev.length
      ) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(fromPos, 1);
      next.splice(toPos, 0, moved);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const hasTrack = useCallback(
    (index) => selectedIds.includes(index),
    [selectedIds]
  );

  return {
    selectedIds,
    addTrack,
    removeTrack,
    moveTrack,
    clearAll,
    hasTrack,
    count: selectedIds.length,
  };
};
