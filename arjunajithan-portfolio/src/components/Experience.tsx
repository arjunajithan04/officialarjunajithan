import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Experience {
  number: string;
  year: string;
  period: string;
  company: string;
  role: string;
  location: string;
  summary: string;
  details: string;
  tags: string[];
}

const experiences: Experience[] = [
  {
    number: "01",
    year: "2026",
    period: "SEP — OCT 2026",
    company: "Hope Foundation",
    role: "AI with Python Intern",
    location: "India",
    summary: "AI and Python internship experience.",
    details:
      "An AI-focused internship where Python forms the practical foundation for working with programming, data and machine-learning concepts.",
    tags: ["Python", "Artificial Intelligence", "Machine Learning", "Data"],
  },
  {
    number: "02",
    year: "2025",
    period: "JUL — SEP 2025",
    company: "Mannai Corporation",
    role: "Networking Intern",
    location: "Doha, Qatar",
    summary:
      "Exposure to network performance monitoring, connectivity troubleshooting and enterprise IT infrastructure operations.",
    details:
      "Worked around the operational side of enterprise networking, gaining practical exposure to network performance monitoring, connectivity troubleshooting and day-to-day IT infrastructure.",
    tags: [
      "Enterprise Networking",
      "Network Monitoring",
      "Troubleshooting",
      "IT Infrastructure",
    ],
  },
  {
    number: "03",
    year: "2024",
    period: "AUG — SEP 2024",
    company: "Prodigy InfoTech",
    role: "Web Development Intern",
    location: "Bangalore, India",
    summary:
      "Web development experience focused on building responsive browser-based interfaces.",
    details:
      "A web development internship focused on applying HTML, CSS and JavaScript to practical web interfaces, with attention to responsive layouts and frontend interaction.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive Design"],
  },
];

const Experience = () => {
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);

  useEffect(() => {
    if (!selectedExperience) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedExperience(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedExperience]);

  return (
    <>
      <section id="experience" className="experience-section">
        <div className="experience-container">
          <motion.div
            className="experience-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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

          <div className="experience-list experience-list-interactive">
            {experiences.map((experience, index) => (
              <motion.button
                key={experience.company}
                type="button"
                className="experience-item experience-item-interactive"
                onClick={() => setSelectedExperience(experience)}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ x: 8 }}
              >
                <div className="experience-number">
                  <span>{experience.number}</span>
                </div>

                <div className="experience-year">
                  <span>{experience.year}</span>
                </div>

                <div className="experience-main">
                  <h3>{experience.company}</h3>

                  <div className="experience-role">{experience.role}</div>

                  <div className="experience-location">
                    {experience.location}
                  </div>
                </div>

                <div className="experience-arrow experience-arrow-interactive">
                  <ArrowUpRight size={24} />
                </div>
              </motion.button>
            ))}
          </div>

          <div className="experience-footer">
            <span>CONTINUOUSLY LEARNING</span>
            <span>BUILDING • EXPLORING • ADAPTING</span>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedExperience && (
          <motion.div
            className="experience-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedExperience(null);
              }
            }}
          >
            <motion.div
              className="experience-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedExperience.company} experience`}
              initial={{ opacity: 0, y: 45, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 35, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="experience-modal-header">
                <div>
                  <span className="experience-modal-index">
                    {selectedExperience.number} / EXPERIENCE
                  </span>
                  <span className="experience-modal-period">
                    {selectedExperience.period}
                  </span>
                </div>

                <button
                  type="button"
                  className="experience-modal-close"
                  onClick={() => setSelectedExperience(null)}
                  aria-label="Close experience details"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="experience-modal-body">
                <div className="experience-modal-kicker">
                  {selectedExperience.role}
                </div>

                <h3>{selectedExperience.company}</h3>

                <p className="experience-modal-location">
                  {selectedExperience.location} · {selectedExperience.year}
                </p>

                <div className="experience-modal-rule" />

                <p className="experience-modal-summary">
                  {selectedExperience.summary}
                </p>

                <p className="experience-modal-details">
                  {selectedExperience.details}
                </p>

                <div className="experience-modal-tags">
                  {selectedExperience.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className="experience-modal-footer">
                <span>FOCUS / EXPOSURE</span>
                <span>{selectedExperience.company.toUpperCase()}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Experience;
