import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";

const firstName = "ARJUN";
const lastName = "AJITHAN";
const ease = [0.22, 1, 0.36, 1] as const;

function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const titleX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const titleY = useTransform(smoothY, [-1, 1], [-12, 12]);
  const outlineX = useTransform(smoothX, [-1, 1], [12, -12]);
  const outlineY = useTransform(smoothY, [-1, 1], [8, -8]);
  const orbX = useTransform(smoothX, [-1, 1], [-35, 35]);
  const orbY = useTransform(smoothY, [-1, 1], [-25, 25]);
  const portraitX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const portraitY = useTransform(smoothY, [-1, 1], [-8, 8]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set((event.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section id="hero" className="hero hero-refined hero-dark">
      <div className="hero-refined-grid" aria-hidden="true" />
      <motion.div
        className="hero-refined-orb"
        style={{ x: orbX, y: orbY }}
        aria-hidden="true"
      />

      <motion.div
        className="hero-refined-portrait-wrap"
        initial={{ opacity: 0, scale: 1.04, x: 40 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.35, delay: 0.35, ease }}
        aria-hidden="true"
      >
        <motion.img
          src="/images/hero-portrait.jpg"
          alt=""
          className="hero-refined-portrait"
          style={{ x: portraitX, y: portraitY }}
        />
        <span className="hero-refined-portrait-vignette" />
      </motion.div>

      <motion.div
        className="hero-refined-coordinate"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.7, delay: 0.45, ease }}
      >
        <span>12.9716° N</span>
        <span>77.5946° E</span>
      </motion.div>

      <div className="hero-meta hero-refined-meta">
        <motion.span
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
        >
          PORTFOLIO / 2026
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.7, delay: 0.35, ease }}
        >
          INDIA
        </motion.span>
      </div>

      <div className="hero-content hero-refined-content">
        <motion.div
          className="hero-refined-intro-row"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.45, ease }}
        >
          <p className="hero-intro">MCA STUDENT · DEVELOPER · BUILDER</p>
          <span className="hero-refined-status hero-refined-status-desktop">
            <span className="hero-refined-status-dot" />
            BUILDING WITH INTENT
          </span>
        </motion.div>

        <motion.div
          className="hero-refined-discipline"
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 1.15, ease }}
          aria-hidden="true"
        >
          <span>//</span>
          <span>SOFTWARE</span>
          <span>WEB</span>
          <span>AI</span>
          <span>EXPERIMENTATION</span>
        </motion.div>

        <motion.div
          className="hero-title-wrapper"
          style={{ x: titleX, y: titleY }}
        >
          <h1 className="hero-title hero-solid" aria-label="Arjun">
            {firstName.split("").map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                initial={{ opacity: 0, y: 120, rotateX: 80 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.9, delay: 0.6 + index * 0.07, ease }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        <motion.div
          className="hero-title-wrapper hero-outline-wrapper"
          style={{ x: outlineX, y: outlineY }}
        >
          <h1 className="hero-title hero-outline" aria-hidden="true">
            {lastName.split("").map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                initial={{ opacity: 0, y: 120, rotateX: -80 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.9, delay: 0.9 + index * 0.07, ease }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        <motion.div
          className="hero-line hero-refined-line"
          initial={{ scaleX: 0, transformOrigin: "left" }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 1.2, delay: 1.45, ease }}
        />

        <motion.div
          className="hero-refined-keywords"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.7, delay: 1.65, ease }}
        >
          <span>SOFTWARE</span>
          <span>AI</span>
          <span>WEB</span>
          <span>EXPERIMENTATION</span>
        </motion.div>
      </div>

      <div className="hero-bottom hero-refined-bottom">
        <motion.div
          className="hero-refined-statement"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.8, delay: 1.55, ease }}
        >
          <span className="hero-refined-label">01 / INTRODUCTION</span>
          <p>
            Building practical digital experiences
            <br />
            across software, web & emerging technology.
          </p>
        </motion.div>

        <motion.a
          href="#projects"
          className="scroll-indicator hero-refined-scroll"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.8, delay: 1.8, ease }}
        >
          <span className="hero-refined-scroll-circle">
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={16} />
            </motion.span>
          </span>
          <span>SCROLL TO EXPLORE</span>
          <ArrowUpRight className="hero-refined-scroll-arrow" size={15} />
        </motion.a>
      </div>
    </section>
  );
}

export default Hero;
