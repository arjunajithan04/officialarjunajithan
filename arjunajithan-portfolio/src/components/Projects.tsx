import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { supabase } from "../lib/supabase";

interface DatabaseProject {
  id: string;
  title: string;
  description: string | null;
  year: number | null;
  technologies: string | null;
  project_type: string | null;
  github_url: string | null;
  image_url: string | null;
  sort_order: number;
  content_status: "draft" | "published" | "archived";
}

interface Project {
  id: string;
  number: string;
  year: string;
  title: string[];
  description: string;
  technologies: string;
  type: "tree" | "tax" | "dule" | "generic";
  github: string;
  imageUrl: string;
}

function mapProjectType(value: string | null): Project["type"] {
  const type = (value ?? "").toLowerCase();

  if (type === "tree") return "tree";
  if (type === "tax") return "tax";
  if (type === "dule") return "dule";

  return "generic";
}

function formatTitle(title: string): string[] {
  const normalized = title.trim().toUpperCase();

  const knownTitles: Record<string, string[]> = {
    "E-COMMERCE CATEGORY TREE MANAGER": [
      "E-COMMERCE",
      "CATEGORY TREE",
      "MANAGER",
    ],
    "TAXSMART TAX-SAVING INFORMATION PORTAL": [
      "TAXSMART",
      "TAX-SAVING",
      "INFORMATION PORTAL",
    ],
    "DULE OFFLINE & ONLINE MESSAGING": [
      "DULE",
      "OFFLINE & ONLINE",
      "MESSAGING",
    ],
  };

  if (knownTitles[normalized]) {
    return knownTitles[normalized];
  }

  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length <= 3) return [normalized];

  const lines: string[] = [];
  const targetLines = Math.min(3, Math.ceil(words.length / 2));
  const wordsPerLine = Math.ceil(words.length / targetLines);

  for (let index = 0; index < words.length; index += wordsPerLine) {
    lines.push(words.slice(index, index + wordsPerLine).join(" "));
  }

  return lines.slice(0, 3);
}

function mapDatabaseProjects(rows: DatabaseProject[]): Project[] {
  return rows.map((row, index) => ({
    id: row.id,
    number: String(index + 1).padStart(2, "0"),
    year: row.year ? String(row.year) : "—",
    title: formatTitle(row.title),
    description: row.description ?? "",
    technologies: row.technologies ?? "—",
    type: mapProjectType(row.project_type),
    github: row.github_url ?? "",
    imageUrl: row.image_url ?? "",
  }));
}

