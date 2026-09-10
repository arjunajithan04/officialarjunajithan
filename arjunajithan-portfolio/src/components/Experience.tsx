import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface DatabaseExperience {
  id: string;
  company: string;
  role: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  summary: string | null;
  description: string | null;
  tags: string[] | null;
  sort_order: number;
}

interface Experience {
  id: string;
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

function formatMonth(value: string | null, fallback: string) {
  if (!value) return fallback;
  return new Date(`${value}T00:00:00`)
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();
}

function mapExperience(rows: DatabaseExperience[]): Experience[] {
  return rows.map((row, index) => ({
    id: row.id,
    number: String(index + 1).padStart(2, "0"),
    year: row.start_date
      ? new Date(`${row.start_date}T00:00:00`).getFullYear().toString()
      : "—",
    period: `${formatMonth(row.start_date, "—")} — ${
      row.is_current ? "PRESENT" : formatMonth(row.end_date, "—")
    }`,
    company: row.company,
    role: row.role,
    location: row.location ?? "—",
    summary: row.summary ?? row.description ?? "",
    details: row.description ?? row.summary ?? "",
    tags: row.tags ?? [],
  }));
}

const Experience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadExperiences = async () => {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("experiences")
        .select(
          "id, company, role, location, start_date, end_date, is_current, summary, description, tags, sort_order"
        )
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!mounted) return;

      if (fetchError) {
        setError("Unable to load experience.");
        setExperiences([]);
      } else {
        setExperiences(
          mapExperience((data ?? []) as DatabaseExperience[])
        );
      }

      setLoading(false);
    };

    loadExperiences();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedExperience) return;

    const current = experiences.find(
      (experience) => experience.id === selectedExperience.id
    );

    if (current) {
      setSelectedExperience(current);
    } else {
      setSelectedExperience(null);
    }
  }, [experiences, selectedExperience]);

  useEffect(() => {
    if (!selectedExperience) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedExperience(null);
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

          {loading ? (
            <div className="experience-data-state">LOADING EXPERIENCE...</div>
          ) : error ? (
            <div className="experience-data-state">{error}</div>
          ) : experiences.length === 0 ? (
            <div className="experience-data-state">NO EXPERIENCE PUBLISHED.</div>
          ) : (
            <div className="experience-list experience-list-interactive">
              {experiences.map((experience, index) => (
                <motion.button
                  key={experience.id}
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
          )}

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
              onMouseDown={(event) => event.stopPropagation()}
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
