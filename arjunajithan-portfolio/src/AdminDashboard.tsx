import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  BriefcaseBusiness,
  FolderKanban,
  LogOut,
  Search,
  X,
  Pencil,
  Settings2,
  Sparkles,
  Database,
  Plus,
  RefreshCw,
  UserRound,
  Images,
  SlidersHorizontal,
} from "lucide-react";
import { supabase } from "./lib/supabase";
import ProjectsManager from "./ProjectsManager";
import ExperienceManager from "./ExperienceManager";
import CapabilitiesManager from "./CapabilitiesManager";
import AboutManager from "./AboutManager";
import ContactManager from "./ContactManager";
import MediaManager from "./MediaManager";
import ActivityManager from "./ActivityManager";
import SiteSettingsManager from "./SiteSettingsManager";
import ContentIntelligenceManager from "./ContentIntelligenceManager";
import "./admin.css";

type GlobalSearchResult = {
  id: string;
  section: AdminSection;
  type: string;
  title: string;
  detail: string;
};

type AdminSection =
  | "overview"
  | "projects"
  | "experience"
  | "capabilities"
  | "about"
  | "contact"
  | "media"
  | "activity"
  | "settings"
  | "intelligence";

const adminEase = [0.22, 1, 0.36, 1] as const;

const navItems: { id: AdminSection; label: string; number: string }[] = [
  { id: "overview", label: "OVERVIEW", number: "00" },
  { id: "projects", label: "PROJECTS", number: "01" },
  { id: "experience", label: "EXPERIENCE", number: "02" },
  { id: "capabilities", label: "CAPABILITIES", number: "03" },
  { id: "about", label: "ABOUT", number: "04" },
  { id: "contact", label: "CONTACT", number: "05" },
  { id: "media", label: "MEDIA", number: "06" },
  { id: "activity", label: "ACTIVITY", number: "07" },
  { id: "settings", label: "SETTINGS", number: "08" },
  { id: "intelligence", label: "INTELLIGENCE", number: "09" },
];

