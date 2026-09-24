import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  FolderKanban,
  Layers3,
  RefreshCw,
  ScanLine,
  Sparkles,
  BriefcaseBusiness,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "./lib/supabase";
import "./content-intelligence-manager.css";

type ContentItem = {
  id: string;
  title: string;
  section: "PROJECTS" | "EXPERIENCE" | "CAPABILITIES" | "ABOUT";
  checks: { label: string; passed: boolean }[];
};

type ModuleHealth = {
  section: ContentItem["section"];
  count: number;
  average: number;
  attention: number;
  completeChecks: number;
  totalChecks: number;
};

const ease = [0.22, 1, 0.36, 1] as const;
const sections = ["PROJECTS", "EXPERIENCE", "CAPABILITIES", "ABOUT"] as const;

const sectionMeta = {
  PROJECTS: { icon: FolderKanban, label: "PROJECTS" },
  EXPERIENCE: { icon: BriefcaseBusiness, label: "EXPERIENCE" },
  CAPABILITIES: { icon: Layers3, label: "CAPABILITIES" },
  ABOUT: { icon: FileText, label: "ABOUT" },
} as const;

function score(checks: ContentItem["checks"]) {
  if (!checks.length) return 0;
  return Math.round((checks.filter((check) => check.passed).length / checks.length) * 100);
}

