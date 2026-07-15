import React from "react";

const getYouTubeVideoId = (url) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      return parsedUrl.pathname.split("/").filter(Boolean)[0];
    }

    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "music.youtube.com"
    ) {
      if (parsedUrl.pathname === "/watch") {
        return parsedUrl.searchParams.get("v");
      }

      const [type, id] = parsedUrl.pathname.split("/").filter(Boolean);

      if (["embed", "shorts", "live"].includes(type)) {
        return id;
      }
    }
  } catch {
    return null;
  }

  return null;
};

const YouTubePlayer = ({ url, title, className = "" }) => {
  const videoId = getYouTubeVideoId(url);

  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return null;
  }

  return (
    <div className={`youtube-player ${className}`.trim()}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubePlayer;
