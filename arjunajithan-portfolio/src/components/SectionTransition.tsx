import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./section-transition.css";

type Section = { id: string; number: string; label: string };

const sections: Section[] = [
  { id: "hero", number: "01", label: "HOME" },
  { id: "projects", number: "02", label: "SELECTED WORK" },
  { id: "experience", number: "03", label: "EXPERIENCE" },
  { id: "capabilities", number: "04", label: "CAPABILITIES" },
  { id: "about", number: "05", label: "ABOUT" },
  { id: "contact", number: "06", label: "CONTACT" },
];

const ease = [0.22, 1, 0.36, 1] as const;

function getActiveSection(): Section {
  const point = window.scrollY + window.innerHeight * 0.42;
  let active = sections[0];

  for (const section of sections) {
    const element = document.getElementById(section.id);
    if (element && element.getBoundingClientRect().top + window.scrollY <= point) {
      active = section;
    }
  }

  return active;
}

function SectionTransition() {
  const [active, setActive] = useState(sections[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const previousId = useRef(sections[0].id);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setEasterEggOpen(false);
        return;
      }

      // Keep the easter egg non-essential and ignore it while typing.
      const target = event.target as HTMLElement | null;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (
        event.key.toLowerCase() === "a" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault();
        setEasterEggOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const update = () => {
      const next = getActiveSection();
      setActive(next);

      if (next.id !== previousId.current) {
        previousId.current = next.id;
        setIsTransitioning(true);

        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
          setIsTransitioning(false);
        }, 720);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="section-transition" aria-hidden={easterEggOpen ? undefined : "true"}>
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key={`${active.id}-transition`}
            className="section-transition-wipe"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.72, times: [0, 0.16, 1], ease }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="section-transition-progress"
        animate={{ scaleX: (sections.findIndex((section) => section.id === active.id) + 1) / sections.length }}
        transition={{ duration: 0.5, ease }}
      />

      <div className={`section-transition-label ${isTransitioning ? "is-transitioning" : ""}`}>
        <span>{active.number}</span>
        <span>/</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={active.id}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -7 }}
            transition={{ duration: 0.28, ease }}
          >
            {active.label}
          </motion.span>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {easterEggOpen && (
          <motion.div
            className="portfolio-easter-egg"
            role="dialog"
            aria-modal="true"
            aria-label="ARJUN.OS terminal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease }}
            onClick={() => setEasterEggOpen(false)}
          >
            <div className="portfolio-easter-egg-scanlines" />

            <motion.div
              className="portfolio-terminal"
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.985 }}
              transition={{ duration: 0.42, ease }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="portfolio-terminal-topbar">
                <div className="portfolio-terminal-lights" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <span>ARJUN.OS / TERMINAL</span>
                <button type="button" onClick={() => setEasterEggOpen(false)} aria-label="Close terminal">
                  ESC
                </button>
              </div>

              <div className="portfolio-terminal-screen">
                <div className="portfolio-terminal-prompt">ARJUN.OS</div>
                <p><span>&gt;</span> whoami</p>
                <strong>ARJUN AJITHAN</strong>

                <p><span>&gt;</span> skills</p>
                <div className="portfolio-terminal-skills">
                  <span>PYTHON</span>
                  <span>REACT</span>
                  <span>AI</span>
                  <span>FLUTTER</span>
                  <span>SUPABASE</span>
                  <span>NETWORKING</span>
                </div>

                <p><span>&gt;</span> status</p>
                <strong className="portfolio-terminal-status">AVAILABLE_FOR_OPPORTUNITIES</strong>

                <p className="portfolio-terminal-cursor-line"><span>&gt;</span> <b>_</b></p>
              </div>

              <div className="portfolio-terminal-footer">
                <span>SECRET LAYER // 01</span>
                <span>PRESS ESC TO EXIT</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SectionTransition;
