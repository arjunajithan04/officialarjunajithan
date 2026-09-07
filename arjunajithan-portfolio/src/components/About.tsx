import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const textY = useTransform(
    scrollYProgress,
    [0, 1],
    [80, -80]
  );

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    [40, -40]
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section"
    >
      <div className="about-container">

        {/* TOP LABEL */}
        <div className="about-top">
          <span>05 / ABOUT</span>
          <span>BEYOND THE CODE</span>
        </div>

        {/* MAIN STATEMENT */}
        <div className="about-intro">
          <motion.h2 style={{ y: textY }}>
            I LIKE TO
            <span>BUILD THINGS</span>
            <span>THAT MATTER.</span>
          </motion.h2>
        </div>

        {/* CONTENT */}
        <div className="about-content">

          {/* VISUAL */}
          <motion.div
            className="about-visual"
            style={{ y: imageY }}
          >
            <div className="about-visual-inner">

              <div className="about-orbit orbit-one" />
              <div className="about-orbit orbit-two" />
              <div className="about-orbit orbit-three" />

              <div className="about-center">
                <img
                    src="/images/profile_pic.jpg"
                    alt="Arjun Ajithan"
                />
              </div>

              <div className="about-coordinate">
                10°N<br />
                76°E
              </div>

              <div className="about-status">
                <span className="status-dot" />
                AVAILABLE TO BUILD
              </div>

            </div>
          </motion.div>

          {/* TEXT */}
          <div className="about-copy">

            <p className="about-lead">
              I'm an MCA student and developer who enjoys
              turning ideas into practical digital
              experiences.
            </p>

            <p>
              My interests sit somewhere between software,
              web development, emerging technology and
              thoughtful interface design.
            </p>

            <p>
              I enjoy learning by building — experimenting
              with different technologies, understanding
              how things work and turning that knowledge
              into something useful.
            </p>

            <p>
              For me, good technology isn't just about
              writing code. It's about solving the right
              problem and creating something people can
              actually use.
            </p>

            <div className="about-signature">
              <span>ARJUN AJITHAN NADUKANDIYIL</span>
              <span>2026</span>
            </div>

          </div>
        </div>

        {/* PHILOSOPHY */}
        <div className="about-philosophy">

          <div className="about-philosophy-label">
            <span>MY APPROACH</span>
          </div>

          <div className="about-philosophy-text">
            <motion.p
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              initial={{
                opacity: 0,
                y: 40,
              }}
              viewport={{
                once: true,
                amount: 0.4,
              }}
              transition={{
                duration: 0.8,
              }}
            >
              LEARN.
              <span>BUILD.</span>
              <span>ITERATE.</span>
            </motion.p>
          </div>

        </div>

        {/* FOOTER */}
        <div className="about-footer">
          <span>CURIOUS BY DEFAULT</span>
          <span>ALWAYS BUILDING SOMETHING</span>
        </div>

      </div>
    </section>
  );
};

export default About;