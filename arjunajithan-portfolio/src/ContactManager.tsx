import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Check, Save, X } from "lucide-react";
import { supabase } from "./lib/supabase";
import "./contact-manager.css";

type ContactRow = {
  id: string | number;
  email: string;
  linkedin: string;
  github: string;
  availability_status: string;
  availability_message: string;
  updated_at?: string;
};

type ContactForm = {
  email: string;
  linkedin: string;
  github: string;
  availability_status: string;
  availability_message: string;
};

const fallbackForm: ContactForm = {
  email: "arjunajithan04@gmail.com",
  linkedin: "https://www.linkedin.com/in/arjunajithan",
  github: "https://github.com/arjunajithan04",
  availability_status: "AVAILABLE",
  availability_message: "FOR OPPORTUNITIES",
};

export default function ContactManager() {
  const [contact, setContact] = useState<ContactRow | null>(null);
  const [form, setForm] = useState<ContactForm>(fallbackForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadContact = async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("contact")
      .select(
        "id, email, linkedin, github, availability_status, availability_message, updated_at"
      )
      .limit(1)
      .maybeSingle();

    if (queryError) {
      setError(queryError.message);
      setContact(null);
      setForm(fallbackForm);
      setLoading(false);
      return;
    }

    if (!data) {
      setContact(null);
      setForm(fallbackForm);
      setLoading(false);
      return;
    }

    const row = data as ContactRow;
    setContact(row);
    setForm({
      email: row.email ?? "",
      linkedin: row.linkedin ?? "",
      github: row.github ?? "",
      availability_status: row.availability_status ?? "",
      availability_message: row.availability_message ?? "",
    });
    setLoading(false);
  };

  useEffect(() => {
    void loadContact();
  }, []);

  const updateField = (field: keyof ContactForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      email: form.email.trim(),
      linkedin: form.linkedin.trim(),
      github: form.github.trim(),
      availability_status: form.availability_status.trim(),
      availability_message: form.availability_message.trim(),
      updated_at: new Date().toISOString(),
    };

    if (!payload.email) {
      setError("Email is required.");
      setSaving(false);
      return;
    }

    const result = contact
      ? await supabase.from("contact").update(payload).eq("id", contact.id)
      : await supabase.from("contact").insert(payload);

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    setMessage("CONTACT DETAILS UPDATED.");
    await loadContact();
    setSaving(false);
  };

  if (loading) {
    return <div className="contact-manager-state">LOADING CONTACT MODULE...</div>;
  }

  return (
    <section className="contact-manager">
      <div className="contact-manager-toolbar">
        <div>
          <span className="admin-eyebrow">05 / CONTENT MODULE</span>
          <p className="contact-manager-count">
            SINGLETON CONTACT RECORD / LIVE DATABASE
          </p>
        </div>

        <div className="contact-manager-live">
          <span />
          PUBLIC CONTACT CONNECTED
        </div>
      </div>

      {(message || error) && (
        <div className={`contact-manager-feedback ${error ? "is-error" : ""}`}>
          {error ? <X size={14} /> : <Check size={14} />}
          {error || message}
        </div>
      )}

      <form className="contact-manager-form" onSubmit={save}>
        <div className="contact-manager-section">
          <div className="contact-manager-section-heading">
            <span>01 / DIRECT LINE</span>
            <h2>Reach me.</h2>
          </div>

          <div className="contact-manager-grid">
            <label>
              EMAIL
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                required
              />
            </label>

            <label>
              AVAILABILITY STATUS
              <input
                value={form.availability_status}
                onChange={(event) =>
                  updateField("availability_status", event.target.value)
                }
                placeholder="AVAILABLE"
              />
            </label>

            <label className="contact-manager-full">
              AVAILABILITY MESSAGE
              <input
                value={form.availability_message}
                onChange={(event) =>
                  updateField("availability_message", event.target.value)
                }
                placeholder="FOR OPPORTUNITIES"
              />
            </label>
          </div>
        </div>

        <div className="contact-manager-section">
          <div className="contact-manager-section-heading">
            <span>02 / ELSEWHERE</span>
            <h2>Find me.</h2>
          </div>

          <div className="contact-manager-grid">
            <label>
              LINKEDIN URL
              <input
                type="url"
                value={form.linkedin}
                onChange={(event) => updateField("linkedin", event.target.value)}
                placeholder="https://www.linkedin.com/in/..."
              />
            </label>

            <label>
              GITHUB URL
              <input
                type="url"
                value={form.github}
                onChange={(event) => updateField("github", event.target.value)}
                placeholder="https://github.com/..."
              />
            </label>
          </div>
        </div>

        {error && <div className="contact-manager-form-error">{error}</div>}

        <div className="contact-manager-footer">
          <span>Changes are reflected on the public portfolio after save.</span>
          <button type="submit" disabled={saving}>
            <Save size={14} />
            {saving ? "SAVING..." : "SAVE CONTACT"}
          </button>
        </div>
      </form>
    </section>
  );
}