function AnimatedNumber({ value, loading }: { value: number; loading: boolean }) {
  return (
    <motion.span
      key={`${loading}-${value}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
    >
      {loading ? "—" : value}
    </motion.span>
  );
}

export default function ContentIntelligenceManager() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scanProgress, setScanProgress] = useState(0);
  const [reviewFilter, setReviewFilter] = useState<"ALL" | ContentItem["section"]>("ALL");

  const loadIntelligence = useCallback(async () => {
    setLoading(true);
    setError("");
    setScanProgress(8);

    const progressTimer = window.setInterval(() => {
      setScanProgress((current) => Math.min(current + Math.floor(Math.random() * 18) + 8, 88));
    }, 140);

    const [projects, experience, capabilities, about] = await Promise.all([
      supabase
        .from("projects")
        .select("id, title, description, technologies, project_type, github_url, image_url, content_status"),
      supabase
        .from("experiences")
        .select("id, company, role, location, start_date, end_date, is_current, summary, description, tags"),
      supabase
        .from("capabilities")
        .select("id, title, category, stack, description"),
      supabase
        .from("about_perspectives")
        .select("id, label, title, text"),
    ]);

    window.clearInterval(progressTimer);
    setScanProgress(100);

    const firstError = [projects, experience, capabilities, about].find((result) => result.error)?.error;
    if (firstError) {
      setError(firstError.message);
      setLoading(false);
      return;
    }

    const nextItems: ContentItem[] = [
      ...(projects.data ?? []).map((item) => ({
        id: String(item.id),
        title: item.title ?? "Untitled project",
        section: "PROJECTS" as const,
        checks: [
          { label: "Title", passed: Boolean(item.title?.trim()) },
          { label: "Description", passed: Boolean(item.description?.trim()) },
          { label: "Technology stack", passed: Boolean(item.technologies?.trim()) },
          { label: "Project type", passed: Boolean(item.project_type?.trim()) },
          { label: "GitHub link", passed: Boolean(item.github_url?.trim()) },
          { label: "Image", passed: Boolean(item.image_url?.trim()) },
          { label: "Publication state", passed: Boolean(item.content_status) },
        ],
      })),
      ...(experience.data ?? []).map((item) => ({
        id: String(item.id),
        title: item.company ?? "Untitled experience",
        section: "EXPERIENCE" as const,
        checks: [
          { label: "Company", passed: Boolean(item.company?.trim()) },
          { label: "Role", passed: Boolean(item.role?.trim()) },
          { label: "Location", passed: Boolean(item.location?.trim()) },
          { label: "Start date", passed: Boolean(item.start_date) },
          { label: "End date / present", passed: Boolean(item.is_current || item.end_date) },
          { label: "Summary", passed: Boolean(item.summary?.trim()) },
          { label: "Description", passed: Boolean(item.description?.trim()) },
          { label: "Tags", passed: Array.isArray(item.tags) && item.tags.length > 0 },
        ],
      })),
      ...(capabilities.data ?? []).map((item) => ({
        id: String(item.id),
        title: item.title ?? "Untitled capability",
        section: "CAPABILITIES" as const,
        checks: [
          { label: "Title", passed: Boolean(item.title?.trim()) },
          { label: "Category", passed: Boolean(item.category?.trim()) },
          { label: "Stack", passed: Boolean(item.stack?.trim()) },
          { label: "Description", passed: Boolean(item.description?.trim()) },
        ],
      })),
      ...(about.data ?? []).map((item) => ({
        id: String(item.id),
        title: item.title ?? item.label ?? "Untitled perspective",
        section: "ABOUT" as const,
        checks: [
          { label: "Label", passed: Boolean(item.label?.trim()) },
          { label: "Title", passed: Boolean(item.title?.trim()) },
          { label: "Body copy", passed: Boolean(item.text?.trim()) },
        ],
      })),
    ];

    setItems(nextItems);
    window.setTimeout(() => setScanProgress(0), 350);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadIntelligence();
  }, [loadIntelligence]);

  const modules = useMemo<ModuleHealth[]>(() => {
    return sections.map((section) => {
      const sectionItems = items.filter((item) => item.section === section);
      const scores = sectionItems.map((item) => score(item.checks));
      const average = scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : 100;
      const totalChecks = sectionItems.reduce((sum, item) => sum + item.checks.length, 0);
      const completeChecks = sectionItems.reduce((sum, item) => sum + item.checks.filter((check) => check.passed).length, 0);
      return {
        section,
        count: sectionItems.length,
        average,
        attention: sectionItems.filter((item) => score(item.checks) < 100).length,
        completeChecks,
        totalChecks,
      };
    });
  }, [items]);

  const overall = items.length
    ? Math.round(items.reduce((sum, item) => sum + score(item.checks), 0) / items.length)
    : 100;

  const attentionItems = items
    .filter((item) => score(item.checks) < 100)
    .filter((item) => reviewFilter === "ALL" || item.section === reviewFilter)
    .sort((a, b) => score(a.checks) - score(b.checks));

  const attentionCounts = useMemo(() => {
    return sections.reduce<Record<string, number>>((acc, section) => {
      acc[section] = items.filter((item) => item.section === section && score(item.checks) < 100).length;
      return acc;
    }, {});
  }, [items]);

  return (
    <div className="content-intelligence">
      <header className="ci-header">
        <div>
          <span className="ci-kicker">PORTFOLIO CMS / 2026</span>
          <h1>Intelligence<span>.</span></h1>
          <div className="ci-breadcrumb">CMS / INTELLIGENCE</div>
          <p>A content-health layer for spotting incomplete portfolio entries before they reach the public site.</p>
        </div>
        <div className="ci-header-side">
          <div className="ci-live"><i /> LIVE DATABASE</div>
          <span className="ci-scan-note">{loading ? `SCANNING ${scanProgress}%` : "READY TO SCAN"}</span>
          <div className="ci-actions">
            <button className="ci-refresh" type="button" onClick={() => void loadIntelligence()} disabled={loading}>
              <RefreshCw size={13} className={loading ? "is-spinning" : ""} />
              REFRESH
            </button>
            <button className="ci-scan" type="button" onClick={() => void loadIntelligence()} disabled={loading}>
              <ScanLine size={13} />
              {loading ? "SCANNING" : "RUN FULL SCAN"}
            </button>
          </div>
        </div>
      </header>

      <section className="ci-hero">
        <div className="ci-hero-score">
          <span>PORTFOLIO CONTENT HEALTH</span>
          <div className="ci-big-score"><AnimatedNumber value={overall} loading={loading} /><b>%</b></div>
          <p>{items.length} content entries analysed across four CMS modules.</p>
        </div>
        <div className="ci-signal-chart" aria-hidden="true">
          <div className="ci-chart-labels"><span>CHECK COMPLETION</span><span>LIVE SCAN</span></div>
          <div className="ci-bars">
            {modules.map((module, index) => (
              <motion.i
                key={module.section}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(module.average, 8)}%` }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.7, ease }}
                title={`${module.section} ${module.average}%`}
              />
            ))}
          </div>
          <div className="ci-chart-axis"><span>PROJECTS</span><span>EXP</span><span>CAP</span><span>ABOUT</span></div>
        </div>
        <div className="ci-ring-wrap">
          <div className="ci-ring" style={{ "--ci-progress": `${overall}%` } as React.CSSProperties}>
            <span>{loading ? "—" : `${overall}%`}</span>
            <small>HEALTH</small>
          </div>
        </div>
      </section>

      {error && <div className="ci-error">Unable to analyse content: {error}</div>}

      <section className="ci-module-grid">
        {modules.map((module, index) => {
          const Icon = sectionMeta[module.section].icon;
          return (
            <motion.article
              key={module.section}
              className="ci-module-card"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.55, ease }}
              whileHover={{ y: -4 }}
            >
              <div className="ci-card-top">
                <span>{module.section}</span>
                <div className="ci-card-icon"><Icon size={16} /></div>
              </div>
              <div className="ci-module-score">
                <AnimatedNumber value={module.average} loading={loading} /><b>%</b>
              </div>
              <div className="ci-progress"><i style={{ width: `${module.average}%` }} /></div>
              <div className="ci-card-meta">
                <span>{module.completeChecks} OF {module.totalChecks || 0} CHECKS COMPLETE</span>
                <span>{module.attention ? `${module.attention} ISSUE${module.attention === 1 ? "" : "S"}` : "ALL COMPLETE"}</span>
              </div>
              <div className="ci-card-bottom">
                <span>{module.count} {module.count === 1 ? "ENTRY" : "ENTRIES"}</span>
                <button type="button" onClick={() => setReviewFilter(module.section)}>
                  VIEW REVIEW <ArrowUpRight size={12} />
                </button>
              </div>
            </motion.article>
          );
        })}
      </section>

      <section className="ci-attention">
        <div className="ci-section-heading">
          <div>
            <span className="admin-section-label">CONTENT REVIEW</span>
            <h2>Needs attention.</h2>
            <p>Items below are missing recommended content or have incomplete fields.</p>
          </div>
          <span>{attentionItems.length.toString().padStart(2, "0")} ITEMS</span>
        </div>

        <div className="ci-review-tabs">
          {(["ALL", ...sections] as const).map((filter) => {
            const count = filter === "ALL" ? items.filter((item) => score(item.checks) < 100).length : attentionCounts[filter] ?? 0;
            return (
              <button
                key={filter}
                type="button"
                className={reviewFilter === filter ? "is-active" : ""}
                onClick={() => setReviewFilter(filter)}
              >
                {filter} <span>{count}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="ci-empty ci-scanning"><ScanLine size={16} /> ANALYSING CONTENT...</div>
        ) : attentionItems.length === 0 ? (
          <div className="ci-empty ci-empty-success"><Sparkles size={16} /> EVERYTHING IS COMPLETE.</div>
        ) : (
          <div className="ci-review-list">
            {attentionItems.slice(0, 12).map((item, index) => {
              const itemScore = score(item.checks);
              const missing = item.checks.filter((check) => !check.passed).map((check) => check.label);
              return (
                <motion.article
                  className="ci-review-item"
                  key={`${item.section}-${item.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.35, ease }}
                >
                  <div className="ci-review-thumb"><span>{item.section.slice(0, 2)}</span></div>
                  <div className="ci-review-copy">
                    <span>{item.section}</span>
                    <strong>{item.title}</strong>
                    <small><i /> Missing: {missing.join(" · ")}</small>
                  </div>
                  <div className="ci-review-score"><strong>{itemScore}%</strong><span>COMPLETE</span></div>
                  <ChevronRight size={16} />
                </motion.article>
              );
            })}
          </div>
        )}
      </section>

      <section className="ci-guidance">
        <Sparkles size={16} />
        <div>
          <strong>HOW COMPLETENESS IS CALCULATED</strong>
          <p>Each entry has recommended fields such as title, description, image and links. 100% means all configured fields are present. Lower percentages are prompts for cleanup, not quality judgments.</p>
        </div>
      </section>
    </div>
  );
}
