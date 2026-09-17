import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect } from "react";

const firstName = "ARJUN";
const lastName = "AJITHAN";
const ease = [0.22, 1, 0.36, 1] as const;

function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

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

  // Hero depth layer: subtle scroll-linked recession as the next section approaches.
  const heroParallaxY = useTransform(scrollYProgress, [0, 0.16], [0, -72]);
  const heroScale = useTransform(scrollYProgress, [0, 0.16], [1, 0.965]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.72]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.18], [0, 2.5]);

  // Independent depth movement for the existing visual layers.
  const gridX = useTransform(smoothX, [-1, 1], [4, -4]);
  const gridY = useTransform(smoothY, [-1, 1], [3, -3]);
  const orbScale = useTransform(smoothX, [-1, 1], [0.97, 1.03]);
  const portraitDepthY = useTransform(smoothY, [-1, 1], [-4, 4]);
  const portraitScale = useTransform(smoothX, [-1, 1], [1, 1.018]);
  const metaY = useTransform(scrollYProgress, [0, 0.16], [0, -18]);
  const metaOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0.7]);
  const contentY = useTransform(scrollYProgress, [0, 0.18], [0, -30]);
  const bottomY = useTransform(scrollYProgress, [0, 0.16], [0, -42]);
  const bottomOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0.55]);
  const heroFilter = useTransform(heroBlur, (value) => `blur(${value}px)`);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set((event.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.section
      id="hero"
      className="hero hero-refined hero-dark"
      style={{
        y: shouldReduceMotion ? 0 : heroParallaxY,
        scale: shouldReduceMotion ? 1 : heroScale,
        opacity: shouldReduceMotion ? 1 : heroOpacity,
        filter: shouldReduceMotion ? "blur(0px)" : heroFilter,
      }}
    >
      <motion.div
        className="hero-refined-grid"
        style={{
          x: shouldReduceMotion ? 0 : gridX,
          y: shouldReduceMotion ? 0 : gridY,
        }}
        aria-hidden="true"
      />
      <motion.div
        className="hero-refined-orb"
        style={{
          x: shouldReduceMotion ? 0 : orbX,
          y: shouldReduceMotion ? 0 : orbY,
          scale: shouldReduceMotion ? 1 : orbScale,
        }}
        aria-hidden="true"
      />

      <motion.div
        className="hero-refined-portrait-wrap"
        style={{ y: shouldReduceMotion ? 0 : portraitDepthY }}
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
          style={{
            x: shouldReduceMotion ? 0 : portraitX,
            y: shouldReduceMotion ? 0 : portraitY,
            scale: shouldReduceMotion ? 1 : portraitScale,
          }}
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
        <span>13°04'26.3"N</span>      
        <span>77°40'11.4"E</span>
      </motion.div>

      <motion.div
        className="hero-meta hero-refined-meta"
        style={{
          y: shouldReduceMotion ? 0 : metaY,
          opacity: shouldReduceMotion ? 1 : metaOpacity,
        }}
      >
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
      </motion.div>

      <motion.div
        className="hero-content hero-refined-content"
        style={{ y: shouldReduceMotion ? 0 : contentY }}
      >
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
      </motion.div>

      <motion.div
        className="hero-bottom hero-refined-bottom"
        style={{
          y: shouldReduceMotion ? 0 : bottomY,
          opacity: shouldReduceMotion ? 1 : bottomOpacity,
        }}
      >
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
              animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={16} />
            </motion.span>
          </span>
          <span>SCROLL TO EXPLORE</span>
          <ArrowUpRight className="hero-refined-scroll-arrow" size={15} />
        </motion.a>
      </motion.div>
    </motion.section>
  );
}

export default Hero;
