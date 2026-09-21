import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./loading-screen.css";

const TOTAL_DURATION = 6000;
const REVEAL_AT = 5150;
const REVEAL_DURATION = 850;

const stages = [
  { at: 8, log: "Booting core runtime...", status: "ALLOCATING MEMORY" },
  { at: 28, log: "Synthesizing interface geometry...", status: "PARSING TYPE" },
  { at: 52, log: "Calibrating portfolio systems...", status: "COMPOSITING" },
  { at: 76, log: "Preparing selected work & experience...", status: "STAGING ASSETS" },
  { at: 94, log: "All systems nominal. Entering workspace...", status: "UNLATCHING" },
];

const disciplines = ["SOFTWARE", "WEB", "AI", "EXPERIMENTATION"];

function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(stages[0]);
  const [disciplineIndex, setDisciplineIndex] = useState(0);
  const [revealing, setRevealing] = useState(false);
  const [visible, setVisible] = useState(true);
  const revealingRef = useRef(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const progressRatio = Math.min(elapsed / REVEAL_AT, 1);
      const eased = 1 - Math.pow(1 - progressRatio, 2.2);
      const nextProgress = Math.round(eased * 100);

      setProgress(nextProgress);
      setStage(
        [...stages].reverse().find((item) => nextProgress >= item.at) ?? stages[0],
      );

      if (elapsed >= REVEAL_AT && !revealingRef.current) {
        revealingRef.current = true;
        setRevealing(true);
      }

      if (elapsed < REVEAL_AT) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    const finishTimer = window.setTimeout(() => {
      setProgress(100);
      setVisible(false);
      document.body.style.overflow = previousOverflow;
    }, TOTAL_DURATION);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(finishTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDisciplineIndex((current) => (current + 1) % disciplines.length);
    }, 1050);

    return () => window.clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="portfolio-loader-gemini" role="status" aria-label="Loading portfolio">
      <div className="loader-architectural-grid" aria-hidden="true">
        <span className="grid-v grid-v-1" />
        <span className="grid-v grid-v-2" />
        <span className="grid-v grid-v-3" />
        <span className="grid-v grid-v-4" />
        <span className="grid-v grid-v-5" />
        <span className="grid-h grid-h-1" />
        <span className="grid-h grid-h-2" />
        <span className="grid-h grid-h-3" />
        <span className="grid-h grid-h-4" />
      </div>

      <div className="loader-grain" aria-hidden="true" />
      <div className="loader-scanline" aria-hidden="true" />

      <motion.div
        className="loader-curtain loader-curtain-top"
        animate={{ y: revealing ? "-100%" : "0%" }}
        transition={{ duration: REVEAL_DURATION / 1000, ease: [0.85, 0, 0.15, 1] }}
      >
        <div className="loader-curtain-content">
          <div className="loader-top-status">
            <div className="loader-status-group">
              <span className="loader-live-dot" />
              <span>ARJUN.OS / INITIALIZING</span>
            </div>
            <span className="loader-location">INDIA / 2026</span>
          </div>

          <div className="loader-top-meta">
            <span>MCA STUDENT&nbsp;&nbsp;·&nbsp;&nbsp;DEVELOPER&nbsp;&nbsp;·&nbsp;&nbsp;BUILDER</span>
            <span className="loader-meta-secondary">BUILDING WITH INTENT</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="loader-curtain loader-curtain-bottom"
        animate={{ y: revealing ? "100%" : "0%" }}
        transition={{ duration: REVEAL_DURATION / 1000, ease: [0.85, 0, 0.15, 1] }}
      >
        <div className="loader-curtain-content loader-bottom-content">
          <div className="loader-identity-label">
            <span className="loader-mini-dot" />
            PORTFOLIO IDENTITY SYSTEM
          </div>

          <div className="loader-progress-area">
            <div className="loader-progress-heading">
              <span>LOADING EXPERIENCE...</span>
              <span className="loader-progress-value">{String(progress).padStart(2, "0")}%</span>
            </div>

            <div className="loader-progress-track">
              <motion.div
                className="loader-progress-fill"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.12, ease: "linear" }}
              />
              <motion.i
                className="loader-progress-marker"
                animate={{ left: `${progress}%` }}
                transition={{ duration: 0.12, ease: "linear" }}
              />
            </div>

            <div className="loader-progress-diagnostics">
              <div>
                <div className="loader-log"><strong>[SYS]</strong>&nbsp; {stage.log}</div>
                <div className="loader-sublog">MEMORY: 64MB OK&nbsp;&nbsp;·&nbsp;&nbsp;SHADERS: COMPILED&nbsp;&nbsp;·&nbsp;&nbsp;STATUS: {stage.status}</div>
              </div>
              <span className="loader-init-state"><i /> {disciplineIndex === 3 ? "INITIALIZATION COMPLETE" : "INITIALIZING EXPERIENCE"}</span>
            </div>

            <div className="loader-footer-meta">
              <span>FLOW / 04 STAGES</span>
              <span>IDEAS / CODE / IMPACT</span>
              <span>PORTFOLIO / 2026</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="loader-center-stage">
        <div className={`loader-wordmark-wrap${revealing ? " loader-wordmark-revealing" : ""}`}>
          <motion.div
            className="loader-wordmark-solid"
            initial="hidden"
            animate={revealing ? "split" : "visible"}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.065, delayChildren: 0.12 } },
              split: { transition: { staggerChildren: 0.045, delayChildren: 0.02 } },
            }}
          >
            {"ARJUN".split("").map((char, index) => {
              const fan = [
                { x: -150, y: -120, rotate: -9 },
                { x: -75, y: -92, rotate: -5 },
                { x: -22, y: -74, rotate: -2 },
                { x: 72, y: -92, rotate: 5 },
                { x: 150, y: -120, rotate: 9 },
              ][index];
              return (
                <motion.span
                  key={`${char}-${index}`}
                  className="loader-wordmark-letter"
                  variants={{
                    hidden: { opacity: 0, y: 46 },
                    visible: { opacity: 1, y: 0 },
                    split: { opacity: 0, x: fan.x, y: fan.y, rotate: fan.rotate, scale: 0.94 },
                  }}
                  transition={{ duration: revealing ? 0.78 : 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  {char}
                </motion.span>
              );
            })}
          </motion.div>
          <motion.div
            className="loader-wordmark-outline"
            initial="hidden"
            animate={revealing ? "split" : "visible"}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.055, delayChildren: 0.42 } },
              split: { transition: { staggerChildren: 0.035, delayChildren: 0.04 } },
            }}
          >
            {"AJITHAN".split("").map((char, index) => {
              const center = 3;
              const distance = index - center;
              return (
                <motion.span
                  key={`${char}-${index}`}
                  className="loader-wordmark-letter"
                  variants={{
                    hidden: { opacity: 0, y: 38 },
                    visible: { opacity: 1, y: 0 },
                    split: {
                      opacity: 0,
                      x: distance * 78,
                      y: 100 + Math.abs(distance) * 12,
                      rotate: distance * 4,
                      scale: 0.96,
                    },
                  }}
                  transition={{ duration: revealing ? 0.72 : 0.85, ease: [0.16, 1, 0.3, 1] }}
                >
                  {char}
                </motion.span>
              );
            })}
          </motion.div>
        </div>

        <div className="loader-side-discipline" aria-hidden="true">
          <span>//</span>
          {disciplines.map((item, index) => (
            <motion.span
              key={item}
              animate={{ opacity: disciplineIndex === index ? 1 : 0.28, x: disciplineIndex === index ? 0 : 2 }}
              transition={{ duration: 0.25 }}
            >
              {item}
            </motion.span>
          ))}
        </div>

        <div className="loader-left-tagline" aria-hidden="true">
          <span>GOOD</span>
          <span>SOFTWARE</span>
          <span>BETTER</span>
          <span>TOMORROWS.</span>
        </div>

        <div className="loader-crosshair loader-crosshair-a" aria-hidden="true" />
        <div className="loader-crosshair loader-crosshair-b" aria-hidden="true" />
        <div className="loader-orbit" aria-hidden="true" />
      </div>

      <div className="loader-edge-label loader-edge-left">SOFTWARE</div>
      <div className="loader-edge-label loader-edge-center">AI</div>
      <div className="loader-edge-label loader-edge-right">{disciplineIndex === 0 ? "IDEAS / CODE / IMPACT" : "STAY CURIOUS"}</div>
    </div>
  );
}

export default LoadingScreen;
