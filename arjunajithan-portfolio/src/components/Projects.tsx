import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState, type MouseEvent } from "react";

interface Project {
  number: string;
  year: string;
  title: string[];
  description: string;
  technologies: string;
  type: "tree" | "tax" | "dule";
}

const projects: Project[] = [
  {
    number: "01",
    year: "2026",
    title: ["E-COMMERCE", "CATEGORY TREE", "MANAGER"],
    description:
      "A dynamic category tree management interface for an e-commerce platform.",
    technologies: "HTML · CSS · JAVASCRIPT",
    type: "tree",
  },

  {
    number: "02",
    year: "2025",
    title: ["TAXSMART", "TAX-SAVING", "INFORMATION PORTAL"],
    description:
      "An information portal designed to make complex tax-saving information easier to understand.",
    technologies: "WEB TECHNOLOGIES",
    type: "tax",
  },

  {
    number: "03",
    year: "2024",
    title: ["DULE", "OFFLINE & ONLINE", "MESSAGING"],
    description:
      "A hybrid messaging system using Bluetooth Low Energy for communication in low-connectivity environments.",
    technologies: "BLE · WEB TECHNOLOGIES",
    type: "dule",
  },
];


/* ============================================
   PROJECT PREVIEW
============================================ */

function ProjectPreview({
  type,
}: {
  type: Project["type"];
}) {
  if (type === "tree") {
    return (
      <div className="preview-window preview-tree">

        <div className="preview-topbar">
          <span>Category Manager</span>
          <span>+</span>
        </div>

        <div className="tree-content">

          <div className="tree-node root">
            Electronics
          </div>

          <div className="tree-line" />

          <div className="tree-node">
            ↳ Computers
          </div>

          <div className="tree-node">
            ↳ Smartphones
          </div>

          <div className="tree-node">
            ↳ Accessories
          </div>

        </div>

      </div>
    );
  }


  if (type === "tax") {
    return (
      <div className="preview-window preview-tax">

        <div className="tax-header">
          <span>TaxSmart</span>
          <span>2025</span>
        </div>

        <div className="tax-circle">
          <span>₹</span>
        </div>

        <div className="tax-bars">

          <span style={{ width: "78%" }} />
          <span style={{ width: "54%" }} />
          <span style={{ width: "67%" }} />
          <span style={{ width: "42%" }} />

        </div>

        <div className="tax-label">
          TAX-SAVING INFORMATION
        </div>

      </div>
    );
  }


  return (
    <div className="preview-window preview-dule">

      <div className="dule-header">
        <span>DULE</span>

        <span className="dule-status">
          ● ONLINE
        </span>
      </div>

      <div className="dule-message">
        <span>Hey.</span>
      </div>

      <div className="dule-message received">
        <span>Can you hear me?</span>
      </div>

      <div className="dule-message">
        <span>BLE connection established.</span>
      </div>

      <div className="dule-footer">
        BLUETOOTH LOW ENERGY
      </div>

    </div>
  );
}


/* ============================================
   PROJECTS
============================================ */

function Projects() {

  const [activeProject, setActiveProject] =
    useState<Project | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 180,
    damping: 22,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 180,
    damping: 22,
  });


  const handleMouseMove = (
    event: MouseEvent
  ) => {
    mouseX.set(event.clientX + 25);
    mouseY.set(event.clientY + 25);
  };


  return (
    <section
      id="work"
      className="projects-section"
      onMouseMove={handleMouseMove}
    >

      {/* ======================================
          SECTION HEADER
      ======================================= */}

      <div className="projects-header">

        <div>
          <span className="section-index">
            02 / SELECTED WORK
          </span>
        </div>

        <p>
          A selection of things I've built,
          experimented with and explored.
        </p>

      </div>


      {/* ======================================
          PROJECT LIST
      ======================================= */}

      <div className="projects-list">

        {projects.map((project) => (

          <motion.a
            href={`#project-${project.number}`}
            className="project-row"
            key={project.number}

            onMouseEnter={() =>
              setActiveProject(project)
            }

            onMouseLeave={() =>
              setActiveProject(null)
            }

            whileHover={{
              x: 8,
            }}

            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            {/* NUMBER */}

            <div className="project-number">
              {project.number}
            </div>


            {/* MAIN INFORMATION */}

            <div className="project-main">

              <div className="project-title">

                {project.title.map(
                  (line, index) => (

                    <span key={index}>
                      {line}
                    </span>

                  )
                )}

              </div>

              <div className="project-description">
                {project.description}
              </div>

            </div>


            {/* YEAR */}

            <div className="project-year">
              {project.year}
            </div>


            {/* ARROW */}

            <div className="project-arrow">
              <ArrowUpRight size={25} />
            </div>

          </motion.a>

        ))}

      </div>


      {/* ======================================
          FLOATING PREVIEW
      ======================================= */}

      <motion.div
        className="project-preview"
        style={{
          x: smoothX,
          y: smoothY,
        }}

        animate={{
          opacity: activeProject ? 1 : 0,
          scale: activeProject ? 1 : 0.85,
        }}

        transition={{
          duration: 0.25,
        }}
      >

        {activeProject && (
          <ProjectPreview
            type={activeProject.type}
          />
        )}

      </motion.div>

    </section>
  );
}

export default Projects;