import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Check, ExternalLink, RefreshCw, Save } from "lucide-react";
import { supabase } from "./lib/supabase";
import "./site-settings-manager.css";

type SiteSettings = {
  id: string;
  site_name: string;
  display_name: string;
  tagline: string;
  location: string;
  portfolio_year: string;
  status_line: string;
  footer_text: string;
  resume_url: string;
  meta_title: string;
  meta_description: string;
  og_image_url: string;
  favicon_url: string;
};

const defaults: SiteSettings = {
  id: "global",
  site_name: "ARJUN AJITHAN",
  display_name: "Arjun Ajithan",
  tagline: "MCA STUDENT · DEVELOPER · BUILDER",
  location: "INDIA",
  portfolio_year: "2026",
  status_line: "BUILDING WITH INTENT",
  footer_text: "BUILT WITH REACT ↗",
  resume_url: "",
  meta_title: "Arjun Ajithan — Portfolio",
  meta_description: "Portfolio of Arjun Ajithan — developer, builder and MCA student.",
  og_image_url: "",
  favicon_url: "/images/logo27.ico",
};

export default function SiteSettingsManager() {
  const [form, setForm] = useState<SiteSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    const { data, error: loadError } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", "global")
      .maybeSingle();

    if (loadError) {
      setError(loadError.message);
      setLoading(false);
      return;
    }

    setForm({ ...defaults, ...(data ?? {}) });
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const update = (key: keyof SiteSettings, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setMessage("");
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");

    const { error: saveError } = await supabase
      .from("site_settings")
      .upsert(form, { onConflict: "id" });

    if (saveError) {
      setError(saveError.message);
    } else {
      setMessage("SETTINGS SAVED");
    }

    setSaving(false);
  };

  if (loading) {
    return <div className="site-settings-state">LOADING SITE CONFIGURATION...</div>;
  }

  return (
    <div className="site-settings">
      <div className="site-settings-toolbar">
        <div>
          <span className="site-settings-kicker">GLOBAL CONFIGURATION / 01</span>
          <p>Values here feed the public portfolio without requiring a code change.</p>
        </div>
        <div className="site-settings-actions">
          <button type="button" className="site-settings-button secondary" onClick={() => void load()} disabled={saving}>
            <RefreshCw size={14} /> REFRESH
          </button>
          <button type="button" className="site-settings-button primary" onClick={() => void save()} disabled={saving}>
            {saving ? <RefreshCw className="is-spinning" size={14} /> : <Save size={14} />}
            {saving ? "SAVING" : "SAVE SETTINGS"}
          </button>
        </div>
      </div>

      {message && <div className="site-settings-message"><Check size={14} /> {message}</div>}
      {error && <div className="site-settings-error">{error}</div>}

      <div className="site-settings-grid">
        <SettingsGroup title="IDENTITY">
          <Field label="Site / Brand Name" value={form.site_name} onChange={(v) => update("site_name", v)} />
          <Field label="Display Name" value={form.display_name} onChange={(v) => update("display_name", v)} />
          <Field label="Tagline" value={form.tagline} onChange={(v) => update("tagline", v)} />
          <div className="site-settings-fields-two">
            <Field label="Location" value={form.location} onChange={(v) => update("location", v)} />
            <Field label="Portfolio Year" value={form.portfolio_year} onChange={(v) => update("portfolio_year", v)} />
          </div>
          <Field label="Status Line" value={form.status_line} onChange={(v) => update("status_line", v)} />
        </SettingsGroup>

        <SettingsGroup title="SEO / SHARING">
          <Field label="Meta Title" value={form.meta_title} onChange={(v) => update("meta_title", v)} />
          <TextArea label="Meta Description" value={form.meta_description} onChange={(v) => update("meta_description", v)} />
          <Field label="Open Graph Image URL" value={form.og_image_url} onChange={(v) => update("og_image_url", v)} placeholder="https://..." />
          <Field label="Favicon URL" value={form.favicon_url} onChange={(v) => update("favicon_url", v)} />
        </SettingsGroup>

        <SettingsGroup title="PORTFOLIO LINKS">
          <Field label="Resume / CV URL" value={form.resume_url} onChange={(v) => update("resume_url", v)} placeholder="https://..." />
          <Field label="Footer Text" value={form.footer_text} onChange={(v) => update("footer_text", v)} />

          <div className="site-settings-preview-link">
            <span>PUBLIC SITE</span>
            <a href="/" target="_blank" rel="noreferrer">OPEN PORTFOLIO <ExternalLink size={13} /></a>
          </div>
        </SettingsGroup>
      </div>
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="site-settings-group">
      <header><span>{title}</span><i /></header>
      <div className="site-settings-group-body">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="site-settings-field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="site-settings-field">
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
    </label>
  );
}
