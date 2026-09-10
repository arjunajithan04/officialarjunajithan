import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { supabase } from "./lib/supabase";
import "./experience-manager.css";

interface ExperienceRow {
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

interface ExperienceForm {
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  summary: string;
  description: string;
  tags: string;
}

const emptyForm: ExperienceForm = {
  company: "",
  role: "",
  location: "",
  start_date: "",
  end_date: "",
  is_current: false,
  summary: "",
  description: "",
  tags: "",
};

function formatPeriod(row: ExperienceRow) {
  const format = (value: string | null) => {
    if (!value) return "PRESENT";
    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }).toUpperCase();
  };

  return `${format(row.start_date)} — ${row.is_current ? "PRESENT" : format(row.end_date)}`;
}

export default function ExperienceManager() {
  const [items, setItems] = useState<ExperienceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<ExperienceRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ExperienceForm>(emptyForm);

  const load = async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("experiences")
      .select(
        "id, company, role, location, start_date, end_date, is_current, summary, description, tags, sort_order"
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setItems([]);
    } else {
      setItems((data ?? []) as ExperienceRow[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
    setForm(emptyForm);
    setError("");
    setNotice("");
  };

  const openEdit = (item: ExperienceRow) => {
    setEditing(item);
    setShowForm(true);
    setForm({
      company: item.company,
      role: item.role,
      location: item.location ?? "",
      start_date: item.start_date ?? "",
      end_date: item.end_date ?? "",
      is_current: item.is_current,
      summary: item.summary ?? "",
      description: item.description ?? "",
      tags: (item.tags ?? []).join(", "),
    });
    setError("");
    setNotice("");
  };

  const closeForm = () => {
    if (saving) return;
    setEditing(null);
    setShowForm(false);
    setForm(emptyForm);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      company: form.company.trim(),
      role: form.role.trim(),
      location: form.location.trim() || null,
      start_date: form.start_date || null,
      end_date: form.is_current ? null : form.end_date || null,
      is_current: form.is_current,
      summary: form.summary.trim() || null,
      description: form.description.trim() || null,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    const result = editing
      ? await supabase.from("experiences").update(payload).eq("id", editing.id)
      : await supabase.from("experiences").insert({
          ...payload,
          sort_order: items.length,
        });

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    setNotice(editing ? "EXPERIENCE UPDATED." : "EXPERIENCE CREATED.");
    setSaving(false);
    setEditing(null);
    setShowForm(false);
    setForm(emptyForm);
    await load();
  };

  const remove = async (item: ExperienceRow) => {
    const confirmed = window.confirm(
      `Delete ${item.role} at ${item.company}? This cannot be undone.`
    );
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("experiences")
      .delete()
      .eq("id", item.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setNotice("EXPERIENCE DELETED.");
    await load();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const current = items[index];
    const other = items[target];

    const first = await supabase
      .from("experiences")
      .update({ sort_order: other.sort_order })
      .eq("id", current.id);

    if (first.error) {
      setError(first.error.message);
      return;
    }

    const second = await supabase
      .from("experiences")
      .update({ sort_order: current.sort_order })
      .eq("id", other.id);

    if (second.error) {
      setError(second.error.message);
      return;
    }

    await load();
  };

  return (
    <section className="experience-manager">
      <div className="experience-manager-toolbar">
        <div>
          <span className="experience-manager-kicker">02 / CONTENT MODULE</span>
          <p>
            {String(items.length).padStart(2, "0")} EXPERIENCE ENTRIES IN
            DATABASE
          </p>
        </div>

        <button className="experience-manager-primary" onClick={openCreate}>
          <Plus size={14} /> ADD EXPERIENCE
        </button>
      </div>

      {notice && <div className="experience-manager-notice">{notice}</div>}
      {error && <div className="experience-manager-error">{error}</div>}

      {loading ? (
        <div className="experience-manager-state">LOADING EXPERIENCE...</div>
      ) : items.length === 0 ? (
        <div className="experience-manager-empty">
          <span>NO ENTRIES</span>
          <h2>BUILD THE<br />TIMELINE<span>.</span></h2>
        </div>
      ) : (
        <div className="experience-manager-list">
          {items.map((item, index) => (
            <article className="experience-manager-row" key={item.id}>
              <div className="experience-manager-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="experience-manager-main">
                <div className="experience-manager-heading">
                  <h2>{item.company}</h2>
                  <span>{item.role}</span>
                </div>
                <p>{formatPeriod(item)}</p>
                <small>{item.location || "—"}</small>
              </div>

              <div className="experience-manager-actions">
                <div className="experience-manager-order">
                  <button
                    aria-label="Move experience up"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    aria-label="Move experience down"
                    disabled={index === items.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                <button onClick={() => openEdit(item)}>
                  <Pencil size={13} /> EDIT
                </button>
                <button onClick={() => remove(item)}>
                  <Trash2 size={13} /> DELETE
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showForm && (
        <div className="experience-manager-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeForm();
        }}>
          <div className="experience-manager-modal">
            <div className="experience-manager-modal-header">
              <div>
                <span>{editing ? "EDIT EXPERIENCE" : "NEW EXPERIENCE"}</span>
                <h2>{editing ? editing.company : "ADD ENTRY."}</h2>
              </div>
              <button onClick={closeForm} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={save} className="experience-manager-form">
              <div className="experience-form-grid">
                <label>
                  COMPANY
                  <input
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    required
                  />
                </label>
                <label>
                  ROLE
                  <input
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    required
                  />
                </label>
              </div>

              <div className="experience-form-grid">
                <label>
                  LOCATION
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </label>
                <label className="experience-checkbox">
                  <span>CURRENT ROLE</span>
                  <input
                    type="checkbox"
                    checked={form.is_current}
                    onChange={(e) =>
                      setForm({ ...form, is_current: e.target.checked })
                    }
                  />
                  <strong>{form.is_current ? "PRESENT" : "PAST"}</strong>
                </label>
              </div>

              <div className="experience-form-grid">
                <label>
                  START DATE
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  />
                </label>
                <label>
                  END DATE
                  <input
                    type="date"
                    value={form.end_date}
                    disabled={form.is_current}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  />
                </label>
              </div>

              <label>
                SUMMARY
                <input
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  placeholder="Short description shown on the timeline."
                />
              </label>

              <label>
                DETAILS
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Expanded description shown in the experience dialog."
                />
              </label>

              <label>
                FOCUS / TAGS
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="Python, Artificial Intelligence, Machine Learning"
                />
              </label>

              {error && <div className="experience-manager-form-error">{error}</div>}

              <div className="experience-manager-form-footer">
                <button type="button" onClick={closeForm}>
                  CANCEL
                </button>
                <button type="submit" disabled={saving}>
                  <Save size={13} />
                  {saving ? "SAVING..." : "SAVE EXPERIENCE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
