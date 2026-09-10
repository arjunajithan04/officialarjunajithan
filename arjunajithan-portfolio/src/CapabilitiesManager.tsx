import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { supabase } from "./lib/supabase";
import "./capabilities-manager.css";

interface CapabilityRow {
  id: string;
  title: string;
  category: string | null;
  stack: string | null;
  description: string | null;
  applications: string[] | null;
  sort_order: number;
}

interface CapabilityForm {
  title: string;
  category: string;
  stack: string;
  description: string;
  applications: string;
}

const emptyForm: CapabilityForm = {
  title: "",
  category: "",
  stack: "",
  description: "",
  applications: "",
};

export default function CapabilitiesManager() {
  const [items, setItems] = useState<CapabilityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<CapabilityRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CapabilityForm>(emptyForm);

  const load = async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("capabilities")
      .select("id, title, category, stack, description, applications, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setItems([]);
    } else {
      setItems((data ?? []) as CapabilityRow[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
    setShowForm(true);
  };

  const openEdit = (item: CapabilityRow) => {
    setEditing(item);
    setForm({
      title: item.title,
      category: item.category ?? "",
      stack: item.stack ?? "",
      description: item.description ?? "",
      applications: (item.applications ?? []).join(", "),
    });
    setError("");
    setNotice("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const applications = form.applications
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      category: form.category.trim() || null,
      stack: form.stack.trim() || null,
      description: form.description.trim() || null,
      applications,
    };

    const result = editing
      ? await supabase.from("capabilities").update(payload).eq("id", editing.id)
      : await supabase.from("capabilities").insert({
          ...payload,
          sort_order: items.length,
        });

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    setNotice(editing ? "CAPABILITY UPDATED." : "CAPABILITY CREATED.");
    setSaving(false);
    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    await load();
  };

  const remove = async (item: CapabilityRow) => {
    if (
      !window.confirm(
        `Delete ${item.title}? This will remove it from the public portfolio.`
      )
    ) {
      return;
    }

    const { error: deleteError } = await supabase
      .from("capabilities")
      .delete()
      .eq("id", item.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setNotice("CAPABILITY DELETED.");
    await load();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const current = items[index];
    const other = items[target];

    const first = await supabase
      .from("capabilities")
      .update({ sort_order: other.sort_order })
      .eq("id", current.id);

    if (first.error) {
      setError(first.error.message);
      return;
    }

    const second = await supabase
      .from("capabilities")
      .update({ sort_order: current.sort_order })
      .eq("id", other.id);

    if (second.error) {
      setError(second.error.message);
      return;
    }

    await load();
  };

  return (
    <section className="capabilities-manager">
      <div className="capabilities-manager-toolbar">
        <div>
          <span className="capabilities-manager-kicker">03 / CONTENT MODULE</span>
          <p>
            {String(items.length).padStart(2, "0")} CAPABILITIES IN DATABASE
          </p>
        </div>

        <button
          type="button"
          className="capabilities-manager-primary"
          onClick={openCreate}
        >
          <Plus size={14} /> ADD CAPABILITY
        </button>
      </div>

      {notice && <div className="capabilities-manager-notice">{notice}</div>}
      {error && <div className="capabilities-manager-error">{error}</div>}

      {loading ? (
        <div className="capabilities-manager-state">LOADING CAPABILITIES...</div>
      ) : items.length === 0 ? (
        <div className="capabilities-manager-empty">
          <span>NO ENTRIES</span>
          <h2>BUILD THE<br />ARSENAL<span>.</span></h2>
        </div>
      ) : (
        <div className="capabilities-manager-list">
          {items.map((item, index) => (
            <article className="capabilities-manager-row" key={item.id}>
              <div className="capabilities-manager-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="capabilities-manager-main">
                <div className="capabilities-manager-heading">
                  <h2>{item.title}</h2>
                  {item.category && <span>{item.category}</span>}
                </div>
                <p>{item.stack || "—"}</p>
                <small>{item.description || "No description yet."}</small>
              </div>

              <div className="capabilities-manager-actions">
                <div className="capabilities-manager-order">
                  <button
                    type="button"
                    aria-label="Move capability up"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    aria-label="Move capability down"
                    disabled={index === items.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                <button type="button" onClick={() => openEdit(item)}>
                  <Pencil size={13} /> EDIT
                </button>
                <button type="button" onClick={() => remove(item)}>
                  <Trash2 size={13} /> DELETE
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showForm && (
        <div
          className="capabilities-manager-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <div className="capabilities-manager-modal">
            <div className="capabilities-manager-modal-header">
              <div>
                <span>{editing ? "EDIT CAPABILITY" : "NEW CAPABILITY"}</span>
                <h2>{editing ? editing.title : "ADD SKILL."}</h2>
              </div>

              <button type="button" onClick={closeForm} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form className="capabilities-manager-form" onSubmit={save}>
              <div className="capabilities-form-grid">
                <label>
                  TITLE
                  <input
                    value={form.title}
                    onChange={(event) =>
                      setForm({ ...form, title: event.target.value })
                    }
                    required
                  />
                </label>

                <label>
                  CATEGORY
                  <input
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    placeholder="PROGRAMMING"
                  />
                </label>
              </div>

              <label>
                STACK / TOOLS
                <input
                  value={form.stack}
                  onChange={(event) =>
                    setForm({ ...form, stack: event.target.value })
                  }
                  placeholder="PYTHON · PANDAS · SCIKIT-LEARN"
                />
              </label>

              <label>
                DESCRIPTION
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Describe how you use this capability."
                />
              </label>

              <label>
                APPLICATIONS
                <input
                  value={form.applications}
                  onChange={(event) =>
                    setForm({ ...form, applications: event.target.value })
                  }
                  placeholder="Automation, Data Work, ML Foundations"
                />
                <small>Separate applications with commas.</small>
              </label>

              {error && (
                <div className="capabilities-manager-form-error">{error}</div>
              )}

              <div className="capabilities-manager-form-footer">
                <button type="button" onClick={closeForm}>
                  CANCEL
                </button>
                <button type="submit" disabled={saving}>
                  <Save size={13} />
                  {saving ? "SAVING..." : "SAVE CAPABILITY"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
