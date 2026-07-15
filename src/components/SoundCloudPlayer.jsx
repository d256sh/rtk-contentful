import React, { useEffect, useRef } from "react";
import Section from "./Section/Section";
import Title from "./Title";
import {
  AUDIO_PLAY_EVENT,
  notifyMediaPlayback,
} from "../utils/common";

const WIDGET_API_URL = "https://w.soundcloud.com/player/api.js";
const PLAYER_URL =
  "https://w.soundcloud.com/player/?visual=true&url=https%3A%2F%2Fapi.soundcloud.com%2Fusers%2F48084634&show_artwork=true&color=%23ffa600&hide_related=true&show_comments=false&show_reposts=false";

const SoundCloudPlayer = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    let widget;

    const pauseWidget = () => widget?.pause();
    const connectWidget = () => {
      if (!window.SC?.Widget || !iframeRef.current) {
        return;
      }

      widget = window.SC.Widget(iframeRef.current);
      widget.bind(window.SC.Widget.Events.PLAY, notifyMediaPlayback);
      window.addEventListener(AUDIO_PLAY_EVENT, pauseWidget);
    };

    let script = document.querySelector(`script[src="${WIDGET_API_URL}"]`);

    if (window.SC?.Widget) {
      connectWidget();
    } else if (script) {
      script.addEventListener("load", connectWidget);
    } else {
      script = document.createElement("script");
      script.src = WIDGET_API_URL;
      script.async = true;
      script.addEventListener("load", connectWidget);
      document.body.appendChild(script);
    }

    return () => {
      script?.removeEventListener("load", connectWidget);
      window.removeEventListener(AUDIO_PLAY_EVENT, pauseWidget);
      widget?.unbind(window.SC?.Widget?.Events?.PLAY);
    };
  }, []);

  return (
    <Section className="soundcloud-section">
      <div className="container">
        <Title text="SoundCloud" />
        <div className="soundcloud-player">
          <iframe
            ref={iframeRef}
            title="XXXTENTACION on SoundCloud"
            width="100%"
            height="450"
            scrolling="no"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            src={PLAYER_URL}
          />
        </div>
      </div>
    </Section>
  );
};

export default SoundCloudPlayer;