function ProjectPreview({ type, imageUrl }: { type: Project["type"]; imageUrl?: string }) {
  if (imageUrl) {
    return (
      <div className="preview-window preview-image">
        <img src={imageUrl} alt="Project preview" />
        <span className="preview-image-label">PROJECT PREVIEW</span>
      </div>
    );
  }
  if (type === "tree") {
    return (
      <div className="preview-window preview-tree">
        <div className="preview-topbar">
          <span>Category Manager</span>
          <span>+</span>
        </div>

        <div className="tree-content">
          <div className="tree-node root">Electronics</div>
          <div className="tree-line" />
          <div className="tree-node">↳ Computers</div>
          <div className="tree-node">↳ Smartphones</div>
          <div className="tree-node">↳ Accessories</div>
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

        <div className="tax-label">TAX-SAVING INFORMATION</div>
      </div>
    );
  }

  if (type === "generic") {
    return (
      <div className="preview-window preview-generic">
        <div className="preview-topbar">
          <span>PROJECT PREVIEW</span>
          <span>+</span>
        </div>

        <div className="generic-content">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  return (
    <div className="preview-window preview-dule">
      <div className="dule-header">
        <span>DULE</span>
        <span className="dule-status">● ONLINE</span>
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

      <div className="dule-footer">BLUETOOTH LOW ENERGY</div>
    </div>
  );
}

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 180,
    damping: 22,
    mass: 0.6,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 180,
    damping: 22,
    mass: 0.6,
  });

  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      setLoading(true);
      setLoadError("");

      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, title, description, year, technologies, project_type, github_url, image_url, sort_order, content_status"
        )
        .eq("content_status", "published")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!mounted) return;

      if (error) {
        setLoadError("Unable to load selected work.");
        setProjects([]);
      } else {
        setProjects(mapDatabaseProjects((data ?? []) as DatabaseProject[]));
      }

      setLoading(false);
    };

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const updatedSelected = projects.find(
      (project) => project.id === selectedProject.id
    );

    if (updatedSelected) {
      setSelectedProject(updatedSelected);
    } else {
      setSelectedProject(null);
      document.body.style.overflow = "";
    }
  }, [projects, selectedProject]);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    mouseX.set(event.clientX + 28);
    mouseY.set(event.clientY + 28);
  };

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setActiveProject(null);
    document.body.style.overflow = "hidden";
  };

  const closeProject = () => {
    setSelectedProject(null);
    document.body.style.overflow = "";
  };

  const navigateProject = (direction: -1 | 1) => {
    if (!selectedProject) return;

    const currentIndex = projects.findIndex(
      (project) => project.id === selectedProject.id
    );
    const nextIndex = currentIndex + direction;

    if (nextIndex < 0 || nextIndex >= projects.length) return;

    setSelectedProject(projects[nextIndex]);
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <section
        id="projects"
        className="projects-section projects-section-enhanced"
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="projects-header projects-header-enhanced"
          initial={{ opacity: 0, y: 42 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className="section-index">02 / SELECTED WORK</span>

            <motion.div
              className="projects-counter"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              {String(projects.length).padStart(2, "0")} PROJECTS
            </motion.div>
          </div>

          <p>
            A selection of things I&apos;ve built, experimented with and
            explored.
          </p>
        </motion.div>

        {loading ? (
          <div className="projects-data-state">LOADING SELECTED WORK...</div>
        ) : loadError ? (
          <div className="projects-data-state">{loadError}</div>
        ) : projects.length === 0 ? (
          <div className="projects-data-state">NO PROJECTS PUBLISHED.</div>
        ) : (
          <div className="projects-list projects-list-enhanced">
            {projects.map((project, index) => (
              <motion.button
                type="button"
                className="project-row project-row-enhanced"
                key={project.id}
                onMouseEnter={() => setActiveProject(project)}
                onMouseLeave={() => setActiveProject(null)}
                onClick={() => openProject(project)}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                whileHover={{ x: 8 }}
                transition={{
                  opacity: { duration: 0.55, delay: index * 0.08 },
                  y: { duration: 0.55, delay: index * 0.08 },
                  x: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                }}
                aria-label={`Open ${project.title.join(" ")}`}
              >
                <div className="project-number project-number-enhanced">
                  <span>{project.number}</span>
                  <span className="project-index-dot" />
                </div>

                <div className="project-main">
                  <div className="project-title project-title-enhanced">
                    {project.title.map((line, lineIndex) => (
                      <span key={lineIndex}>{line}</span>
                    ))}
                  </div>

                  <div className="project-description">
                    {project.description}
                  </div>

                  <div className="project-meta-row">
                    <span>{project.technologies}</span>
                    <span className="project-open-label">
                      VIEW PROJECT <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>

                <div className="project-year project-year-enhanced">
                  {project.year}
                </div>

                <div className="project-arrow project-arrow-enhanced">
                  <ArrowUpRight size={25} />
                </div>

                <motion.div
                  className="project-hover-line"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.45 }}
                />
              </motion.button>
            ))}
          </div>
        )}

        <motion.div
          className="project-preview project-preview-enhanced"
          style={{ x: smoothX, y: smoothY }}
          animate={{
            opacity: activeProject ? 1 : 0,
            scale: activeProject ? 1 : 0.82,
            rotate: activeProject ? 0 : -3,
          }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="preview-label">LIVE PREVIEW</div>

          {activeProject && <ProjectPreview type={activeProject.type} imageUrl={activeProject.imageUrl} />}
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="project-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProject}
          >
            <motion.div
              className="project-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`${selectedProject.title.join(" ")} project details`}
              initial={{ opacity: 0, y: 45, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 25, scale: 0.98 }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="project-modal-top">
                <span>PROJECT / {selectedProject.number}</span>
                <button
                  type="button"
                  className="project-modal-close"
                  onClick={closeProject}
                  aria-label="Close project details"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="project-modal-content">
                <div className="project-modal-preview">
                  <ProjectPreview type={selectedProject.type} imageUrl={selectedProject.imageUrl} />
                </div>

                <div className="project-modal-details">
                  <span className="project-modal-year">
                    {selectedProject.year}
                  </span>

                  <h2>
                    {selectedProject.title.map((line, index) => (
                      <span key={index}>{line}</span>
                    ))}
                  </h2>

                  <p>{selectedProject.description}</p>

                  <div className="project-modal-tech">
                    <span>BUILT WITH</span>
                    <strong>{selectedProject.technologies}</strong>
                  </div>

                  <div className="project-modal-footer">
                    <span>SELECTED WORK</span>

                    <div
                      className="project-modal-navigation"
                      aria-label="Project navigation"
                    >
                      <button
                        type="button"
                        className="project-modal-nav-button"
                        onClick={() => navigateProject(-1)}
                        disabled={
                          selectedProject.id === projects[0]?.id
                        }
                        aria-label="Previous project"
                      >
                        <ArrowLeft size={14} />
                        PREV
                      </button>

                      <span className="project-modal-nav-count">
                        {selectedProject.number} /{" "}
                        {String(projects.length).padStart(2, "0")}
                      </span>

                      <button
                        type="button"
                        className="project-modal-nav-button"
                        onClick={() => navigateProject(1)}
                        disabled={
                          selectedProject.id ===
                          projects[projects.length - 1]?.id
                        }
                        aria-label="Next project"
                      >
                        NEXT
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    {selectedProject.github && (
                      <a
                        className="project-github-link"
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        aria-label={`View ${selectedProject.title.join(
                          " "
                        )} on GitHub`}
                      >
                        VIEW ON GITHUB
                        <ArrowUpRight size={14} />
                      </a>
                    )}

                    <span>ARJUN AJITHAN — 2026</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Projects;
