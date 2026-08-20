import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HASH_KEY = "ids";

const encodePlaylist = (ids) => {
  if (!ids.length) return "";
  return `#${HASH_KEY}=${ids.join(",")}`;
};

export const decodePlaylist = (hash) => {
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

  // URL is the Single Source of Truth. No useEffect syncing needed!
  const selectedIds = useMemo(() => decodePlaylist(location.hash), [location.hash]);

  const updateHash = useCallback(
    (newIds) => {
      const newHash = encodePlaylist(newIds);
      if (location.hash !== newHash) {
        navigate({ hash: newHash }, { replace: true });
      }
    },
    [location.hash, navigate]
  );

  const addTrack = useCallback(
    (index) => {
      if (selectedIds.includes(index)) return;
      updateHash([...selectedIds, index]);
    },
    [selectedIds, updateHash]
  );

  const removeTrack = useCallback(
    (index) => {
      updateHash(selectedIds.filter((id) => id !== index));
    },
    [selectedIds, updateHash]
  );

  const moveTrack = useCallback(
    (fromPos, toPos) => {
      if (
        fromPos < 0 ||
        fromPos >= selectedIds.length ||
        toPos < 0 ||
        toPos >= selectedIds.length
      ) {
        return;
      }
      const next = [...selectedIds];
      const [moved] = next.splice(fromPos, 1);
      next.splice(toPos, 0, moved);
      updateHash(next);
    },
    [selectedIds, updateHash]
  );

  const clearAll = useCallback(() => {
    updateHash([]);
  }, [updateHash]);

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
