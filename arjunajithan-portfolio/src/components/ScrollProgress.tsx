import { motion, useScroll, useSpring } from "framer-motion";
import "./ScrollProgress.css";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.18,
  });

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX, transformOrigin: "0% 50%" }}
      aria-hidden="true"
    />
  );
}

export default ScrollProgress;
