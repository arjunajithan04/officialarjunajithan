import { useEffect, useRef, useState } from "react";

const VIDEO_SOURCE = "/videos/portfolio-intro.mp4";
const EXIT_DURATION = 700;

function LoadingScreenUI() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const finishLoading = () => {
    if (exiting) return;

    setExiting(true);
    window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, EXIT_DURATION);
  };

  const handleVideoReady = () => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // Autoplay is intentionally muted, but leave the screen in place if
      // the browser still delays playback until it can start the video.
    });
  };

  if (!visible) return null;

  return (
    <div
      className={`portfolio-intro-video${exiting ? " is-exiting" : ""}`}
      role="status"
      aria-label="Loading portfolio"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
        background: "#000",
        opacity: exiting ? 0 : 1,
        transition: `opacity ${EXIT_DURATION}ms cubic-bezier(0.76, 0, 0.24, 1)`,
      }}
    >
      <video
        ref={videoRef}
        src={VIDEO_SOURCE}
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={handleVideoReady}
        onEnded={finishLoading}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          background: "#000",
        }}
      />
    </div>
  );
}

export default LoadingScreenUI;
