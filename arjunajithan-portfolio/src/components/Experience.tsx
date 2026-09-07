import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    year: "2026",
    period: "SEP — OCT 2026",
    company: "Hope Foundation",
    role: "AI with Python Intern",
    location: "India",
    number: "01",
  },
  {
    year: "2025",
    period: "JUL — SEP 2025",
    company: "Mannai Corporation",
    role: "Networking Intern",
    location: "Doha, Qatar",
    number: "02",
  },
  {
    year: "2024",
    period: "AUG — SEP 2024",
    company: "Prodigy InfoTech",
    role: "Web Development Intern",
    location: "Bangalore, India",
    number: "03",
  },
];

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.3], [80, 0]);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="experience-section"
    >
      <div className="experience-container">

        {/* Section Header */}
        <motion.div
          className="experience-header"
          style={{ y: headingY }}
        >
          <div className="experience-header-top">
            <span>02 / EXPERIENCE</span>
            <span>CAREER TIMELINE</span>
          </div>

          <h2>
            EXPERIENCE
            <span>THAT SHAPED ME.</span>
          </h2>
        </motion.div>

        {/* Experience Timeline */}
        <div className="experience-list">
          {experiences.map((experience, index) => (
            <ExperienceItem
              key={experience.company}
              experience={experience}
              index={index}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="experience-footer">
          <span>CONTINUOUSLY LEARNING</span>
          <span>BUILDING • EXPLORING • ADAPTING</span>
        </div>
      </div>
    </section>
  );
};

interface ExperienceItemProps {
  experience: {
    year: string;
    period: string;
    company: string;
    role: string;
    location: string;
    number: string;
  };
  index: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

const ExperienceItem = ({
  experience,
  index,
  scrollProgress,
}: ExperienceItemProps) => {
  const start = 0.15 + index * 0.2;
  const end = start + 0.25;

  const opacity = useTransform(
    scrollProgress,
    [start - 0.1, start, end, end + 0.1],
    [0.4, 1, 1, 0.4]
  );

  const x = useTransform(
    scrollProgress,
    [start - 0.1, start],
    [30, 0]
  );

  const scale = useTransform(
    scrollProgress,
    [start - 0.1, start, end, end + 0.1],
    [0.97, 1, 1, 0.97]
  );

  return (
    <motion.article
      className="experience-item"
      style={{
        opacity,
        x,
        scale,
      }}
    >
      <div className="experience-number">
        <span>{experience.number}</span>
      </div>

      <div className="experience-year">
        <span>{experience.year}</span>
      </div>

      <div className="experience-main">
        <h3>{experience.company}</h3>

        <div className="experience-role">
          {experience.role}
        </div>

        <div className="experience-location">
          {experience.location}
        </div>
      </div>

      <div className="experience-arrow">
        ↗
      </div>
    </motion.article>
  );
};
export default Experience;