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

export const pauseOtherVideos = (currentVideo) => {
  document.querySelectorAll("video").forEach((video) => {
    if (video !== currentVideo) {
      video.pause();
    }
  });
};
