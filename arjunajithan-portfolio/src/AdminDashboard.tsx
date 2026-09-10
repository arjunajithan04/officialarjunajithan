import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FolderKanban,
  LogOut,
  Pencil,
  Settings2,
  Sparkles,
  UserRound,
} from "lucide-react";
import { supabase } from "./lib/supabase";
import ProjectsManager from "./ProjectsManager";
import ExperienceManager from "./ExperienceManager";
import CapabilitiesManager from "./CapabilitiesManager";
import AboutManager from "./AboutManager";
import ContactManager from "./ContactManager";
import "./admin.css";

type AdminSection =
  | "overview"
  | "projects"
  | "experience"
  | "capabilities"
  | "about"
  | "contact";

const adminEase = [0.22, 1, 0.36, 1] as const;

const navItems: { id: AdminSection; label: string; number: string }[] = [
  { id: "overview", label: "OVERVIEW", number: "00" },
  { id: "projects", label: "PROJECTS", number: "01" },
  { id: "experience", label: "EXPERIENCE", number: "02" },
  { id: "capabilities", label: "CAPABILITIES", number: "03" },
  { id: "about", label: "ABOUT", number: "04" },
  { id: "contact", label: "CONTACT", number: "05" },
];

export default function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>("overview");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!data.user) {
        window.location.href = "/admin/login";
        return;
      }

      const adminId = import.meta.env.VITE_SUPABASE_ADMIN_USER_ID;

      if (adminId && data.user.id !== adminId) {
        await supabase.auth.signOut();
        window.location.href = "/admin/login";
        return;
      }

      setEmail(data.user.email ?? "");
      setLoading(false);
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <main className="admin-loading">
        <motion.div
          className="admin-loading-mark"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: adminEase }}
        />
        <motion.div
          className="admin-loading-copy"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: adminEase }}
        >
          <span className="admin-status-dot" />
          VERIFYING ACCESS...
        </motion.div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <motion.aside
        className="admin-sidebar"
        initial={{ x: -32, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: adminEase }}
      >
        <div>
          <motion.div
            className="admin-sidebar-brand"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.55, ease: adminEase }}
          >
            <a href="/" aria-label="Return to portfolio">
              AA
            </a>
            <span>ADMIN</span>
          </motion.div>

          <motion.div
            className="admin-user"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.55, ease: adminEase }}
          >
            <span className="admin-user-label">SIGNED IN AS</span>
            <span className="admin-user-email">{email}</span>
          </motion.div>

          <nav className="admin-nav" aria-label="Admin navigation">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                className={`admin-nav-item ${
                  section === item.id ? "is-active" : ""
                }`}
                onClick={() => setSection(item.id)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.34 + index * 0.055, duration: 0.45, ease: adminEase }}
              >
                <span>{item.number}</span>
                <strong>{item.label}</strong>
              </motion.button>
            ))}
          </nav>
        </div>

        <motion.div
          className="admin-sidebar-bottom"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.5, ease: adminEase }}
        >
          <a href="/" className="admin-back-link">
            VIEW SITE <ArrowUpRight size={14} />
          </a>
          <button className="admin-logout" onClick={signOut}>
            LOG OUT <LogOut size={14} />
          </button>
        </motion.div>
      </motion.aside>

      <motion.section
        className="admin-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12, duration: 0.7, ease: adminEase }}
      >
        <motion.header
          className="admin-content-top"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: adminEase }}
        >
          <div>
            <span className="admin-eyebrow">PORTFOLIO CMS / 2026</span>
            <h1>
              {section === "overview"
                ? "Control room."
                : `${section.charAt(0).toUpperCase()}${section.slice(1)}.`}
            </h1>
          </div>

          <div className="admin-live-status">
            <span className="admin-status-dot" />
            LIVE DATABASE
          </div>
        </motion.header>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={section}
            className="admin-section-stage"
            initial={{ opacity: 0, y: 22, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(3px)" }}
            transition={{ duration: 0.55, ease: adminEase }}
          >
        {section === "overview" ? (
          <Overview onNavigate={setSection} />
        ) : section === "projects" ? (
          <ProjectsManager />
        ) : (
          section === "experience" ? (
            <ExperienceManager />
          ) : (
            section === "capabilities" ? (
              <CapabilitiesManager />
            ) : (
              section === "about" ? (
                <AboutManager />
              ) : (
                section === "contact" ? (
                  <ContactManager />
                ) : (
                  <ComingSoonSection section={section} />
                )
              )
            )
          )
        )}
          </motion.div>
        </AnimatePresence>
      </motion.section>
    </main>
  );
}

function Overview({
  onNavigate,
}: {
  onNavigate: (section: AdminSection) => void;
}) {
  const cards = [
    {
      number: "01",
      title: "PROJECTS",
      description: "Create, edit and reorder the work shown on your portfolio.",
      icon: FolderKanban,
      section: "projects" as AdminSection,
    },
    {
      number: "02",
      title: "EXPERIENCE",
      description: "Keep your internships and professional timeline current.",
      icon: BriefcaseBusiness,
      section: "experience" as AdminSection,
    },
    {
      number: "03",
      title: "CAPABILITIES",
      description: "Control the skills and descriptions presented on your site.",
      icon: Sparkles,
      section: "capabilities" as AdminSection,
    },
    {
      number: "04",
      title: "ABOUT",
      description: "Update your introduction, status and profile information.",
      icon: UserRound,
      section: "about" as AdminSection,
    },
    {
      number: "05",
      title: "CONTACT",
      description: "Manage email, social links and availability messaging.",
      icon: Pencil,
      section: "contact" as AdminSection,
    },
  ];

  return (
    <>
      <motion.div
        className="admin-overview-intro"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.6, ease: adminEase }}
      >
        <p>
          Your portfolio is connected to Supabase. The control modules below
          will become the single source of truth for your public website.
        </p>
        <span>
          <Settings2 size={14} /> CMS FOUNDATION READY
        </span>
      </motion.div>

      <div className="admin-module-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <motion.button
              key={card.section}
              className="admin-module-card"
              onClick={() => onNavigate(card.section)}
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 + Number(card.number) * 0.07, duration: 0.65, ease: adminEase }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="admin-module-card-top">
                <span>{card.number}</span>
                <Icon size={18} strokeWidth={1.4} />
              </div>

              <div className="admin-module-card-bottom">
                <h2>{card.title}</h2>
                <p>{card.description}</p>
                <span className="admin-module-open">
                  MANAGE <ArrowUpRight size={13} />
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}

function ComingSoonSection({ section }: { section: AdminSection }) {
  return (
    <div className="admin-empty-module">
      <span>MODULE {navItems.find((item) => item.id === section)?.number}</span>
      <h2>{section.toUpperCase()} MANAGER</h2>
      <p>
        The authenticated CMS shell is ready. This module is the next CRUD
        layer we will connect to the corresponding Supabase table.
      </p>
    </div>
  );
}
