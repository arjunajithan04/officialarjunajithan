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
        <span className="admin-status-dot" />
        VERIFYING ACCESS...
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-sidebar-brand">
            <a href="/" aria-label="Return to portfolio">
              AA
            </a>
            <span>ADMIN</span>
          </div>

          <div className="admin-user">
            <span className="admin-user-label">SIGNED IN AS</span>
            <span className="admin-user-email">{email}</span>
          </div>

          <nav className="admin-nav" aria-label="Admin navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`admin-nav-item ${
                  section === item.id ? "is-active" : ""
                }`}
                onClick={() => setSection(item.id)}
              >
                <span>{item.number}</span>
                <strong>{item.label}</strong>
              </button>
            ))}
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <a href="/" className="admin-back-link">
            VIEW SITE <ArrowUpRight size={14} />
          </a>
          <button className="admin-logout" onClick={signOut}>
            LOG OUT <LogOut size={14} />
          </button>
        </div>
      </aside>

      <section className="admin-content">
        <header className="admin-content-top">
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
        </header>

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
      </section>
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
      <div className="admin-overview-intro">
        <p>
          Your portfolio is connected to Supabase. The control modules below
          will become the single source of truth for your public website.
        </p>
        <span>
          <Settings2 size={14} /> CMS FOUNDATION READY
        </span>
      </div>

      <div className="admin-module-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <button
              key={card.section}
              className="admin-module-card"
              onClick={() => onNavigate(card.section)}
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
            </button>
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
