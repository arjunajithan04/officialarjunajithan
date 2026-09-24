import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Pencil, Plus, Save, Search, Trash2, ArrowUp, ArrowDown, X } from "lucide-react";
import { supabase } from "./lib/supabase";
import "./about-manager.css";

interface AboutRow {
  id: string;
  headline: string;
  lead: string | null;
  bio: string | null;
  philosophy: string | null;
  status: string | null;
  signature_role: string | null;
  image_url: string | null;
}

interface PerspectiveRow {
  id: string;
  label: string;
  title: string;
  text: string;
  sort_order: number;
}

const emptyAbout: Omit<AboutRow, "id"> = {
  headline: "I LIKE TO BUILD THINGS THAT MATTER.",
  lead: "",
  bio: "",
  philosophy: "",
  status: "CURRENTLY BUILDING",
  signature_role: "MCA / DEVELOPER / BUILDER",
  image_url: "/images/arjun-photo.jpg",
};

const emptyPerspective = {
  label: "",
  title: "",
  text: "",
};

export default function AboutManager() {
  const [about, setAbout] = useState<AboutRow | null>(null);
  const [perspectives, setPerspectives] = useState<PerspectiveRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [showAboutForm, setShowAboutForm] = useState(false);
  const [showPerspectiveForm, setShowPerspectiveForm] = useState(false);
  const [editingPerspective, setEditingPerspective] =
    useState<PerspectiveRow | null>(null);
  const [aboutForm, setAboutForm] = useState(emptyAbout);
  const [perspectiveForm, setPerspectiveForm] = useState(emptyPerspective);
  const [perspectiveSearch, setPerspectiveSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    const [aboutResult, perspectiveResult] = await Promise.all([
      supabase
        .from("about")
        .select(
          "id, headline, lead, bio, philosophy, status, signature_role, image_url"
        )
        .limit(1)
        .maybeSingle(),
      supabase
        .from("about_perspectives")
        .select("id, label, title, text, sort_order")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    if (aboutResult.error) {
      setError(aboutResult.error.message);
    } else if (aboutResult.data) {
      setAbout(aboutResult.data as AboutRow);
      setAboutForm(aboutResult.data as AboutRow);
    }

    if (perspectiveResult.error) {
      setError((current) => current || perspectiveResult.error.message);
    } else {
      setPerspectives((perspectiveResult.data ?? []) as PerspectiveRow[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openAbout = () => {
    setError("");
    setNotice("");
    setAboutForm(about ?? emptyAbout);
    setShowAboutForm(true);
  };

  const saveAbout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      headline: aboutForm.headline.trim(),
      lead: aboutForm.lead?.trim() || null,
      bio: aboutForm.bio?.trim() || null,
      philosophy: aboutForm.philosophy?.trim() || null,
      status: aboutForm.status?.trim() || null,
      signature_role: aboutForm.signature_role?.trim() || null,
      image_url: aboutForm.image_url?.trim() || null,
    };

    const result = about
      ? await supabase.from("about").update(payload).eq("id", about.id)
      : await supabase.from("about").insert(payload);

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    setNotice("ABOUT CONTENT SAVED.");
    setSaving(false);
    setShowAboutForm(false);
    await load();
  };

  const openCreatePerspective = () => {
    setEditingPerspective(null);
    setPerspectiveForm(emptyPerspective);
    setError("");
    setNotice("");
    setShowPerspectiveForm(true);
  };

  const openEditPerspective = (item: PerspectiveRow) => {
    setEditingPerspective(item);
    setPerspectiveForm({
      label: item.label,
      title: item.title,
      text: item.text,
    });
    setError("");
    setNotice("");
    setShowPerspectiveForm(true);
  };

  const savePerspective = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      label: perspectiveForm.label.trim(),
      title: perspectiveForm.title.trim(),
      text: perspectiveForm.text.trim(),
    };

    const result = editingPerspective
      ? await supabase
          .from("about_perspectives")
          .update(payload)
          .eq("id", editingPerspective.id)
      : await supabase.from("about_perspectives").insert({
          ...payload,
          sort_order: perspectives.length,
        });

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    setNotice(
      editingPerspective
        ? "PERSPECTIVE UPDATED."
        : "PERSPECTIVE CREATED."
    );
    setSaving(false);
    setShowPerspectiveForm(false);
    setEditingPerspective(null);
    await load();
  };

  const removePerspective = async (item: PerspectiveRow) => {
    if (!window.confirm(`Delete ${item.label}?`)) return;

    const { error: deleteError } = await supabase
      .from("about_perspectives")
      .delete()
      .eq("id", item.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setNotice("PERSPECTIVE DELETED.");
    await load();
  };

  const movePerspective = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= perspectives.length) return;

    const current = perspectives[index];
    const other = perspectives[target];

    const first = await supabase
      .from("about_perspectives")
      .update({ sort_order: other.sort_order })
      .eq("id", current.id);

    if (first.error) {
      setError(first.error.message);
      return;
    }

    const second = await supabase
      .from("about_perspectives")
      .update({ sort_order: current.sort_order })
      .eq("id", other.id);

    if (second.error) {
      setError(second.error.message);
      return;
    }

    await load();
  };

  if (loading) {
    return (
      <section className="about-manager">
        <div className="about-manager-state">LOADING ABOUT CONTENT...</div>
      </section>
    );
  }

  return (
    <section className="about-manager">
      <div className="about-manager-toolbar">
        <div>
          <span>04 / CONTENT MODULE</span>
          <p>ABOUT / PROFILE / PERSPECTIVES</p>
        </div>
        <button type="button" onClick={openAbout}>
          <Pencil size={14} /> EDIT ABOUT
        </button>
      </div>

      {notice && <div className="about-manager-notice">{notice}</div>}
      {error && <div className="about-manager-error">{error}</div>}

      <div className="about-manager-profile">
        <div className="about-manager-number">01</div>
        <div>
          <span className="about-manager-label">HEADLINE</span>
          <h2>{about?.headline || "ABOUT"}</h2>
          <p>{about?.lead}</p>
          <small>{about?.status} · {about?.signature_role}</small>
        </div>
      </div>

      <div className="about-manager-search-row">
        <div className="about-manager-search"><Search size={14} /><input value={perspectiveSearch} onChange={(event) => setPerspectiveSearch(event.target.value)} placeholder="SEARCH PERSPECTIVES..." aria-label="Search perspectives" />{perspectiveSearch && <button type="button" onClick={() => setPerspectiveSearch("")} aria-label="Clear perspective search"><X size={13} /></button>}</div>
      </div>

      <div className="about-manager-section-head">
        <div>
          <span>HOW I WORK</span>
          <p>{String(perspectives.length).padStart(2, "0")} PERSPECTIVES</p>
        </div>
        <button type="button" onClick={openCreatePerspective}>
          <Plus size={14} /> ADD PERSPECTIVE
        </button>
      </div>

      <div className="about-manager-list">
        {perspectives.filter((item) => { const query = perspectiveSearch.trim().toLowerCase(); return !query || [item.label, item.title, item.text].filter(Boolean).join(" ").toLowerCase().includes(query); }).map((item, index) => (
          <article className="about-manager-row" key={item.id}>
            <div className="about-manager-number">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="about-manager-main">
              <div className="about-manager-heading">
                <h3>{item.title}</h3>
                <span>{item.label}</span>
              </div>
              <p>{item.text}</p>
            </div>
            <div className="about-manager-actions">
              <div>
                <button disabled={perspectives.findIndex((entry) => entry.id === item.id) === 0} onClick={() => movePerspective(perspectives.findIndex((entry) => entry.id === item.id), -1)}>
                  <ArrowUp size={13} />
                </button>
                <button
                  disabled={perspectives.findIndex((entry) => entry.id === item.id) === perspectives.length - 1}
                  onClick={() => movePerspective(perspectives.findIndex((entry) => entry.id === item.id), 1)}
                >
                  <ArrowDown size={13} />
                </button>
              </div>
              <button onClick={() => openEditPerspective(item)}>
                <Pencil size={13} /> EDIT
              </button>
              <button onClick={() => removePerspective(item)}>
                <Trash2 size={13} /> DELETE
              </button>
            </div>
          </article>
        ))}
      </div>

      {showAboutForm && (
        <div className="about-manager-overlay">
          <div className="about-manager-modal">
            <div className="about-manager-modal-head">
              <div>
                <span>EDIT PROFILE</span>
                <h2>ABOUT.</h2>
              </div>
              <button type="button" onClick={() => setShowAboutForm(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveAbout} className="about-manager-form">
              <label>
                HEADLINE
                <input
                  required
                  value={aboutForm.headline}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, headline: e.target.value })
                  }
                />
              </label>

              <label>
                LEAD
                <textarea
                  rows={3}
                  value={aboutForm.lead ?? ""}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, lead: e.target.value })
                  }
                />
              </label>

              <label>
                BIO
                <textarea
                  rows={5}
                  value={aboutForm.bio ?? ""}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, bio: e.target.value })
                  }
                />
              </label>

              <label>
                PHILOSOPHY
                <textarea
                  rows={5}
                  value={aboutForm.philosophy ?? ""}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, philosophy: e.target.value })
                  }
                />
              </label>

              <div className="about-form-grid">
                <label>
                  STATUS
                  <input
                    value={aboutForm.status ?? ""}
                    onChange={(e) =>
                      setAboutForm({ ...aboutForm, status: e.target.value })
                    }
                  />
                </label>
                <label>
                  SIGNATURE ROLE
                  <input
                    value={aboutForm.signature_role ?? ""}
                    onChange={(e) =>
                      setAboutForm({
                        ...aboutForm,
                        signature_role: e.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <label>
                PROFILE IMAGE URL
                <input
                  value={aboutForm.image_url ?? ""}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, image_url: e.target.value })
                  }
                  placeholder="/images/arjun-photo.jpg"
                />
              </label>

              <div className="about-manager-form-footer">
                <button type="button" onClick={() => setShowAboutForm(false)}>
                  CANCEL
                </button>
                <button type="submit" disabled={saving}>
                  <Save size={13} /> {saving ? "SAVING..." : "SAVE ABOUT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPerspectiveForm && (
        <div className="about-manager-overlay">
          <div className="about-manager-modal">
            <div className="about-manager-modal-head">
              <div>
                <span>{editingPerspective ? "EDIT PERSPECTIVE" : "NEW PERSPECTIVE"}</span>
                <h2>{editingPerspective ? editingPerspective.label : "ADD."}</h2>
              </div>
              <button type="button" onClick={() => setShowPerspectiveForm(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={savePerspective} className="about-manager-form">
              <label>
                LABEL
                <input
                  required
                  value={perspectiveForm.label}
                  onChange={(e) =>
                    setPerspectiveForm({ ...perspectiveForm, label: e.target.value })
                  }
                />
              </label>

              <label>
                TITLE
                <input
                  required
                  value={perspectiveForm.title}
                  onChange={(e) =>
                    setPerspectiveForm({ ...perspectiveForm, title: e.target.value })
                  }
                />
              </label>

              <label>
                DESCRIPTION
                <textarea
                  rows={5}
                  required
                  value={perspectiveForm.text}
                  onChange={(e) =>
                    setPerspectiveForm({ ...perspectiveForm, text: e.target.value })
                  }
                />
              </label>

              <div className="about-manager-form-footer">
                <button type="button" onClick={() => setShowPerspectiveForm(false)}>
                  CANCEL
                </button>
                <button type="submit" disabled={saving}>
                  <Save size={13} /> {saving ? "SAVING..." : "SAVE PERSPECTIVE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
