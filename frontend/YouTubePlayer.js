import React, { useEffect, useRef } from "react";

const YouTubePlayer = ({ videoId, onProgress }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    // Load the YouTube IFrame API
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
        videoId,
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setInterval(() => {
                const currentTime = playerRef.current.getCurrentTime();
                const duration = playerRef.current.getDuration();
                const progress = (currentTime / duration) * 100;
                onProgress(progress); // Send progress to parent component
              }, 1000); // Update progress every second
            }
          },
        },
      });
    };

    // Load the script if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
    }
  }, [videoId, onProgress]);

  return <div id={`youtube-player-${videoId}`}></div>;
};

export default YouTubePlayer;