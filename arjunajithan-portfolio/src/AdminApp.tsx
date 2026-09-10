import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setAuthenticated(Boolean(data.user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setAuthenticated(Boolean(session?.user));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (authenticated === null) {
    return (
      <main className="admin-loading">
        <span className="admin-status-dot" />
        LOADING ADMIN...
      </main>
    );
  }

  return authenticated ? <AdminDashboard /> : <AdminLogin />;
}
