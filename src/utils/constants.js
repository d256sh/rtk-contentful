export const MAIN_URL = `https://graphql.contentful.com/content/v1/spaces/${process.env.REACT_APP_SPACE_ID}`;

export const FEATURED_X_POST_URL =
  process.env.REACT_APP_FEATURED_X_POST_URL ||
  "https://x.com/Naveenshadow2/status/1617448885999521793/video/1";

export const FEATURED_X_STORY_TWO_POST_URL =
  process.env.REACT_APP_FEATURED_X_STORY_TWO_POST_URL ||
  "https://x.com/i/status/1660419556895064065";

export const MENU = [
  {
    name: "X",
    link: "",
  },
  {
    name: "Last Concerts",
    link: "tour",
  },
  {
    name: "Tracks",
    link: "tracks",
  }
];

export const SOCIALS = [
  {
    icon: "soundcloud",
    link:
      process.env.REACT_APP_XXXTENTACION_SOUNDCLOUD_URL ||
      "https://soundcloud.com/jahseh-onfroy",
  },
  {
    icon: "youtube",
    link:
      process.env.REACT_APP_XXXTENTACION_YOUTUBE_URL ||
      "https://www.youtube.com/channel/UCM9r1xn6s30OnlJWb-jc3Sw",
  },
  {
    icon: "twitter",
    link:
      process.env.REACT_APP_XXXTENTACION_TWITTER_URL ||
      "https://twitter.com/xxxtentacion",
  },
  {
    icon: "applemusic",
    link:
      process.env.REACT_APP_XXXTENTACION_APPLE_MUSIC_URL ||
      "https://music.apple.com/us/artist/xxxtentacion/1082533559",
  },
  {
    icon: "instagram",
    link:
      process.env.REACT_APP_XXXTENTACION_INSTAGRAM_URL ||
      "https://www.instagram.com/xxxtentacion/",
  },
  {
    icon: "spotify",
    link:
      process.env.REACT_APP_XXXTENTACION_SPOTIFY_URL ||
      "https://open.spotify.com/artist/15UsOTVnJzReFVN1VCnxy4",
  },
];
