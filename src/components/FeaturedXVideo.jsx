import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FEATURED_X_POST_URL,
  FEATURED_X_STORY_TWO_POST_URL,
} from "../utils/constants";
import {
  AUDIO_PAUSE_EVENT,
  AUDIO_PLAY_EVENT,
  pauseOtherVideos,
} from "../utils/common";
import firstStory from "../assets/videos/featured-x.mp4";
import secondStory from "../assets/videos/featured-x-story-2.mp4";

const STORIES = [
  {
    src: firstStory,
    postUrl: FEATURED_X_POST_URL,
    title: "XXXTENTACION birthday tribute",
  },
  {
    src: secondStory,
    postUrl: FEATURED_X_STORY_TWO_POST_URL,
    title: "XXXTENTACION fan GIF",
  },
];

const FeaturedXVideo = () => {
  const videoRef = useRef(null);
  const audioPlayingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const activeStory = STORIES[activeIndex];

  const showStory = (index) => {
    setProgress(0);
    setActiveIndex(index);
  };

  useEffect(() => {
    let resumeTimer;

    const pauseForAudio = () => {
      audioPlayingRef.current = true;
      window.clearTimeout(resumeTimer);
      videoRef.current?.pause();
    };
    const resumeAfterAudio = () => {
      audioPlayingRef.current = false;
      resumeTimer = window.setTimeout(() => {
        videoRef.current?.play().catch(() => {});
      }, 180);
    };

    window.addEventListener(AUDIO_PLAY_EVENT, pauseForAudio);
    window.addEventListener(AUDIO_PAUSE_EVENT, resumeAfterAudio);

    return () => {
      window.clearTimeout(resumeTimer);
      window.removeEventListener(AUDIO_PLAY_EVENT, pauseForAudio);
      window.removeEventListener(AUDIO_PAUSE_EVENT, resumeAfterAudio);
    };
  }, []);

  return (
    <section className="featured-x-video" aria-label="Featured X stories">
      <div className="container">
        <motion.div
          className="featured-x-video__card"
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="featured-x-video__progress">
            {STORIES.map((story, index) => (
              <button
                type="button"
                key={story.postUrl}
                onClick={() => showStory(index)}
                aria-label={`Show story ${index + 1}`}
              >
                <span
                  style={{
                    width: `${
                      index < activeIndex
                        ? 100
                        : index === activeIndex
                          ? progress
                          : 0
                    }%`,
                  }}
                />
              </button>
            ))}
          </div>

          <video
            ref={videoRef}
            key={activeStory.src}
            autoPlay
            muted
            playsInline
            preload="metadata"
            aria-label={activeStory.title}
            onPlay={({ currentTarget }) => {
              if (audioPlayingRef.current) {
                currentTarget.pause();
              } else {
                pauseOtherVideos(currentTarget);
              }
            }}
            onTimeUpdate={({ currentTarget }) => {
              const nextProgress = currentTarget.duration
                ? (currentTarget.currentTime / currentTarget.duration) * 100
                : 0;
              setProgress(nextProgress);
            }}
            onEnded={() => showStory((activeIndex + 1) % STORIES.length)}
          >
            <source src={activeStory.src} type="video/mp4" />
          </video>

          <a
            href={activeStory.postUrl}
            target="_blank"
            rel="noreferrer"
            className="featured-x-video__link"
          >
            View on X ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedXVideo;
