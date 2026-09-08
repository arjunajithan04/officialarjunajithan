import { ArrowUpRight } from "lucide-react";

import Cursor from "./components/Cursor";
import SmartCursor from "./components/SmartCursor";
import ScrollProgress from "./components/ScrollProgress";
import SectionTransition from "./components/SectionTransition";
import SmoothScroll from "./components/SmoothScroll";
import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Capabilities from "./components/Capabilities";
import About from "./components/About";
import Contact from "./components/Contact";
import Navigation from "./components/Navigation";

function App() {
  return (
    <SmoothScroll>
      <Cursor />
      <ScrollProgress />
      <SectionTransition />
      <SmartCursor />
      <Navigation />

      <main className="portfolio">
        {/* ================= HERO ================= */}
        <Hero />

        {/* ================= PROJECTS ================= */}
        <Projects />

        {/* ================= EXPERIENCE ================= */}
        <Experience />

        {/* ================= CAPABILITIES ================= */}
        <Capabilities />

        {/* ================= ABOUT ================= */}
        <About />

        {/* ================= CONTACT ================= */}
        <Contact />

        {/* ================= FOOTER ================= */}
      </main>
    </SmoothScroll>
  );
}

export default App;