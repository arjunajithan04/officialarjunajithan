import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, LockKeyhole, X } from "lucide-react";
import { supabase } from "./lib/supabase";
import "./admin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Admin / Arjun Ajithan";
    return () => {
      document.title = "Arjun Ajithan";
    };
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(authError.message || "Unable to sign in.");
      setBusy(false);
      return;
    }

    const adminId = import.meta.env.VITE_SUPABASE_ADMIN_USER_ID;

    if (adminId && data.user?.id !== adminId) {
      await supabase.auth.signOut();
      setError("This account is not authorized for the portfolio admin.");
      setBusy(false);
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <main className="admin-auth-page">
      <div className="admin-auth-grid" aria-hidden="true" />

      <header className="admin-auth-top">
        <a className="admin-brand" href="/" aria-label="Return to portfolio">
          AA
        </a>
        <span className="admin-auth-status">
          <span className="admin-status-dot" />
          PRIVATE AREA
        </span>
      </header>

      <section className="admin-auth-panel">
        <div className="admin-auth-kicker">
          <span>00</span>
          <span>/</span>
          <span>ADMIN ACCESS</span>
        </div>

        <div className="admin-auth-heading">
          <LockKeyhole size={18} strokeWidth={1.5} />
          <p>PORTFOLIO CONTROL</p>
        </div>

        <h1>
          Welcome
          <br />
          back<span>.</span>
        </h1>

        <p className="admin-auth-description">
          Manage projects, experience, capabilities and portfolio content from
          one place.
        </p>

        <form className="admin-login-form" onSubmit={handleLogin}>
          <label>
            <span>EMAIL</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={busy}
            />
          </label>

          <label>
            <span>PASSWORD</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              disabled={busy}
            />
          </label>

          {error && (
            <div className="admin-login-error" role="alert">
              <X size={14} />
              <span>{error}</span>
            </div>
          )}

          <button className="admin-submit" type="submit" disabled={busy}>
            <span>{busy ? "AUTHENTICATING..." : "ENTER ADMIN"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="admin-auth-footer">
          AUTHORIZED ACCESS ONLY / <a href="/">RETURN TO SITE</a>
        </p>
      </section>
    </main>
  );
}
