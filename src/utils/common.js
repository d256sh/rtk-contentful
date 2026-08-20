import { MAIN_URL } from "./constants";

export const request = async (query) => {
  try {
    const result = await fetch(MAIN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    });

    const { data } = await result.json();

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getLocaleDateString = (
  date,
  { month = "numeric", day = "numeric", year = "numeric" }
) => {
  const calendarDate =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date)
      ? new Date(`${date.slice(0, 10)}T00:00:00.000Z`)
      : new Date(date);

  return calendarDate.toLocaleDateString("uk-UA", {
    month,
    day,
    year,
    timeZone: "UTC",
  });
};

export const sortByDate = (arr) => {
  return arr.sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const MEDIA_PLAY_EVENT = "app:media-play";
export const AUDIO_PLAY_EVENT = "app:audio-play";
export const AUDIO_PAUSE_EVENT = "app:audio-pause";

export const notifyMediaPlayback = () => {
  window.dispatchEvent(new Event(MEDIA_PLAY_EVENT));
};

export const notifyAudioPlayback = () => {
  window.dispatchEvent(new Event(AUDIO_PLAY_EVENT));
};

export const notifyAudioPause = () => {
  window.dispatchEvent(new Event(AUDIO_PAUSE_EVENT));
};

export const pauseOtherVideos = (currentVideo) => {
  document.querySelectorAll("video").forEach((video) => {
    if (
      video !== currentVideo &&
      !video.hasAttribute("data-media-independent")
    ) {
      video.pause();
    }
  });

  if (!currentVideo.muted) {
    notifyMediaPlayback();
  }
};

export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='100%25' height='100%25'%3E%3Crect width='24' height='24' fill='%231a1a1a'/%3E%3Cpath d='M9 18V5l12-2v13' stroke='%23555' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Ccircle cx='6' cy='18' r='3' fill='none' stroke='%23555' stroke-width='1.5'/%3E%3Ccircle cx='18' cy='16' r='3' fill='none' stroke='%23555' stroke-width='1.5'/%3E%3C/svg%3E";

export const handleImageError = (e) => {
  if (e.target.src !== PLACEHOLDER_IMAGE) {
    e.target.onerror = null;
    e.target.src = PLACEHOLDER_IMAGE;
  }
};
