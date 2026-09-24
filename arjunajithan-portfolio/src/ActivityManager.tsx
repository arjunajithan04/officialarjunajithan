import { useEffect, useMemo, useState } from "react";
import { Activity, Clock3, Database, Eye, RefreshCw, X } from "lucide-react";
import { supabase } from "./lib/supabase";
import "./activity-manager.css";

type ActivityRow = {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_label: string | null;
  changed_at: string;
};

type RevisionRow = ActivityRow & {
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  changed_by: string | null;
};

const filters = ["ALL", "CREATE", "UPDATE", "DELETE"] as const;
type Filter = (typeof filters)[number];

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function labelForType(type: string) {
  return type.replace(/_/g, " ").toUpperCase();
}

function displayName(row: ActivityRow) {
  return row.entity_label || `${labelForType(row.entity_type)} ${row.entity_id ? `#${row.entity_id.slice(0, 8)}` : ""}`;
}

export default function ActivityManager() {
  const [tab, setTab] = useState<"activity" | "revisions">("activity");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [revisions, setRevisions] = useState<RevisionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<RevisionRow | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");

    const [activityResult, revisionResult] = await Promise.all([
      supabase
        .from("admin_activity_log")
        .select("id, action, entity_type, entity_id, entity_label, changed_at")
        .order("changed_at", { ascending: false })
        .limit(150),
      supabase
        .from("admin_content_revisions")
        .select("id, action, entity_type, entity_id, entity_label, changed_at, old_data, new_data, changed_by")
        .order("changed_at", { ascending: false })
        .limit(150),
    ]);

    if (activityResult.error || revisionResult.error) {
      setError(activityResult.error?.message || revisionResult.error?.message || "Unable to load admin history.");
    }

    setActivity((activityResult.data ?? []) as ActivityRow[]);
    setRevisions((revisionResult.data ?? []) as RevisionRow[]);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const visibleActivity = useMemo(() => {
    if (filter === "ALL") return activity;
    return activity.filter((item) => item.action === filter);
  }, [activity, filter]);

  const visibleRevisions = useMemo(() => {
    if (filter === "ALL") return revisions;
    return revisions.filter((item) => item.action === filter);
  }, [revisions, filter]);

  return (
    <section className="activity-manager">
      <header className="activity-header">
        <div>
          <span className="admin-eyebrow">SYSTEM HISTORY</span>
          <h2>ACTIVITY / REVISIONS</h2>
          <p>Track content changes across the portfolio CMS.</p>
        </div>
        <button type="button" className="activity-refresh" onClick={() => void load()} disabled={loading}>
          <RefreshCw size={13} className={loading ? "activity-spin" : ""} /> REFRESH
        </button>
      </header>

      <div className="activity-toolbar">
        <div className="activity-tabs">
          <button type="button" className={tab === "activity" ? "is-active" : ""} onClick={() => setTab("activity")}>
            <Activity size={13} /> ACTIVITY <span>{activity.length}</span>
          </button>
          <button type="button" className={tab === "revisions" ? "is-active" : ""} onClick={() => setTab("revisions")}>
            <Clock3 size={13} /> REVISIONS <span>{revisions.length}</span>
          </button>
        </div>
        <div className="activity-filters">
          {filters.map((item) => (
            <button key={item} type="button" className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="activity-feedback">{error}</div>}

      {loading ? (
        <div className="activity-empty"><Database size={20} /><span>LOADING HISTORY...</span></div>
      ) : tab === "activity" ? (
        visibleActivity.length ? (
          <div className="activity-list">
            {visibleActivity.map((item) => (
              <article className="activity-row" key={item.id}>
                <span className={`activity-action action-${item.action.toLowerCase()}`}>{item.action}</span>
                <div className="activity-row-main">
                  <strong>{displayName(item)}</strong>
                  <span>{labelForType(item.entity_type)}</span>
                </div>
                <time>{formatDate(item.changed_at)}</time>
              </article>
            ))}
          </div>
        ) : (
          <div className="activity-empty"><Activity size={20} /><span>NO ACTIVITY YET</span><small>Changes made after the Phase 5 migration will appear here.</small></div>
        )
      ) : (
        visibleRevisions.length ? (
          <div className="activity-list">
            {visibleRevisions.map((item) => (
              <article className="activity-row revision-row" key={item.id}>
                <span className={`activity-action action-${item.action.toLowerCase()}`}>{item.action}</span>
                <div className="activity-row-main">
                  <strong>{displayName(item)}</strong>
                  <span>{labelForType(item.entity_type)}</span>
                </div>
                <time>{formatDate(item.changed_at)}</time>
                <button type="button" className="activity-view" onClick={() => setSelected(item)}><Eye size={13} /> VIEW</button>
              </article>
            ))}
          </div>
        ) : (
          <div className="activity-empty"><Clock3 size={20} /><span>NO REVISIONS YET</span><small>Database changes will create immutable snapshots automatically.</small></div>
        )
      )}

      {selected && (
        <div className="activity-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <div className="revision-detail">
            <button type="button" className="revision-close" onClick={() => setSelected(null)}><X size={15} /></button>
            <span className="admin-eyebrow">REVISION SNAPSHOT</span>
            <h3>{displayName(selected)}</h3>
            <p>{selected.action} · {formatDate(selected.changed_at)}</p>
            <div className="revision-grid">
              <div><span>BEFORE</span><pre>{JSON.stringify(selected.old_data, null, 2) || "—"}</pre></div>
              <div><span>AFTER</span><pre>{JSON.stringify(selected.new_data, null, 2) || "—"}</pre></div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
