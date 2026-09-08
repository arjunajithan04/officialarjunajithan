import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import "./navigation-dynamic.css";

type NavItem = {
  number: string;
  label: string;
  target: string;
};

const navItems: NavItem[] = [
  { number: "01", label: "HOME", target: "hero" },
  { number: "02", label: "WORK", target: "projects" },
  { number: "03", label: "EXPERIENCE", target: "experience" },
  { number: "04", label: "CAPABILITIES", target: "capabilities" },
  { number: "05", label: "ABOUT", target: "about" },
  { number: "06", label: "CONTACT", target: "contact" },
];

const ease = [0.22, 1, 0.36, 1] as const;

function getActiveSection(): string {
  const scrollPoint = window.scrollY + window.innerHeight * 0.32;
  let active = "hero";

  for (const item of navItems) {
    const element = document.getElementById(item.target);
    if (element && element.offsetTop <= scrollPoint) active = item.target;
  }

  return active;
}

function Navigation() {
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateNavigation = () => {
      setActive(getActiveSection());
      setScrolled(window.scrollY > 70);
    };

    updateNavigation();
    window.addEventListener("scroll", updateNavigation, { passive: true });
    window.addEventListener("resize", updateNavigation);

    return () => {
      window.removeEventListener("scroll", updateNavigation);
      window.removeEventListener("resize", updateNavigation);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navigateTo = (target: string) => {
    setMenuOpen(false);

    if (target === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    document.getElementById(target)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const activeItem = navItems.find((item) => item.target === active) ?? navItems[0];

  return (
    <>
      <motion.header
        className={`site-navigation dynamic-navigation ${scrolled ? "is-scrolled" : ""}`}
        animate={{ y: scrolled ? 8 : 0 }}
        transition={{ duration: 0.55, ease }}
      >
        <motion.button
          type="button"
          className="nav-logo dynamic-nav-logo"
          onClick={() => navigateTo("hero")}
          whileHover={{ rotate: -8, scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Back to home"
        >
          <img
            src="/images/nav-logo.png"
            alt="Arjun Ajithan"
            className="nav-logo-image"
          />
        </motion.button>

        <nav className="desktop-nav dynamic-desktop-nav" aria-label="Primary navigation">
          <div className="dynamic-nav-track">
            {navItems.map((item) => {
              const isActive = active === item.target;

              return (
                <button
                  type="button"
                  key={item.target}
                  className={`nav-item dynamic-nav-item ${isActive ? "active" : ""}`}
                  onClick={() => navigateTo(item.target)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <motion.span
                      className="dynamic-nav-active-pill"
                      layoutId="dynamic-nav-active"
                      transition={{ duration: 0.45, ease }}
                    />
                  )}
                  <span className="dynamic-nav-number">{item.number}</span>
                  <span className="dynamic-nav-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="dynamic-nav-status" aria-live="polite">
          <span className="dynamic-nav-status-dot" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={activeItem.target}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease }}
            >
              {activeItem.number} / {activeItem.label}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          className="mobile-menu-button dynamic-mobile-button"
          onClick={() => setMenuOpen((open) => !open)}
          whileTap={{ scale: 0.94 }}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={17} /> : <Menu size={17} />}
        </motion.button>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-navigation dynamic-mobile-navigation"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease }}
          >
            <div className="mobile-navigation-inner dynamic-mobile-inner">
              <div className="mobile-nav-label">ARJUN AJITHAN / PORTFOLIO 2026</div>

              <div className="mobile-nav-links">
                {navItems.map((item, index) => (
                  <motion.button
                    type="button"
                    key={item.target}
                    onClick={() => navigateTo(item.target)}
                    initial={{ opacity: 0, x: -35 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.06, duration: 0.55, ease }}
                  >
                    <span>{item.number}</span>
                    {item.label}
                    {active === item.target && <ArrowUpRight size={22} />}
                  </motion.button>
                ))}
              </div>

              <div className="mobile-nav-footer">
                <span>BUILDING WITH INTENT</span>
                <span>INDIA · 2026</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navigation;
