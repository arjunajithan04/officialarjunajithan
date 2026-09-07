import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  {
    label: "WORK",
    target: "projects",
  },
  {
    label: "EXPERIENCE",
    target: "experience",
  },
  {
    label: "ABOUT",
    target: "about",
  },
  {
    label: "CONTACT",
    target: "contact",
  },
];

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("projects");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.target))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-20% 0px -50% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (target: string) => {
    const section = document.getElementById(target);

    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMenuOpen(false);
  };

  return (
    <>
      <header className="site-navigation">
        <button
          className="nav-logo"
          onClick={() => window.scrollTo({
            top: 0,
            behavior: "smooth",
          })}
          aria-label="Go to top"
        >
          AA
        </button>

        <nav className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.target}
              className={`nav-item ${
                activeSection === item.target
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                scrollToSection(item.target)
              }
            >
              <span>{item.label}</span>

              <span className="nav-indicator" />
            </button>
          ))}
        </nav>

        <button
          className={`mobile-menu-button ${
            menuOpen ? "open" : ""
          }`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
        >
          <span />
          <span />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-navigation"
            initial={{
              opacity: 0,
              clipPath: "inset(0 0 100% 0)",
            }}
            animate={{
              opacity: 1,
              clipPath: "inset(0 0 0% 0)",
            }}
            exit={{
              opacity: 0,
              clipPath: "inset(0 0 100% 0)",
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="mobile-navigation-inner">
              <span className="mobile-nav-label">
                NAVIGATION
              </span>

              <div className="mobile-nav-links">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.target}
                    onClick={() =>
                      scrollToSection(item.target)
                    }
                    initial={{
                      opacity: 0,
                      y: 30,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.08 + index * 0.06,
                    }}
                  >
                    <span>0{index + 1}</span>
                    {item.label}
                  </motion.button>
                ))}
              </div>

              <div className="mobile-nav-footer">
                <span>ARJUN AJITHAN</span>
                <span>PORTFOLIO — 2026</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;