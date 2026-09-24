import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowDown, ArrowUp, Check, Eye, Pencil, Plus, Save, Trash2, X } from "lucide-react";
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
  content_status: "draft" | "published" | "archived";
};

type ProjectForm = {
  title: string;
  description: string;
  year: string;
  technologies: string;
  project_type: string;
  github_url: string;
  content_status: "draft" | "published" | "archived";
};

const emptyForm: ProjectForm = {
  title: "",
  description: "",
  year: "",
  technologies: "",
  project_type: "",
  github_url: "",
  content_status: "draft",
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [filter, setFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

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
    setSelectedImage(null);
    setImagePreview("");
    setRemoveImage(false);
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
      content_status: project.content_status,
    });
    setSelectedImage(null);
    setImagePreview(project.image_url ?? "");
    setRemoveImage(false);
    setMessage("");
    setError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setSelectedImage(null);
    setImagePreview("");
    setRemoveImage(false);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedImage(file);
    setRemoveImage(false);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setRemoveImage(true);
  };

  const uploadProjectImage = async (projectId: string, file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "project-image";
    const path = `${projectId}/${Date.now()}-${safeName}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(path);

    return { path, publicUrl: data.publicUrl };
  };

  const deleteStoredImage = async (imageUrl: string | null) => {
    if (!imageUrl) return;

    const marker = "/storage/v1/object/public/project-images/";
    const markerIndex = imageUrl.indexOf(marker);
    if (markerIndex === -1) return;

    const path = decodeURIComponent(imageUrl.slice(markerIndex + marker.length));
    if (!path) return;

    await supabase.storage.from("project-images").remove([path]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const basePayload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      year: form.year.trim() ? Number(form.year) : null,
      technologies: form.technologies.trim() || null,
      project_type: form.project_type.trim() || null,
      github_url: form.github_url.trim() || null,
      content_status: form.content_status,
      updated_at: new Date().toISOString(),
    };

    if (!basePayload.title) {
      setError("Project title is required.");
      setSaving(false);
      return;
    }

    if (basePayload.year !== null && !Number.isInteger(basePayload.year)) {
      setError("Year must be a whole number.");
      setSaving(false);
      return;
    }

    const existingProject = editingId
      ? projects.find((project) => project.id === editingId)
      : null;

    let createdProjectId: string | null = null;

    try {
      let projectId = editingId;
      let oldImageUrl = existingProject?.image_url ?? null;
      let nextImageUrl = existingProject?.image_url ?? null;

      if (selectedImage) {
        if (!projectId) {
          const { data, error: insertError } = await supabase
            .from("projects")
            .insert({ ...basePayload, image_url: null, sort_order: projects.length })
            .select("id")
            .single();

          if (insertError || !data) {
            throw insertError ?? new Error("Unable to create project.");
          }

          projectId = data.id;
          createdProjectId = data.id;
        }

        if (!projectId) {
          throw new Error("Unable to determine project id for image upload.");
        }

        const uploaded = await uploadProjectImage(projectId, selectedImage);
        nextImageUrl = uploaded.publicUrl;

        const { error: imageUpdateError } = await supabase
          .from("projects")
          .update({ ...basePayload, image_url: nextImageUrl })
          .eq("id", projectId);

        if (imageUpdateError) {
          await deleteStoredImage(nextImageUrl);
          if (!editingId) {
            await supabase.from("projects").delete().eq("id", projectId);
          }
          throw imageUpdateError;
        }
      } else if (removeImage && editingId) {
        const { error: removeError } = await supabase
          .from("projects")
          .update({ ...basePayload, image_url: null })
          .eq("id", editingId);

        if (removeError) throw removeError;
        nextImageUrl = null;
      } else if (editingId) {
        const { error: updateError } = await supabase
          .from("projects")
          .update({ ...basePayload, image_url: nextImageUrl })
          .eq("id", editingId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("projects")
          .insert({ ...basePayload, image_url: null, sort_order: projects.length });

        if (insertError) throw insertError;
      }

      if (oldImageUrl && oldImageUrl !== nextImageUrl) {
        await deleteStoredImage(oldImageUrl);
      }

      setMessage(editingId ? "PROJECT UPDATED." : "PROJECT CREATED.");
      await loadProjects();
      setSaving(false);
      setFormOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      setSelectedImage(null);
      setImagePreview("");
      setRemoveImage(false);
    } catch (submitError) {
      if (createdProjectId) {
        await supabase.from("projects").delete().eq("id", createdProjectId);
      }
      setError(submitError instanceof Error ? submitError.message : "Unable to save project.");
      setSaving(false);
    }
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

    await deleteStoredImage(project.image_url);
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

  const visibleProjects = filter === "all"
    ? projects
    : projects.filter((project) => project.content_status === filter);

  const statusCounts = {
    all: projects.length,
    draft: projects.filter((project) => project.content_status === "draft").length,
    published: projects.filter((project) => project.content_status === "published").length,
    archived: projects.filter((project) => project.content_status === "archived").length,
  };

  const setProjectStatus = async (project: Project, status: Project["content_status"]) => {
    setError("");
    setMessage("");
    const { error: updateError } = await supabase
      .from("projects")
      .update({ content_status: status, updated_at: new Date().toISOString() })
      .eq("id", project.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage(status === "published" ? "PROJECT PUBLISHED." : status === "archived" ? "PROJECT ARCHIVED." : "DRAFT SAVED.");
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

      <div className="admin-content-filters" aria-label="Project status filter">
        {(Object.keys(statusCounts) as Array<keyof typeof statusCounts>).map((status) => (
          <button
            key={status}
            type="button"
            className={filter === status ? "is-active" : ""}
            onClick={() => setFilter(status)}
          >
            {status.toUpperCase()} <span>{statusCounts[status]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-manager-state">LOADING PROJECTS...</div>
      ) : visibleProjects.length === 0 ? (
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
          {visibleProjects.map((project, index) => (
            <article className="admin-project-row" key={project.id}>
              <div className="admin-project-number">
                {(index + 1).toString().padStart(2, "0")}
              </div>

              <div className="admin-project-main">
                <div className="admin-project-title-line">
                  <h2>{project.title}</h2>
                  {project.project_type && <span>{project.project_type}</span>}
                  <span className={`admin-status-badge is-${project.content_status}`}>{project.content_status.toUpperCase()}</span>
                </div>
                <div className="admin-project-meta">
                  {project.year ?? "—"} {project.technologies ? `· ${project.technologies}` : ""}
                  {project.image_url && <span className="admin-project-image-status">· IMAGE ATTACHED</span>}
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
                    disabled={index === visibleProjects.length - 1}
                    onClick={() => void moveProject(index, 1)}
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>
                <button onClick={() => setPreviewProject(project)}>
                  <Eye size={13} /> PREVIEW
                </button>
                <button onClick={() => openEdit(project)}>
                  <Pencil size={13} /> EDIT
                </button>
                {project.content_status !== "published" && (
                  <button onClick={() => void setProjectStatus(project, "published")}>PUBLISH</button>
                )}
                {project.content_status === "published" && (
                  <button onClick={() => void setProjectStatus(project, "draft")}>UNPUBLISH</button>
                )}
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
                <span>CONTENT STATUS</span>
                <select value={form.content_status} onChange={(e) => setForm({ ...form, content_status: e.target.value as ProjectForm["content_status"] })}>
                  <option value="draft">DRAFT — NOT PUBLIC</option>
                  <option value="published">PUBLISHED — LIVE ON SITE</option>
                  <option value="archived">ARCHIVED — HIDDEN</option>
                </select>
              </label>

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

              <div className="admin-project-image-field">
                <div className="admin-project-image-copy">
                  <span>PROJECT IMAGE</span>
                  <p>Choose an image from your computer. It will be uploaded to Supabase Storage and used as the project preview.</p>
                </div>

                <div className="admin-project-image-picker">
                  {imagePreview ? (
                    <div className="admin-project-image-preview">
                      <img src={imagePreview} alt="Selected project preview" />
                      <button type="button" className="admin-project-image-remove" onClick={removeSelectedImage}>
                        <X size={13} /> REMOVE IMAGE
                      </button>
                    </div>
                  ) : (
                    <div className="admin-project-image-empty">
                      <span>NO IMAGE SELECTED</span>
                    </div>
                  )}

                  <label className="admin-project-image-browse">
                    <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImageChange} />
                    <Plus size={14} /> {imagePreview ? "CHANGE IMAGE" : "BROWSE COMPUTER"}
                  </label>
                </div>
              </div>

              {error && <div className="admin-form-error"><X size={14} /> {error}</div>}

              <footer className="admin-form-footer">
                <button type="button" className="admin-secondary-button" onClick={closeForm}>CANCEL</button>
                <button type="submit" className="admin-primary-button" disabled={saving}>
                  <Save size={14} /> {saving ? "SAVING..." : editingId ? (form.content_status === "published" ? "SAVE & PUBLISH" : "SAVE DRAFT") : (form.content_status === "published" ? "PUBLISH PROJECT" : "SAVE DRAFT")}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {previewProject && (
        <div className="admin-form-overlay" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPreviewProject(null);
        }}>
          <section className="admin-preview-panel" role="dialog" aria-modal="true" aria-labelledby="project-preview-title">
            <header className="admin-form-header">
              <div>
                <span className="admin-eyebrow">PROJECT PREVIEW / {previewProject.content_status.toUpperCase()}</span>
                <h2 id="project-preview-title">{previewProject.title}</h2>
              </div>
              <button className="admin-icon-button" onClick={() => setPreviewProject(null)} aria-label="Close project preview">
                <X size={18} />
              </button>
            </header>

            {previewProject.image_url && (
              <div className="admin-preview-image"><img src={previewProject.image_url} alt={previewProject.title} /></div>
            )}

            <div className="admin-preview-copy">
              <div className="admin-preview-meta">
                <span>{previewProject.year ?? "—"}</span>
                <span>{previewProject.project_type ?? "PROJECT"}</span>
                <span>{previewProject.technologies ?? "—"}</span>
              </div>
              <p>{previewProject.description || "No project description yet."}</p>
              {previewProject.github_url && (
                <a href={previewProject.github_url} target="_blank" rel="noreferrer">VIEW GITHUB ↗</a>
              )}
            </div>

            <footer className="admin-form-footer">
              <button type="button" className="admin-secondary-button" onClick={() => setPreviewProject(null)}>CLOSE</button>
              {previewProject.content_status !== "published" && (
                <button type="button" className="admin-primary-button" onClick={() => { void setProjectStatus(previewProject, "published"); setPreviewProject(null); }}>PUBLISH PROJECT</button>
              )}
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