export default function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>("overview");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<GlobalSearchResult[]>([]);
  const [contentHealth, setContentHealth] = useState(100);
  const [contentHealthLoading, setContentHealthLoading] = useState(true);

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

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = Boolean(
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      );

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }

      if (!isTyping && event.key === "/") {
        event.preventDefault();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;

    let cancelled = false;

    const loadSearchIndex = async () => {
      setSearchLoading(true);
      const [projects, experiences, capabilities, perspectives] = await Promise.all([
        supabase.from("projects").select("id, title, description, project_type"),
        supabase.from("experiences").select("id, company, role, summary, description"),
        supabase.from("capabilities").select("id, title, category, stack, description"),
        supabase.from("about_perspectives").select("id, label, title, text"),
      ]);

      if (cancelled) return;

      const results: GlobalSearchResult[] = [
        ...(projects.data ?? []).map((item) => ({
          id: String(item.id),
          section: "projects" as AdminSection,
          type: "PROJECT",
          title: item.title ?? "Untitled project",
          detail: [item.project_type, item.description].filter(Boolean).join(" · "),
        })),
        ...(experiences.data ?? []).map((item) => ({
          id: String(item.id),
          section: "experience" as AdminSection,
          type: "EXPERIENCE",
          title: item.company ?? "Untitled experience",
          detail: [item.role, item.summary, item.description].filter(Boolean).join(" · "),
        })),
        ...(capabilities.data ?? []).map((item) => ({
          id: String(item.id),
          section: "capabilities" as AdminSection,
          type: "CAPABILITY",
          title: item.title ?? "Untitled capability",
          detail: [item.category, item.stack, item.description].filter(Boolean).join(" · "),
        })),
        ...(perspectives.data ?? []).map((item) => ({
          id: String(item.id),
          section: "about" as AdminSection,
          type: "ABOUT",
          title: item.title ?? item.label ?? "Untitled perspective",
          detail: [item.label, item.text].filter(Boolean).join(" · "),
        })),
      ];

      setSearchResults(results);
      setSearchLoading(false);
    };

    void loadSearchIndex();

    return () => {
      cancelled = true;
    };
  }, [searchOpen]);

  const filteredSearchResults = searchResults
    .filter((result) => {
      const haystack = `${result.title} ${result.detail} ${result.type}`.toLowerCase();
      return haystack.includes(searchQuery.trim().toLowerCase());
    })
    .slice(0, 12);

  const loadContentHealth = async () => {
    setContentHealthLoading(true);
    const [projects, experience, capabilities, about] = await Promise.all([
      supabase.from("projects").select("title, description, technologies, project_type, github_url, image_url, content_status"),
      supabase.from("experiences").select("company, role, location, start_date, end_date, is_current, summary, description, tags"),
      supabase.from("capabilities").select("title, category, stack, description"),
      supabase.from("about_perspectives").select("label, title, text"),
    ]);

    const checks: boolean[] = [];
    for (const item of projects.data ?? []) {
      checks.push(Boolean(item.title?.trim()), Boolean(item.description?.trim()), Boolean(item.technologies?.trim()), Boolean(item.project_type?.trim()), Boolean(item.github_url?.trim()), Boolean(item.image_url?.trim()), Boolean(item.content_status));
    }
    for (const item of experience.data ?? []) {
      checks.push(Boolean(item.company?.trim()), Boolean(item.role?.trim()), Boolean(item.location?.trim()), Boolean(item.start_date), Boolean(item.is_current || item.end_date), Boolean(item.summary?.trim()), Boolean(item.description?.trim()), Array.isArray(item.tags) && item.tags.length > 0);
    }
    for (const item of capabilities.data ?? []) {
      checks.push(Boolean(item.title?.trim()), Boolean(item.category?.trim()), Boolean(item.stack?.trim()), Boolean(item.description?.trim()));
    }
    for (const item of about.data ?? []) {
      checks.push(Boolean(item.label?.trim()), Boolean(item.title?.trim()), Boolean(item.text?.trim()));
    }

    setContentHealth(checks.length ? Math.round((checks.filter(Boolean).length / checks.length) * 100) : 100);
    setContentHealthLoading(false);
  };

  useEffect(() => {
    void loadContentHealth();
  }, []);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning, Arjun.";
    if (hour < 17) return "Good Afternoon, Arjun.";
    return "Good Evening, Arjun.";
  })();

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
              <img
                src="/images/logo27.ico"
                alt="Arjun Ajithan"
                className="nav-logo-image"
              />
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
          <div className="admin-header-heading">
            <span className="admin-eyebrow">{section === "overview" ? "WELCOME BACK" : "PORTFOLIO CMS / 2026"}</span>
            <h1>
              {section === "overview"
                ? greeting
                : `${section.charAt(0).toUpperCase()}${section.slice(1)}.`}
            </h1>
          </div>

          {section === "overview" ? (
            <button
              type="button"
              className="admin-header-health"
              onClick={() => setSection("intelligence")}
              aria-label={`Open Intelligence. Content health ${contentHealth}%`}
            >
              <div
                className="admin-header-health-ring"
                style={{ "--health": `${contentHealth}%` } as React.CSSProperties}
              >
                <strong>{contentHealthLoading ? "—" : `${contentHealth}%`}</strong>
                <span>HEALTH</span>
              </div>
              <span className="admin-header-health-label">CONTENT HEALTH</span>
              <span className="admin-header-health-link">OPEN INTELLIGENCE <ArrowUpRight size={11} /></span>
            </button>
          ) : (
            <div className="admin-live-status">
              <span className="admin-status-dot" />
              LIVE DATABASE
            </div>
          )}
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
          <Overview onNavigate={setSection} onRefreshHealth={loadContentHealth} />
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
                  section === "media" ? (
                    <MediaManager />
                  ) : section === "activity" ? (
                    <ActivityManager />
                  ) : section === "settings" ? (
                    <SiteSettingsManager />
                  ) : section === "intelligence" ? (
                    <ContentIntelligenceManager />
                  ) : (
                    <ComingSoonSection section={section} />
                  )
                )
              )
            )
          )
        )}
          </motion.div>
        </AnimatePresence>
      </motion.section>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="admin-command-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSearchOpen(false);
            }}
          >
            <motion.div
              className="admin-command-palette"
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.985 }}
              transition={{ duration: 0.28, ease: adminEase }}
              role="dialog"
              aria-modal="true"
              aria-label="Global CMS search"
            >
              <div className="admin-command-search">
                <Search size={17} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search projects, experience, capabilities..."
                />
                <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
                  <X size={16} />
                </button>
              </div>

              <div className="admin-command-meta">
                <span>GLOBAL CMS SEARCH</span>
                <kbd>ESC</kbd>
              </div>

              <div className="admin-command-results">
                {searchLoading ? (
                  <div className="admin-command-state">INDEXING CONTENT...</div>
                ) : filteredSearchResults.length === 0 ? (
                  <div className="admin-command-state">NO MATCHES FOUND.</div>
                ) : (
                  filteredSearchResults.map((result) => (
                    <button
                      type="button"
                      className="admin-command-result"
                      key={`${result.section}-${result.id}`}
                      onClick={() => {
                        setSection(result.section);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <span className="admin-command-result-type">{result.type}</span>
                      <span className="admin-command-result-copy">
                        <strong>{result.title}</strong>
                        <small>{result.detail || "Open content module"}</small>
                      </span>
                      <ArrowRight size={14} />
                    </button>
                  ))
                )}
              </div>

              <footer className="admin-command-footer">
                <span><kbd>↑</kbd><kbd>↓</kbd> NAVIGATE</span>
                <span><kbd>ENTER</kbd> OPEN MODULE</span>
                <span><kbd>⌘</kbd><kbd>K</kbd> TO SEARCH</span>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Overview({
  onNavigate,
  onRefreshHealth,
}: {
  onNavigate: (section: AdminSection) => void;
  onRefreshHealth: () => Promise<void>;
}) {
  type StatKey = "projects" | "experience" | "capabilities" | "about";
  type Stats = Record<StatKey, number>;

  const [stats, setStats] = useState<Stats>({
    projects: 0,
    experience: 0,
    capabilities: 0,
    about: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  const loadStats = async () => {
    setStatsLoading(true);
    setStatsError(false);

    const results = await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("experiences").select("id", { count: "exact", head: true }),
      supabase.from("capabilities").select("id", { count: "exact", head: true }),
      supabase.from("about_perspectives").select("id", { count: "exact", head: true }),
    ]);

    const hasError = results.some(({ error }) => Boolean(error));

    if (hasError) {
      setStatsError(true);
      setStatsLoading(false);
      return;
    }

    setStats({
      projects: results[0].count ?? 0,
      experience: results[1].count ?? 0,
      capabilities: results[2].count ?? 0,
      about: results[3].count ?? 0,
    });
    setStatsLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const totalRecords = Object.values(stats).reduce((sum, value) => sum + value, 0);

  const statCards: {
    key: StatKey;
    label: string;
    number: string;
    section: AdminSection;
  }[] = [
    { key: "projects", label: "PROJECTS", number: "01", section: "projects" },
    { key: "experience", label: "EXPERIENCE", number: "02", section: "experience" },
    { key: "capabilities", label: "CAPABILITIES", number: "03", section: "capabilities" },
    { key: "about", label: "ABOUT PERSPECTIVES", number: "04", section: "about" },
  ];

  const modules = [
    {
      number: "05",
      title: "CONTACT",
      description: "Manage email, social links and availability messaging.",
      icon: Pencil,
      section: "contact" as AdminSection,
    },
    {
      number: "06",
      title: "MEDIA",
      description: "Store, preview and reuse the visual assets powering your portfolio.",
      icon: Images,
      section: "media" as AdminSection,
    },
    {
      number: "07",
      title: "ACTIVITY",
      description: "Review changes and inspect immutable content revision snapshots.",
      icon: Database,
      section: "activity" as AdminSection,
    },
    {
      number: "08",
      title: "SETTINGS",
      description: "Control global identity, SEO and portfolio configuration from one place.",
      icon: SlidersHorizontal,
      section: "settings" as AdminSection,
    },
    {
      number: "09",
      title: "INTELLIGENCE",
      description: "Check content completeness and surface entries that need cleanup.",
      icon: Sparkles,
      section: "intelligence" as AdminSection,
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
        <div>
          <p>
            Your portfolio is connected to Supabase. This dashboard gives you
            a quick read on the content powering the public website.
          </p>
          <span className="admin-overview-foundation">
            <Settings2 size={14} /> CMS FOUNDATION READY
          </span>
        </div>

        <button
          className="admin-refresh-button"
          type="button"
          onClick={() => { void loadStats(); void onRefreshHealth(); }}
          disabled={statsLoading}
        >
          <RefreshCw size={13} className={statsLoading ? "is-spinning" : ""} />
          REFRESH DATA
        </button>
      </motion.div>

      <section className="admin-control-summary" aria-label="CMS summary">
        <div className="admin-summary-heading">
          <div>
            <span className="admin-section-label">CMS / CONTENT</span>
            <h2>Portfolio status.</h2>
          </div>
          <span className="admin-record-count">
            {statsLoading ? "SYNCING..." : `${totalRecords.toString().padStart(2, "0")} RECORDS`}
          </span>
        </div>

        <div className="admin-stat-grid">
          {statCards.map((card, index) => (
            <motion.button
              key={card.key}
              type="button"
              className="admin-stat-card"
              onClick={() => onNavigate(card.section)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + index * 0.06, duration: 0.5, ease: adminEase }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="admin-stat-card-top">
                <span>{card.number}</span>
                <ArrowUpRight size={14} />
              </div>
              <strong>{statsLoading ? "—" : stats[card.key].toString().padStart(2, "0")}</strong>
              <span>{card.label}</span>
            </motion.button>
          ))}
        </div>

        <div className={`admin-database-row ${statsError ? "is-error" : ""}`}>
          <span>
            <Database size={13} />
            DATABASE
          </span>
          <span className="admin-database-state">
            <i /> {statsLoading ? "SYNCING" : statsError ? "CHECK CONNECTION" : "CONNECTED"}
          </span>
        </div>
      </section>

      <div className="admin-quick-actions">
        <div>
          <span className="admin-section-label">QUICK ACTIONS</span>
          <p>Jump directly into the content you manage most.</p>
        </div>
        <button type="button" onClick={() => onNavigate("projects")}>
          <Plus size={14} /> NEW PROJECT
        </button>
      </div>

      <div className="admin-module-grid">
        {modules.map((card) => {
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
