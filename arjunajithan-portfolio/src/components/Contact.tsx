import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useSiteSettings } from "../useSiteSettings";

type ContactData = {
  email: string;
  linkedin: string;
  github: string;
  availability_status: string;
  availability_message: string;
};

const fallbackContact: ContactData = {
  email: "arjunajithan04@gmail.com",
  linkedin: "https://www.linkedin.com/in/arjunajithan",
  github: "https://github.com/arjunajithan04",
  availability_status: "AVAILABLE",
  availability_message: "FOR OPPORTUNITIES",
};

const contactEase = [0.22, 1, 0.36, 1] as const;

const Contact = () => {
  const settings = useSiteSettings();
  const [contact, setContact] = useState<ContactData>(fallbackContact);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadContact = async () => {
      const { data, error } = await supabase
        .from("contact")
        .select(
          "email, linkedin, github, availability_status, availability_message"
        )
        .limit(1)
        .maybeSingle();

      if (!mounted || error || !data) return;

      setContact({
        email: data.email ?? fallbackContact.email,
        linkedin: data.linkedin ?? fallbackContact.linkedin,
        github: data.github ?? fallbackContact.github,
        availability_status:
          data.availability_status ?? fallbackContact.availability_status,
        availability_message:
          data.availability_message ?? fallbackContact.availability_message,
      });
    };

    void loadContact();

    return () => {
      mounted = false;
    };
  }, []);

  const socials = [
    {
      number: "01",
      label: "LinkedIn",
      description: "Let's connect professionally.",
      meta: "NETWORK / PROFESSIONAL",
      href: contact.linkedin,
      icon: "/images/in.svg",
      iconAlt: "LinkedIn",
    },
    {
      number: "02",
      label: "GitHub",
      description: "Check out my work.",
      meta: "CODE / PROJECTS",
      href: contact.github,
      icon: "/images/gh.svg",
      iconAlt: "GitHub",
    },
  ];

  const availabilityStatus =
    contact.availability_status.trim() || "AVAILABLE";

  const availabilityMessage =
    contact.availability_message.trim() || "FOR OPPORTUNITIES";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);

      setCopied(true);

      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${contact.email}`;
    }
  };

  return (
    <section id="contact" className="contact-v3">
      <div className="contact-v3-shell">

        {/* ============================================================
            HEADER
        ============================================================ */}

        <motion.div
          className="contact-v3-top"
          initial={{ opacity: 0, y: -18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{
            duration: 0.65,
            ease: contactEase,
          }}
        >
          <span>06 / CONTACT</span>

          <span className="contact-v3-flow">
            IDEAS <i>→</i> PEOPLE <i>→</i> OPPORTUNITIES
          </span>

          <span className="contact-v3-top-right">
            OPEN TO GOOD CONVERSATIONS
          </span>
        </motion.div>

        {/* ============================================================
            HERO
        ============================================================ */}

        <div className="contact-v3-hero">

          <motion.div
            className="contact-v3-title"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{
              duration: 0.95,
              ease: contactEase,
            }}
          >
            <span className="contact-v3-title-solid">
              LET&apos;S
            </span>

            <span className="contact-v3-title-outline">
              TALK.
            </span>

            <div className="contact-v3-side-note">
              SAME
              <br />
              IDEAS.
              <br />
              BIGGER
              <br />
              POSSIBILITIES.
              <span />
            </div>
          </motion.div>

          <motion.div
            className="contact-v3-intro"
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{
              duration: 0.8,
              delay: 0.14,
              ease: contactEase,
            }}
          >
            <p className="contact-v3-lead">
              Have an idea, opportunity or simply something worth discussing?
              I&apos;m always interested in hearing what you&apos;re working on.
            </p>

            <p>
              Whether it&apos;s software, web, emerging technology or a problem
              that needs a different perspective — let&apos;s start with a
              conversation.
            </p>

            <div className="contact-v3-tags">
              <span>[ OPPORTUNITIES ]</span>
              <span>[ COLLABORATIONS ]</span>
              <span>[ RANDOM IDEAS ]</span>
            </div>
          </motion.div>

          {/* Decorative visual panel */}

          <motion.div
            className="contact-v3-portrait"
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{
              duration: 1.05,
              delay: 0.08,
              ease: contactEase,
            }}
          >
            <div className="contact-v3-noise" />

            <div className="contact-v3-building">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="contact-v3-portrait-copy top">
              GOOD
              <br />
              IDEAS
              <br />
              FIND
              <br />
              PEOPLE.
              <br />
              <em>—</em>
            </div>

            <div className="contact-v3-portrait-copy bottom">
              LET&apos;S
              <br />
              BUILD
              <br />
              SOMETHING
              <br />
              GREAT.
              <br />
              <em>—</em>
            </div>
          </motion.div>
        </div>

        {/* ============================================================
            DIRECT LINE
        ============================================================ */}

        <motion.div
          className="contact-v3-direct"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{
            duration: 0.8,
            delay: 0.05,
            ease: contactEase,
          }}
        >
          <div className="contact-v3-direct-label">
            <span>01 / DIRECT LINE</span>

            <span className="contact-v3-availability">
              <i />

              {availabilityStatus}

              <br />

              {availabilityMessage}
            </span>
          </div>

          <div className="contact-v3-email-row">

            <a
              href={`mailto:${contact.email}`}
              className="contact-v3-email"
            >
              {contact.email}
            </a>

            <div className="contact-v3-email-actions">

              <a
                href={`mailto:${contact.email}`}
                className="contact-v3-send"
                aria-label="Send an email"
              >
                <ArrowUpRight
                  size={25}
                  strokeWidth={1.5}
                />

                <span>SEND MAIL</span>
              </a>

              <button
                type="button"
                className="contact-v3-copy"
                onClick={copyEmail}
                aria-label={
                  copied
                    ? "Email copied"
                    : "Copy email address"
                }
              >
                <AnimatePresence
                  mode="wait"
                  initial={false}
                >
                  {copied ? (
                    <motion.span
                      key="done"
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                      }}
                    >
                      <Check size={19} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                      }}
                    >
                      <Copy size={19} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

            </div>
          </div>

          <div className="contact-v3-direct-bottom">
            <span>DROP A MAIL. ANYTIME.</span>
            <span>FASTEST WAY TO REACH ME.</span>
          </div>
        </motion.div>

        {/* ============================================================
            ELSEWHERE
        ============================================================ */}

        <div className="contact-v3-elsewhere">

          <motion.div
            className="contact-v3-section-label"
            initial={{
              opacity: 0,
              y: 22,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: false,
              amount: 0.35,
            }}
            transition={{
              duration: 0.65,
              ease: contactEase,
            }}
          >
            <span>02 / ELSEWHERE</span>
            <span>FIND ME AROUND THE WEB</span>
          </motion.div>

          <div className="contact-v3-elsewhere-grid">

            <div className="contact-v3-socials">

              {socials.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-v3-social"
                  initial={{
                    opacity: 0,
                    y: 38,
                    scale: 0.985,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  viewport={{
                    once: false,
                    amount: 0.18,
                  }}
                  transition={{
                    duration: 0.72,
                    delay: index * 0.11,
                    ease: contactEase,
                  }}
                >
                  <span className="contact-v3-social-number">
                    {social.number}
                  </span>

                  <span className="contact-v3-social-icon">
                    <img
                      src={social.icon}
                      alt={social.iconAlt}
                    />
                  </span>

                  <span className="contact-v3-social-copy">
                    <strong>{social.label}</strong>
                    <small>{social.description}</small>
                  </span>

                  <span className="contact-v3-social-meta">
                    {social.meta}
                  </span>

                  <ArrowUpRight
                    className="contact-v3-social-arrow"
                    size={25}
                    strokeWidth={1.5}
                  />
                </motion.a>
              ))}

            </div>

            {/* Mini visual */}

            <motion.div
              className="contact-v3-info-visual"
              initial={{
                opacity: 0,
                y: 34,
                scale: 0.98,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{
                once: false,
                amount: 0.2,
              }}
              transition={{
                duration: 0.8,
                delay: 0.16,
                ease: contactEase,
              }}
            >
              <div className="contact-v3-mini-building">
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="contact-v3-mini-copy">
                TECH
                <br />
                PEOPLE
                <br />
                IDEAS
                <br />
                IMPACT
                <br />
                <em>—</em>
              </div>
            </motion.div>

            {/* Facts */}

            <motion.div
              className="contact-v3-facts"
              initial={{
                opacity: 0,
                x: 24,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: false,
                amount: 0.2,
              }}
              transition={{
                duration: 0.72,
                delay: 0.24,
                ease: contactEase,
              }}
            >
              <span>INDIA / IST</span>
              <span>MCA STUDENT</span>
              <span>DEVELOPER</span>
              <span>BUILDER</span>
            </motion.div>

          </div>
        </div>

        {/* ============================================================
            CLOSING
        ============================================================ */}

        <motion.div
          className="contact-v3-closing"
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
            amount: 0.25,
          }}
          transition={{
            duration: 0.85,
            ease: contactEase,
          }}
        >
          <div className="contact-v3-closing-main">
            <ArrowUpRight
              size={17}
              strokeWidth={1.5}
            />

            <strong>
              THE NEXT GOOD IDEA
              <br />
              COULD START HERE.
            </strong>
          </div>

          <div className="contact-v3-closing-line" />

          <span>
            [ LET&apos;S CREATE WHAT&apos;S NEXT ]
          </span>

          <div className="contact-v3-closing-line short" />

          <span className="contact-v3-closing-mark">
            AA
          </span>
        </motion.div>

        {/* ============================================================
            FOOTER
        ============================================================ */}

        <motion.div
          className="contact-v3-footer"
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
            amount: 0.35,
          }}
          transition={{
            duration: 0.65,
            delay: 0.08,
            ease: contactEase,
          }}
        >
          <span>
            © {settings.portfolio_year} {settings.display_name.toUpperCase()}
          </span>

          <span>
            {settings.footer_text}
          </span>

          <span>
            06 / 06
          </span>
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;