import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { Check, Copy, ImagePlus, RefreshCw, Search, Trash2, Upload, X } from "lucide-react";
import { supabase } from "./lib/supabase";
import "./media-manager.css";

type MediaItem = {
  id: string;
  name: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  public_url: string;
  storage_path: string;
  created_at: string;
};

const MAX_SIZE = 10 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function safeFileName(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() || "jpg";
  const base = name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "media";
  return `${base}.${extension}`;
}

export default function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    setError("");
    const { data, error: queryError } = await supabase
      .from("media_library")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setItems([]);
    } else {
      setItems((data ?? []) as MediaItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadMedia();
  }, []);

  const filteredItems = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return items;
    return items.filter((item) => `${item.name} ${item.file_name}`.toLowerCase().includes(value));
  }, [items, query]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) throw new Error(`${file.name}: image files only.`);
        if (file.size > MAX_SIZE) throw new Error(`${file.name}: maximum size is 10 MB.`);

        const fileName = safeFileName(file.name);
        const path = `${crypto.randomUUID()}/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from("portfolio-media")
          .upload(path, file, { cacheControl: "3600", contentType: file.type, upsert: false });

        if (uploadError) throw uploadError;

        const { data: publicData } = supabase.storage.from("portfolio-media").getPublicUrl(path);
        const { error: insertError } = await supabase.from("media_library").insert({
          name: file.name.replace(/\.[^/.]+$/, ""),
          file_name: file.name,
          mime_type: file.type,
          size_bytes: file.size,
          public_url: publicData.publicUrl,
          storage_path: path,
        });

        if (insertError) {
          await supabase.storage.from("portfolio-media").remove([path]);
          throw insertError;
        }
      }

      setMessage(`${files.length} image${files.length === 1 ? "" : "s"} added to the library.`);
      await loadMedia();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload media.");
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = async (item: MediaItem) => {
    await navigator.clipboard.writeText(item.public_url);
    setCopiedId(item.id);
    window.setTimeout(() => setCopiedId(null), 1400);
  };

  const deleteMedia = async (item: MediaItem) => {
    if (!window.confirm(`Delete “${item.file_name}” from the media library?`)) return;
    setError("");
    const { error: storageError } = await supabase.storage.from("portfolio-media").remove([item.storage_path]);
    if (storageError) {
      setError(storageError.message);
      return;
    }
    const { error: deleteError } = await supabase.from("media_library").delete().eq("id", item.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    if (selected?.id === item.id) setSelected(null);
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    setMessage("Media removed.");
  };

  return (
    <div className="media-manager">
      <div className="media-toolbar">
        <div className="media-search">
          <Search size={14} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="SEARCH MEDIA..." />
          {query && <button type="button" onClick={() => setQuery("")}><X size={13} /></button>}
        </div>
        <div className="media-toolbar-actions">
          <button type="button" className="media-refresh" onClick={() => void loadMedia()} disabled={loading}>
            <RefreshCw size={13} className={loading ? "media-spin" : ""} /> REFRESH
          </button>
          <label className="media-upload-button">
            <Upload size={13} /> {uploading ? "UPLOADING..." : "UPLOAD MEDIA"}
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" multiple onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {(message || error) && (
        <div className={`media-feedback ${error ? "is-error" : ""}`}>{error || message}</div>
      )}

      <div className="media-meta">
        <span>{filteredItems.length} ASSET{filteredItems.length === 1 ? "" : "S"}</span>
        <span>MAX 10 MB / IMAGE</span>
      </div>

      {loading ? (
        <div className="media-empty"><ImagePlus size={22} /><span>LOADING MEDIA...</span></div>
      ) : filteredItems.length === 0 ? (
        <div className="media-empty"><ImagePlus size={22} /><span>{query ? "NO MATCHING MEDIA" : "MEDIA LIBRARY IS EMPTY"}</span><small>Upload images to build a reusable asset library.</small></div>
      ) : (
        <div className="media-grid">
          {filteredItems.map((item) => (
            <article key={item.id} className={`media-card ${selected?.id === item.id ? "is-selected" : ""}`} onClick={() => setSelected(item)}>
              <div className="media-thumb"><img src={item.public_url} alt={item.name} loading="lazy" /></div>
              <div className="media-card-copy">
                <strong title={item.file_name}>{item.file_name}</strong>
                <span>{formatBytes(item.size_bytes)} · {item.mime_type.replace("image/", "").toUpperCase()}</span>
              </div>
              <div className="media-card-actions">
                <button type="button" onClick={(event) => { event.stopPropagation(); void copyUrl(item); }} title="Copy URL">
                  {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                </button>
                <button type="button" onClick={(event) => { event.stopPropagation(); void deleteMedia(item); }} title="Delete media"><Trash2 size={13} /></button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selected && (
        <div className="media-detail-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <div className="media-detail">
            <button className="media-detail-close" type="button" onClick={() => setSelected(null)}><X size={15} /></button>
            <div className="media-detail-image"><img src={selected.public_url} alt={selected.name} /></div>
            <div className="media-detail-info">
              <span className="admin-eyebrow">MEDIA ASSET</span>
              <h2>{selected.name}</h2>
              <p>{selected.file_name}</p>
              <div className="media-detail-stats"><span>{formatBytes(selected.size_bytes)}</span><span>{selected.mime_type}</span></div>
              <div className="media-detail-url">{selected.public_url}</div>
              <button type="button" className="media-copy-large" onClick={() => void copyUrl(selected)}>
                {copiedId === selected.id ? <Check size={14} /> : <Copy size={14} />} {copiedId === selected.id ? "COPIED" : "COPY PUBLIC URL"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
