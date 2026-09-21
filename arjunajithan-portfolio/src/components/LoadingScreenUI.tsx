import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import "./loading-screen-ui.css";

const TOTAL_DURATION = 6000;
const EXIT_START = 5250;
const EXIT_DURATION = TOTAL_DURATION - EXIT_START;

const stages = [
  { at: 0, code: "01", label: "BOOT", log: "Booting interface runtime...", status: "ALLOCATING" },
  { at: 22, code: "02", label: "SYNC", log: "Synchronizing portfolio systems...", status: "CONNECTING" },
  { at: 48, code: "03", label: "COMPOSE", log: "Calibrating visual experience...", status: "COMPOSITING" },
  { at: 74, code: "04", label: "STAGE", log: "Preparing selected work & experience...", status: "STAGING" },
  { at: 94, code: "05", label: "READY", log: "All systems nominal. Entering workspace...", status: "READY" },
];

const disciplines = ["SOFTWARE", "WEB", "AI", "EXPERIMENTATION"];
const signalBars = Array.from({ length: 18 }, (_, index) => index);

function LoadingScreenUI() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(stages[0]);
  const [disciplineIndex, setDisciplineIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(true);
  const exitingRef = useRef(false);

  const signalSeed = useMemo(() => signalBars.map((index) => 25 + ((index * 17) % 55)), []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const ratio = Math.min(elapsed / EXIT_START, 1);
      const eased = 1 - Math.pow(1 - ratio, 1.65);
      const next = Math.min(100, Math.round(eased * 100));

      setProgress(next);
      setStage([...stages].reverse().find((item) => next >= item.at) ?? stages[0]);

      if (elapsed >= EXIT_START && !exitingRef.current) {
        exitingRef.current = true;
        setExiting(true);
      }

      if (elapsed < EXIT_START) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    const finish = window.setTimeout(() => {
      setProgress(100);
      setVisible(false);
      document.body.style.overflow = previousOverflow;
    }, TOTAL_DURATION);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(finish);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDisciplineIndex((current) => (current + 1) % disciplines.length);
    }, 900);
    return () => window.clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className={`portfolio-loader-ui${exiting ? " is-exiting" : ""}`}
      role="status"
      aria-label="Loading portfolio"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0.98 : 1 }}
    >
      <div className="ui-loader-grid" aria-hidden="true">
        {Array.from({ length: 7 }, (_, i) => <span key={`v-${i}`} className="ui-grid-v" style={{ left: `${(i + 1) * 12.5}%` }} />)}
        {Array.from({ length: 4 }, (_, i) => <span key={`h-${i}`} className="ui-grid-h" style={{ top: `${20 + i * 20}%` }} />)}
      </div>

      <div className="ui-loader-grain" aria-hidden="true" />
      <div className="ui-loader-scan" aria-hidden="true" />

      <motion.div className="ui-loader-top" animate={exiting ? { y: -70, opacity: 0 } : { y: 0, opacity: 1 }} transition={{ duration: EXIT_DURATION / 1000 }}>
        <div className="ui-loader-status"><i /> ARJUN.OS / INITIALIZING</div>
        <div className="ui-loader-top-right">INDIA / 2026</div>
      </motion.div>

      <motion.div className="ui-loader-side ui-loader-side-left" animate={exiting ? { x: -90, opacity: 0 } : { x: 0, opacity: 1 }} transition={{ duration: EXIT_DURATION / 1000 }}>
        <span className="ui-side-kicker">SYSTEM PROFILE</span>
        <span>SOFTWARE</span>
        <span>WEB</span>
        <span>AI</span>
        <span>EXPERIMENTATION</span>
      </motion.div>

      <motion.div className="ui-loader-side ui-loader-side-right" animate={exiting ? { x: 90, opacity: 0 } : { x: 0, opacity: 1 }} transition={{ duration: EXIT_DURATION / 1000 }}>
        <span className="ui-side-kicker">LIVE SIGNAL</span>
        <div className="ui-signal-bars">
          {signalBars.map((bar) => (
            <motion.i
              key={bar}
              animate={{ height: `${Math.max(18, signalSeed[bar] + Math.sin((progress + bar * 8) / 12) * 18)}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          ))}
        </div>
        <span className="ui-signal-value">{String(Math.round(24 + (progress * 0.31))).padStart(2, "0")} ms</span>
      </motion.div>

      <motion.div
        className="ui-loader-center"
        initial={{ x: "-50%", y: "-50%" }}
        animate={exiting ? { x: "-50%", y: "-50%", scale: 1.16, opacity: 0 } : { x: "-50%", y: "-50%", scale: 1, opacity: 1 }}
        transition={{ duration: EXIT_DURATION / 1000 }}
      >
        <div className="ui-core-ring ui-core-ring-outer" />
        <div className="ui-core-ring ui-core-ring-mid" />
        <motion.div
          className="ui-core-ring ui-core-ring-inner"
          animate={{ rotate: 360, scale: [1, 1.025, 1] }}
          transition={{
            rotate: { duration: 9, repeat: Infinity, ease: "linear" },
            scale: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
          }}
        />
        <motion.div
          className="ui-core-marker"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="ui-core-center"
          animate={exiting ? { scale: 0.72, opacity: 0 } : { scale: [1, 1.018, 1], opacity: 1 }}
          transition={{
            duration: exiting ? EXIT_DURATION / 1000 : 2.4,
            repeat: exiting ? 0 : Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="ui-core-label">SYSTEM / PORTFOLIO</span>
          <div className="ui-core-value">
            <strong>{String(progress).padStart(2, "0")}</strong>
            <span className="ui-core-unit">%</span>
          </div>
          <small>{stage.code} / {stage.label}</small>
        </motion.div>

        <div className="ui-core-crosshair" />
      </motion.div>

      <motion.div
        className="ui-loader-center-copy"
        initial={{ x: "-50%" }}
        animate={exiting ? { x: "-50%", y: 24, opacity: 0 } : { x: "-50%", y: 0, opacity: 1 }}
        transition={{ duration: EXIT_DURATION / 1000 }}
      >
        <span>PORTFOLIO SYSTEM</span>
        <strong>{disciplines[disciplineIndex]}</strong>
        <small>{stage.log}</small>
      </motion.div>

      <motion.div className="ui-loader-module ui-loader-module-left" animate={exiting ? { x: -70, opacity: 0 } : { x: 0, opacity: 1 }} transition={{ duration: EXIT_DURATION / 1000 }}>
        <div className="ui-module-head"><span>PROCESS</span><span>04 / 05</span></div>
        {stages.slice(0, 4).map((item) => {
          const active = progress >= item.at;
          return <div className={`ui-stage-row${active ? " active" : ""}`} key={item.code}><i /> <span>{item.code}</span><b>{item.label}</b></div>;
        })}
      </motion.div>

      <motion.div className="ui-loader-module ui-loader-module-right" animate={exiting ? { x: 70, opacity: 0 } : { x: 0, opacity: 1 }} transition={{ duration: EXIT_DURATION / 1000 }}>
        <div className="ui-module-head"><span>DIAGNOSTICS</span><span>ONLINE</span></div>
        <div className="ui-diagnostic-row"><span>MEMORY</span><b>64MB OK</b></div>
        <div className="ui-diagnostic-row"><span>SHADERS</span><b>COMPILED</b></div>
        <div className="ui-diagnostic-row"><span>STATUS</span><b>{stage.status}</b></div>
      </motion.div>

      <motion.div
        className="ui-loader-bottom"
        initial={{ x: "-50%" }}
        animate={exiting ? { x: "-50%", y: 70, opacity: 0 } : { x: "-50%", y: 0, opacity: 1 }}
        transition={{ duration: EXIT_DURATION / 1000 }}
      >
        <div className="ui-loader-progress-label"><span>LOADING EXPERIENCE...</span><b>{String(progress).padStart(2, "0")} %</b></div>
        <div className="ui-loader-progress-track">
          <motion.div className="ui-loader-progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.12, ease: "linear" }} />
          <motion.i className="ui-loader-progress-dot" animate={{ left: `${progress}%` }} transition={{ duration: 0.12, ease: "linear" }} />
        </div>
        <div className="ui-loader-bottom-meta"><span>IDEAS / CODE / IMPACT</span><span><i /> INITIALIZING EXPERIENCE</span><span>PORTFOLIO / 2026</span></div>
      </motion.div>

      <div className="ui-loader-corner ui-corner-tl" />
      <div className="ui-loader-corner ui-corner-tr" />
      <div className="ui-loader-corner ui-corner-bl" />
      <div className="ui-loader-corner ui-corner-br" />
    </motion.div>
  );
}

export default LoadingScreenUI;
