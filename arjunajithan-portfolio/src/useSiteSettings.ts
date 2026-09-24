import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export type SiteSettings = {
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

export const defaultSiteSettings: SiteSettings = {
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

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", "global").maybeSingle();
      if (mounted && data) setSettings({ ...defaultSiteSettings, ...data });
    };
    void load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    document.title = settings.meta_title;

    const description = document.querySelector('meta[name="description"]') ?? document.createElement("meta");
    description.setAttribute("name", "description");
    description.setAttribute("content", settings.meta_description);
    if (!description.parentNode) document.head.appendChild(description);

    const ogTitle = document.querySelector('meta[property="og:title"]') ?? document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    ogTitle.setAttribute("content", settings.meta_title);
    if (!ogTitle.parentNode) document.head.appendChild(ogTitle);

    const ogDescription = document.querySelector('meta[property="og:description"]') ?? document.createElement("meta");
    ogDescription.setAttribute("property", "og:description");
    ogDescription.setAttribute("content", settings.meta_description);
    if (!ogDescription.parentNode) document.head.appendChild(ogDescription);

    if (settings.og_image_url) {
      const ogImage = document.querySelector('meta[property="og:image"]') ?? document.createElement("meta");
      ogImage.setAttribute("property", "og:image");
      ogImage.setAttribute("content", settings.og_image_url);
      if (!ogImage.parentNode) document.head.appendChild(ogImage);
    }

    if (settings.favicon_url) {
      const favicon = document.querySelector('link[rel="icon"]') ?? document.createElement("link");
      favicon.setAttribute("rel", "icon");
      favicon.setAttribute("href", settings.favicon_url);
      if (!favicon.parentNode) document.head.appendChild(favicon);
    }
  }, [settings]);

  return settings;
}
