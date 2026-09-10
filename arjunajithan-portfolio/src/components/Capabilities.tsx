import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface DatabaseCapability {
  id: string;
  title: string;
  category: string | null;
  stack: string | null;
  description: string | null;
  applications: string[] | null;
  sort_order: number;
}

interface Capability {
  id: string;
  number: string;
  title: string;
  category: string;
  stack: string;
  description: string;
  applications: string[];
}

const fallbackCapability: Capability = {
  id: "fallback",
  number: "01",
  title: "Capability",
  category: "SKILL",
  stack: "—",
  description: "Explore the capabilities available on this portfolio.",
  applications: [],
};

function mapCapabilities(rows: DatabaseCapability[]): Capability[] {
  return rows.map((row, index) => ({
    id: row.id,
    number: String(index + 1).padStart(2, "0"),
    title: row.title,
    category: row.category ?? "SKILL",
    stack: row.stack ?? "—",
    description: row.description ?? "",
    applications: row.applications ?? [],
  }));
}

const Capabilities = () => {
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [activeCapability, setActiveCapability] =
    useState<Capability>(fallbackCapability);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadCapabilities = async () => {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("capabilities")
        .select(
          "id, title, category, stack, description, applications, sort_order"
        )
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!mounted) return;

      if (fetchError) {
        setError("Unable to load capabilities.");
        setCapabilities([]);
      } else {
        const mapped = mapCapabilities(
          (data ?? []) as DatabaseCapability[]
        );
        setCapabilities(mapped);
        if (mapped.length > 0) setActiveCapability(mapped[0]);
      }

      setLoading(false);
    };

    loadCapabilities();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!capabilities.length) return;

    const current = capabilities.find(
      (capability) => capability.id === activeCapability.id
    );

    if (current) {
      setActiveCapability(current);
    } else {
      setActiveCapability(capabilities[0]);
    }
  }, [capabilities, activeCapability.id]);

  return (
    <section
      id="capabilities"
      className="capabilities-section capabilities-enhanced"
    >
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

        {loading ? (
          <div className="capabilities-data-state">
            LOADING CAPABILITIES...
          </div>
        ) : error ? (
          <div className="capabilities-data-state">{error}</div>
        ) : capabilities.length === 0 ? (
          <div className="capabilities-data-state">
            NO CAPABILITIES PUBLISHED.
          </div>
        ) : (
          <>
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
                {[...capabilities, ...capabilities].map(
                  (capability, index) => (
                    <span key={`${capability.id}-${index}`}>
                      {capability.title.toUpperCase()}
                    </span>
                  )
                )}
              </motion.div>
            </div>

            <div className="capabilities-showcase">
              <div className="capabilities-grid">
                {capabilities.map((capability, index) => {
                  const isActive = activeCapability.id === capability.id;

                  return (
                    <motion.button
                      key={capability.id}
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

                      <div className="capability-title">
                        {capability.title}
                      </div>

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
                  <span>
                    {activeCapability.number} /{" "}
                    {String(capabilities.length).padStart(2, "0")}
                  </span>
                </div>

                <motion.div
                  key={activeCapability.id}
                  className="capability-detail-content"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
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
              </aside>
            </div>

            <div className="capabilities-bottom">
              <p>
                I&apos;m most interested in the space where technology,
                usability and visual thinking meet — building practical
                digital experiences that are clear, useful and considered.
              </p>

              <span>BUILDING • EXPLORING • ADAPTING</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Capabilities;
