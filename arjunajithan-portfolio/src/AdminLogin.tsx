import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
      <motion.div
        className="admin-auth-grid"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 0.55, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="admin-auth-orbit"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      />

      <header className="admin-auth-top">
        <motion.a
          className="admin-brand"
          href="/"
          aria-label="Return to portfolio"
          initial={{ opacity: 0, y: -18, rotate: -8 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -2, rotate: 2 }}
        >
          AA
        </motion.a>
        <motion.span
          className="admin-auth-status"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 0.65, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
        >
          <span className="admin-status-dot" />
          PRIVATE AREA
        </motion.span>
      </header>

      <motion.section
        className="admin-auth-panel"
        initial={{ opacity: 0, y: 42 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.95, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="admin-auth-kicker"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>00</span>
          <span>/</span>
          <span>ADMIN ACCESS</span>
        </motion.div>

        <motion.div
          className="admin-auth-heading"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.5 }}
        >
          <LockKeyhole size={18} strokeWidth={1.5} />
          <p>PORTFOLIO CONTROL</p>
        </motion.div>

        <h1>
          <span className="admin-title-line">Welcome</span>
          <br />
          <span className="admin-title-line admin-title-line-delay">back<span>.</span></span>
        </h1>

        <motion.p
          className="admin-auth-description"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          Manage projects, experience, capabilities and portfolio content from
          one place.
        </motion.p>

        <motion.form
          className="admin-login-form"
          onSubmit={handleLogin}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { delayChildren: 0.82, staggerChildren: 0.11 },
            },
          }}
        >
          <motion.label
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0 },
            }}
          >
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
          </motion.label>

          <motion.label
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0 },
            }}
          >
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
          </motion.label>

          {error && (
            <motion.div
              className="admin-login-error"
              role="alert"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <X size={14} />
              <span>{error}</span>
            </motion.div>
          )}

          <motion.button
            className="admin-submit"
            type="submit"
            disabled={busy}
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
          >
            <span>{busy ? "AUTHENTICATING..." : "ENTER ADMIN"}</span>
            <ArrowRight size={16} />
          </motion.button>
        </motion.form>

        <motion.p
          className="admin-auth-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.25 }}
        >
          AUTHORIZED ACCESS ONLY / <a href="/">RETURN TO SITE</a>
        </motion.p>
      </motion.section>
    </main>
  );
}
