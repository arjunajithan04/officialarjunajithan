import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

interface Capability {
  number: string;
  title: string;
  category: string;
  stack: string;
  description: string;
  applications: string[];
}

const capabilities: Capability[] = [
  {
    number: "01",
    title: "Python",
    category: "PROGRAMMING",
    stack: "PYTHON",
    description:
      "A practical programming foundation I use for problem-solving, automation, data work and exploring machine learning concepts.",
    applications: ["Problem Solving", "Automation", "Data Work", "ML Foundations"],
  },
  {
    number: "02",
    title: "Java",
    category: "PROGRAMMING",
    stack: "JAVA",
    description:
      "Object-oriented programming experience focused on building structured solutions and strengthening core software development concepts.",
    applications: ["OOP", "Application Logic", "Problem Solving", "Core Development"],
  },
  {
    number: "03",
    title: "C",
    category: "PROGRAMMING",
    stack: "C",
    description:
      "A foundation in procedural programming and computational thinking, with emphasis on understanding how software works at a fundamental level.",
    applications: ["Logic Building", "Algorithms", "Data Structures", "Foundations"],
  },
  {
    number: "04",
    title: "Frontend Development",
    category: "WEB",
    stack: "HTML · CSS · JAVASCRIPT",
    description:
      "I build responsive interfaces with a focus on clear structure, interaction and visual hierarchy rather than simply making pages functional.",
    applications: ["Responsive UI", "Interactions", "Layouts", "Web Interfaces"],
  },
  {
    number: "05",
    title: "Responsive Design",
    category: "WEB",
    stack: "HTML · CSS · UI",
    description:
      "Designing interfaces that adapt cleanly across screen sizes while keeping the experience intentional on both desktop and mobile.",
    applications: ["Mobile First", "Adaptive Layouts", "Visual Hierarchy", "Usability"],
  },
  {
    number: "06",
    title: "REST APIs",
    category: "WEB",
    stack: "API · HTTP · JSON",
    description:
      "Understanding how applications communicate with backend services and how APIs can connect interfaces with useful data and functionality.",
    applications: ["API Integration", "HTTP", "JSON", "Data Exchange"],
  },
  {
    number: "07",
    title: "Google Cloud",
    category: "CLOUD",
    stack: "GCP",
    description:
      "Cloud fundamentals backed by Google Cloud certification, with an interest in practical deployment, infrastructure and modern development workflows.",
    applications: ["Cloud Concepts", "DevOps", "Infrastructure", "Deployment"],
  },
  {
    number: "08",
    title: "Machine Learning",
    category: "AI / DATA",
    stack: "ML CONCEPTS · PYTHON",
    description:
      "Foundational machine learning knowledge developed through academic work, experimentation and practical Python-based model building.",
    applications: ["Model Building", "Classification", "Data Analysis", "Experimentation"],
  },
  {
    number: "09",
    title: "UI / UX",
    category: "DESIGN",
    stack: "WIREFRAMING · UX",
    description:
      "I approach interfaces from the user's perspective, using wireframing and visual structure to make complex functionality easier to understand.",
    applications: ["Wireframing", "User Flow", "Usability", "Interface Structure"],
  },
  {
    number: "10",
    title: "JavaScript",
    category: "WEB",
    stack: "JAVASCRIPT",
    description:
      "Using JavaScript to turn static interfaces into functional experiences, from small interactions to complete browser-based applications.",
    applications: ["DOM", "Interactions", "Application Logic", "Web Apps"],
  },
];

const Capabilities = () => {
  const [activeCapability, setActiveCapability] = useState<Capability>(
    capabilities[0]
  );

  return (
    <section id="capabilities" className="capabilities-section capabilities-enhanced">
      <div className="capabilities-container">
        <motion.div
          className="capabilities-header"
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="capabilities-header-top">
            <span>03 / CAPABILITIES</span>
            <span>TOOLS / THINKING / EXECUTION</span>
          </div>

          <h2>
            I BUILD
            <span>WITH INTENT.</span>
          </h2>
        </motion.div>

        <div className="capabilities-marquee" aria-hidden="true">
          <motion.div
            className="capabilities-marquee-track"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...capabilities, ...capabilities].map((capability, index) => (
              <span key={`${capability.number}-${index}`}>
                {capability.title.toUpperCase()}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="capabilities-showcase">
          <div className="capabilities-grid">
            {capabilities.map((capability, index) => {
              const isActive = activeCapability.number === capability.number;

              return (
                <motion.button
                  key={capability.number}
                  type="button"
                  className={`capability-card capability-card-enhanced ${
                    isActive ? "is-active" : ""
                  }`}
                  onMouseEnter={() => setActiveCapability(capability)}
                  onFocus={() => setActiveCapability(capability)}
                  onClick={() => setActiveCapability(capability)}
                  whileHover={{ x: index % 2 === 0 ? 8 : -8 }}
                  transition={{ duration: 0.3 }}
                  aria-label={`Explore ${capability.title}`}
                >
                  <div className="capability-card-top">
                    <span>{capability.number}</span>
                    <span>{capability.category}</span>
                  </div>

                  <div className="capability-title">{capability.title}</div>

                  <div className="capability-card-bottom">
                    <span>{capability.stack}</span>
                    <ArrowUpRight size={20} />
                  </div>

                  <motion.span
                    className="capability-active-line"
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    transition={{ duration: 0.35 }}
                  />
                </motion.button>
              );
            })}
          </div>

          <aside className="capability-detail" aria-live="polite">
            <div className="capability-detail-label">
              <span>ACTIVE CAPABILITY</span>
              <span>{activeCapability.number} / 10</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCapability.number}
                className="capability-detail-content"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.3 }}
              >
                <div className="capability-detail-category">
                  {activeCapability.category}
                </div>

                <h3>{activeCapability.title}</h3>

                <p>{activeCapability.description}</p>

                <div className="capability-applications">
                  {activeCapability.applications.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                <div className="capability-detail-footer">
                  <span>{activeCapability.stack}</span>
                  <span>EXPLORE / HOVER</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </aside>
        </div>

        <div className="capabilities-bottom">
          <p>
            I&apos;m most interested in the space where technology, usability
            and visual thinking meet — building practical digital experiences
            that are clear, useful and considered.
          </p>

          <span>BUILDING • EXPLORING • ADAPTING</span>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
