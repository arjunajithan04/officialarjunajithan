import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const perspectives = [
  {
    id: "01",
    label: "APPROACH",
    title: "BUILD USEFUL.",
    text: "I like turning ideas into practical digital experiences that are clear, purposeful and easy to understand.",
  },
  {
    id: "02",
    label: "INTEREST",
    title: "STAY CURIOUS.",
    text: "My interests sit across software, web development, cloud and emerging technology — always looking for the next thing worth exploring.",
  },
  {
    id: "03",
    label: "MINDSET",
    title: "KEEP ADAPTING.",
    text: "Every project is an opportunity to learn something new, simplify a problem and become a better builder.",
  },
];

const About = () => {
  const [activePerspective, setActivePerspective] = useState(perspectives[0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 90,
    damping: 18,
    mass: 0.6,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 90,
    damping: 18,
    mass: 0.6,
  });

  const orbitX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const orbitY = useTransform(smoothY, [-1, 1], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = (event.clientY / window.innerHeight) * 2 - 1;

    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section
      id="about"
      className="about-section about-section-enhanced"
      onMouseMove={handleMouseMove}
    >
      <div className="about-container">
        <motion.div
          className="about-top enhanced-about-top"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <span>05 / ABOUT</span>
          <span>PERSON / PROCESS / PERSPECTIVE</span>
        </motion.div>

        <motion.div
          className="about-intro"
          initial={{ opacity: 0, y: 55 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <h2>
            I LIKE TO
            <span>BUILD THINGS</span>
            THAT MATTER.
          </h2>
        </motion.div>

        <div className="about-content about-content-enhanced">
          <motion.div
            className="about-visual"
            style={{ x: orbitX, y: orbitY }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="about-visual-inner">
              <div className="about-status">
                <span className="status-dot" />
                CURRENTLY BUILDING
              </div>

              <motion.div
                className="about-orbit orbit-one"
                style={{ x: useTransform(smoothX, [-1, 1], [-4, 4]) }}
              />
              <motion.div
                className="about-orbit orbit-two"
                style={{ y: useTransform(smoothY, [-1, 1], [4, -4]) }}
              />
              <motion.div
                className="about-orbit orbit-three"
                style={{
                  x: useTransform(smoothX, [-1, 1], [5, -5]),
                  y: useTransform(smoothY, [-1, 1], [-5, 5]),
                }}
              />

              <div className="about-grid-mark" />

              <div className="about-center about-center-enhanced">
                <img
                  src="/images/profile_pic.jpg"
                  alt="Arjun Ajithan"
                />
              </div>

              <span className="about-coordinate">
                12°58&apos;N<br />
                77°35&apos;E
              </span>

              <span className="about-visual-index">AA / 05</span>
            </div>
          </motion.div>

          <motion.div
            className="about-copy about-copy-enhanced"
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <p className="about-lead">
              I&apos;m interested in the space between technology and people —
              where good ideas become experiences that actually make sense.
            </p>

            <p>
              I&apos;m an MCA student, developer and builder who enjoys working
              across software, web and emerging technology. I care about
              understanding the problem first, then building something useful
              around it.
            </p>

            <p>
              I don&apos;t want every project to look or feel the same. I like
              experimenting with different ways to communicate an idea while
              keeping the final experience simple, functional and intentional.
            </p>

            <div className="about-signature">
              <span>ARJUN AJITHAN</span>
              <span>MCA / DEVELOPER / BUILDER</span>
            </div>
          </motion.div>
        </div>

        <div className="about-perspectives">
          <div className="about-perspectives-heading">
            <span>HOW I WORK</span>
            <span>SELECT A PERSPECTIVE</span>
          </div>

          <div className="about-perspectives-layout">
            <div className="about-perspective-list">
              {perspectives.map((perspective) => {
                const active = activePerspective.id === perspective.id;

                return (
                  <motion.button
                    key={perspective.id}
                    type="button"
                    className={`about-perspective ${
                      active ? "is-active" : ""
                    }`}
                    onMouseEnter={() => setActivePerspective(perspective)}
                    onFocus={() => setActivePerspective(perspective)}
                    onClick={() => setActivePerspective(perspective)}
                    whileHover={{ x: 8 }}
                  >
                    <span>{perspective.id}</span>
                    <strong>{perspective.label}</strong>
                    <ArrowUpRight size={20} />
                  </motion.button>
                );
              })}
            </div>

            <div className="about-perspective-detail">
              <AnimatePerspective perspective={activePerspective} />
            </div>
          </div>
        </div>

        <motion.div
          className="about-bottom-statement"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7 }}
        >
          <span>CURIOUS BY DEFAULT</span>
          <strong>GOOD WORK STARTS WITH A GOOD QUESTION.</strong>
          <span>05 / 06</span>
        </motion.div>
      </div>
    </section>
  );
};

const AnimatePerspective = ({
  perspective,
}: {
  perspective: (typeof perspectives)[number];
}) => {
  return (
    <motion.div
      key={perspective.id}
      className="about-perspective-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <span>{perspective.id} / {perspective.label}</span>
      <h3>{perspective.title}</h3>
      <p>{perspective.text}</p>
    </motion.div>
  );
};

export default About;
