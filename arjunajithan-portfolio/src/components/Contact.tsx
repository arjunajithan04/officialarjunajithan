import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const titleX = useTransform(
    scrollYProgress,
    [0, 1],
    ["8%", "-5%"]
  );

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-section"
    >
      <div className="contact-container">

        {/* TOP */}
        <div className="contact-top">
          <span>06 / CONTACT</span>
          <span>LET'S BUILD SOMETHING</span>
        </div>

        {/* MAIN TITLE */}
        <div className="contact-heading-wrapper">
          <motion.h2 style={{ x: titleX }}>
            LET'S
            <span>TALK.</span>
          </motion.h2>
        </div>

        {/* INTRO */}
        <div className="contact-intro">
          <p>
            Have an idea, project or opportunity
            you'd like to discuss?
          </p>

          <p>
            I'm always interested in meeting people,
            exploring ideas and building something
            meaningful.
          </p>
        </div>

        {/* EMAIL */}
        <div className="contact-email">
          <span>GET IN TOUCH</span>

          <a href="mailto:arjunajithan04@gmail.com">
            arjunajithan04@gmail.com
            <ArrowUpRight size={24} />
          </a>
        </div>

        {/* SOCIAL LINKS */}
        <div className="contact-links">

          <ContactLink
            number="01"
            label="GITHUB"
            href="https://github.com/arjunajithan04"
          />

          <ContactLink
            number="02"
            label="LINKEDIN"
            href="https://www.linkedin.com/in/arjunajithan"
          />

          <ContactLink
            number="03"
            label="INSTAGRAM"
            href="https://www.instagram.com/arjunajithan"
          />

        </div>

        {/* FOOTER */}
        <footer className="contact-footer">

          <div>
            <span>ARJUN AJITHAN</span>
            <span>PORTFOLIO — 2026</span>
          </div>

          <div>
            <span>MADE WITH CURIOSITY</span>
            <span>© 2026</span>
          </div>

        </footer>

      </div>
    </section>
  );
};


interface ContactLinkProps {
  number: string;
  label: string;
  href: string;
}


const ContactLink = ({
  number,
  label,
  href,
}: ContactLinkProps) => {

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="contact-link"
      whileHover="hover"
    >

      <span className="contact-link-number">
        {number}
      </span>

      <span className="contact-link-label">
        {label}
      </span>

      <motion.span
        className="contact-link-arrow"
        variants={{
          hover: {
            x: 8,
            y: -8,
            rotate: -10,
          },
        }}
      >
        ↗
      </motion.span>

    </motion.a>
  );
};


export default Contact;