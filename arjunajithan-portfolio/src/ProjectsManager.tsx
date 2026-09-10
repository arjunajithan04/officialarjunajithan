import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowDown, ArrowUp, Check, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { supabase } from "./lib/supabase";
import "./projects-manager.css";

type Project = {
  id: string;
  title: string;
  description: string | null;
  year: number | null;
  technologies: string | null;
  project_type: string | null;
  github_url: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type ProjectForm = {
  title: string;
  description: string;
  year: string;
  technologies: string;
  project_type: string;
  github_url: string;
  image_url: string;
};

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  year: "",
  technologies: "",
  project_type: "",
  github_url: "",
  image_url: "",
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (queryError) {
      setError(queryError.message);
      setProjects([]);
    } else {
      setProjects((data ?? []) as Project[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
    setFormOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description ?? "",
      year: project.year?.toString() ?? "",
      technologies: project.technologies ?? "",
      project_type: project.project_type ?? "",
      github_url: project.github_url ?? "",
      image_url: project.image_url ?? "",
    });
    setMessage("");
    setError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      year: form.year.trim() ? Number(form.year) : null,
      technologies: form.technologies.trim() || null,
      project_type: form.project_type.trim() || null,
      github_url: form.github_url.trim() || null,
      image_url: form.image_url.trim() || null,
      updated_at: new Date().toISOString(),
    };

    if (!payload.title) {
      setError("Project title is required.");
      setSaving(false);
      return;
    }

    if (payload.year !== null && !Number.isInteger(payload.year)) {
      setError("Year must be a whole number.");
      setSaving(false);
      return;
    }

    const result = editingId
      ? await supabase.from("projects").update(payload).eq("id", editingId)
      : await supabase.from("projects").insert({
          ...payload,
          sort_order: projects.length,
        });

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    setMessage(editingId ? "PROJECT UPDATED." : "PROJECT CREATED.");
    await loadProjects();
    setSaving(false);
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteProject = async (project: Project) => {
    const confirmed = window.confirm(
      `Delete “${project.title}”? This cannot be undone.`
    );
    if (!confirmed) return;

    setError("");
    setMessage("");

    const { error: deleteError } = await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setMessage("PROJECT DELETED.");
    await loadProjects();
  };

  const moveProject = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const current = projects[index];
    const target = projects[targetIndex];

    setError("");
    setMessage("");

    const [first, second] = await Promise.all([
      supabase
        .from("projects")
        .update({ sort_order: target.sort_order, updated_at: new Date().toISOString() })
        .eq("id", current.id),
      supabase
        .from("projects")
        .update({ sort_order: current.sort_order, updated_at: new Date().toISOString() })
        .eq("id", target.id),
    ]);

    if (first.error || second.error) {
      setError(first.error?.message || second.error?.message || "Unable to reorder projects.");
      await loadProjects();
      return;
    }

    setMessage("ORDER UPDATED.");
    await loadProjects();
  };

  return (
    <div className="admin-manager">
      <div className="admin-manager-toolbar">
        <div>
          <span className="admin-eyebrow">01 / CONTENT MODULE</span>
          <p className="admin-manager-count">
            {projects.length.toString().padStart(2, "0")} PROJECT
            {projects.length === 1 ? "" : "S"} IN DATABASE
          </p>
        </div>
        <button className="admin-primary-button" onClick={openAdd}>
          <Plus size={15} /> ADD PROJECT
        </button>
      </div>

      {(message || error) && (
        <div className={`admin-feedback ${error ? "is-error" : ""}`}>
          {error ? <X size={14} /> : <Check size={14} />}
          {error || message}
        </div>
      )}

      {loading ? (
        <div className="admin-manager-state">LOADING PROJECTS...</div>
      ) : projects.length === 0 ? (
        <div className="admin-manager-empty">
          <span>NO PROJECTS YET</span>
          <h2>Start building<br />the archive<span>.</span></h2>
          <p>Add your first project and it will be stored in Supabase.</p>
          <button className="admin-primary-button" onClick={openAdd}>
            <Plus size={15} /> ADD FIRST PROJECT
          </button>
        </div>
      ) : (
        <div className="admin-project-list">
          {projects.map((project, index) => (
            <article className="admin-project-row" key={project.id}>
              <div className="admin-project-number">
                {(index + 1).toString().padStart(2, "0")}
              </div>

              <div className="admin-project-main">
                <div className="admin-project-title-line">
                  <h2>{project.title}</h2>
                  {project.project_type && <span>{project.project_type}</span>}
                </div>
                <div className="admin-project-meta">
                  {project.year ?? "—"} {project.technologies ? `· ${project.technologies}` : ""}
                </div>
              </div>

              <div className="admin-project-actions">
                <div className="admin-order-actions">
                  <button
                    title="Move up"
                    aria-label={`Move ${project.title} up`}
                    disabled={index === 0}
                    onClick={() => void moveProject(index, -1)}
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    title="Move down"
                    aria-label={`Move ${project.title} down`}
                    disabled={index === projects.length - 1}
                    onClick={() => void moveProject(index, 1)}
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>
                <button onClick={() => openEdit(project)}>
                  <Pencil size={13} /> EDIT
                </button>
                <button className="is-danger" onClick={() => void deleteProject(project)}>
                  <Trash2 size={13} /> DELETE
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="admin-form-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeForm();
        }}>
          <section className="admin-form-panel" role="dialog" aria-modal="true" aria-labelledby="project-form-title">
            <header className="admin-form-header">
              <div>
                <span className="admin-eyebrow">01 / PROJECTS</span>
                <h2 id="project-form-title">{editingId ? "Edit project." : "Add project."}</h2>
              </div>
              <button className="admin-icon-button" onClick={closeForm} aria-label="Close project form">
                <X size={18} />
              </button>
            </header>

            <form className="admin-project-form" onSubmit={handleSubmit}>
              <label>
                <span>PROJECT TITLE *</span>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </label>

              <div className="admin-form-grid-2">
                <label>
                  <span>YEAR</span>
                  <input type="number" min="1900" max="2200" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
                </label>
                <label>
                  <span>PROJECT TYPE</span>
                  <input value={form.project_type} placeholder="e.g. WEB / AI / MOBILE" onChange={(e) => setForm({ ...form, project_type: e.target.value })} />
                </label>
              </div>

              <label>
                <span>DESCRIPTION</span>
                <textarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>

              <label>
                <span>TECHNOLOGIES</span>
                <input value={form.technologies} placeholder="React · TypeScript · Supabase" onChange={(e) => setForm({ ...form, technologies: e.target.value })} />
              </label>

              <label>
                <span>GITHUB URL</span>
                <input type="url" value={form.github_url} placeholder="https://github.com/..." onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
              </label>

              <label>
                <span>IMAGE URL</span>
                <input type="url" value={form.image_url} placeholder="Optional" onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              </label>

              {error && <div className="admin-form-error"><X size={14} /> {error}</div>}

              <footer className="admin-form-footer">
                <button type="button" className="admin-secondary-button" onClick={closeForm}>CANCEL</button>
                <button type="submit" className="admin-primary-button" disabled={saving}>
                  <Save size={14} /> {saving ? "SAVING..." : editingId ? "SAVE CHANGES" : "SAVE PROJECT"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
