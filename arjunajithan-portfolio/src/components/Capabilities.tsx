import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const capabilities = [
  {
    title: "PYTHON",
    category: "LANGUAGE",
  },
  {
    title: "JAVA",
    category: "LANGUAGE",
  },
  {
    title: "C",
    category: "LANGUAGE",
  },
  {
    title: "HTML / CSS / JS",
    category: "WEB",
  },
  {
    title: "FRONTEND DEVELOPMENT",
    category: "DEVELOPMENT",
  },
  {
    title: "RESPONSIVE DESIGN",
    category: "DEVELOPMENT",
  },
  {
    title: "REST APIs",
    category: "DEVELOPMENT",
  },
  {
    title: "GCP",
    category: "CLOUD",
  },
  {
    title: "MACHINE LEARNING",
    category: "AI / ML",
  },
  {
    title: "UI / UX",
    category: "DESIGN",
  },
];

const Capabilities = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(
    scrollYProgress,
    [0, 0.35],
    [100, 0]
  );

  const marqueeX = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "-18%"]
  );

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="capabilities-section"
    >
      <div className="capabilities-container">

        {/* HEADER */}
        <motion.div
          className="capabilities-header"
          style={{ y: headingY }}
        >
          <div className="capabilities-header-top">
            <span>03 / CAPABILITIES</span>
            <span>WHAT I WORK WITH</span>
          </div>

          <h2>
            I BUILD
            <span>WITH INTENT.</span>
          </h2>
        </motion.div>

        {/* MARQUEE */}
        <div className="capabilities-marquee">
          <motion.div
            className="capabilities-marquee-track"
            style={{ x: marqueeX }}
          >
            <span>PYTHON</span>
            <span>WEB</span>
            <span>AI / ML</span>
            <span>UI / UX</span>
            <span>GCP</span>
            <span>APIs</span>

            {/* Duplicate for seamless movement */}
            <span>PYTHON</span>
            <span>WEB</span>
            <span>AI / ML</span>
            <span>UI / UX</span>
            <span>GCP</span>
            <span>APIs</span>
          </motion.div>
        </div>

        {/* SKILLS */}
        <div className="capabilities-grid">
          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={capability.title}
              capability={capability}
              index={index}
            />
          ))}
        </div>

        {/* BOTTOM STATEMENT */}
        <div className="capabilities-bottom">
          <p>
            A practical approach to technology —
            combining development, design and
            problem solving to build useful digital
            experiences.
          </p>

          <span>01 — 10</span>
        </div>
      </div>
    </section>
  );
};

interface CapabilityCardProps {
  capability: {
    title: string;
    category: string;
  };
  index: number;
}

const CapabilityCard = ({
  capability,
  index,
}: CapabilityCardProps) => {
  return (
    <motion.div
      className="capability-card"
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
      }}
    >
      <div className="capability-card-top">
        <span>0{index + 1}</span>
        <span>{capability.category}</span>
      </div>

      <div className="capability-title">
        {capability.title}
      </div>

      <motion.div
        className="capability-arrow"
        whileHover={{
          x: 8,
          rotate: -45,
        }}
        transition={{
          duration: 0.2,
        }}
      >
        ↗
      </motion.div>
    </motion.div>
  );
};

export default Capabilities;