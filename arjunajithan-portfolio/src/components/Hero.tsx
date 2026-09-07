import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEffect } from "react";

const firstName = "ARJUN";
const lastName = "AJITHAN";

function Hero() {
  /*
   * ----------------------------------------
   * MOUSE POSITION
   * ----------------------------------------
   */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  /*
   * Spring makes the movement feel natural
   * instead of directly following the mouse.
   */

  const smoothX = useSpring(mouseX, {
    stiffness: 80,
    damping: 20,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 80,
    damping: 20,
  });

  /*
   * Convert mouse movement into subtle
   * movement of the typography.
   */

  const titleX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const titleY = useTransform(smoothY, [-1, 1], [-12, 12]);

  const outlineX = useTransform(smoothX, [-1, 1], [12, -12]);
  const outlineY = useTransform(smoothY, [-1, 1], [8, -8]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      /*
       * Convert mouse coordinates into a
       * value between -1 and 1.
       */

      const x =
        (event.clientX / window.innerWidth) * 2 - 1;

      const y =
        (event.clientY / window.innerHeight) * 2 - 1;

      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, [mouseX, mouseY]);

  return (
    <section className="hero">

      {/* =====================================
          TOP METADATA
      ====================================== */}

      <div className="hero-meta">

        <motion.span
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.2,
          }}
        >
          PORTFOLIO / 2026
        </motion.span>

        <motion.span
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.35,
          }}
        >
          INDIA
        </motion.span>

      </div>


      {/* =====================================
          MAIN HERO CONTENT
      ====================================== */}

      <div className="hero-content">

        <motion.p
          className="hero-intro"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.5,
          }}
        >
          MCA STUDENT · DEVELOPER · BUILDER
        </motion.p>


        {/* ===================================
            FIRST NAME
        ==================================== */}

        <motion.div
          className="hero-title-wrapper"
          style={{
            x: titleX,
            y: titleY,
          }}
        >
          <h1 className="hero-title hero-solid">
            {firstName.split("").map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                initial={{
                  opacity: 0,
                  y: 120,
                  rotateX: 80,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.65 + index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </motion.div>


        {/* ===================================
            LAST NAME
        ==================================== */}

        <motion.div
          className="hero-title-wrapper hero-outline-wrapper"
          style={{
            x: outlineX,
            y: outlineY,
          }}
        >
          <h1 className="hero-title hero-outline">
            {lastName.split("").map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                initial={{
                  opacity: 0,
                  y: 120,
                  rotateX: -80,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                }}
                transition={{
                  duration: 0.9,
                  delay: 0.95 + index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>
        </motion.div>


        {/* ===================================
            DECORATIVE LINE
        ==================================== */}

        <motion.div
          className="hero-line"
          initial={{
            scaleX: 0,
            transformOrigin: "left",
          }}
          animate={{
            scaleX: 1,
          }}
          transition={{
            duration: 1.2,
            delay: 1.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        />

      </div>


      {/* =====================================
          BOTTOM INFORMATION
      ====================================== */}

      <div className="hero-bottom">

        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 1.55,
          }}
        >
          Building practical digital experiences
          <br />
          across software, web & emerging technology.
        </motion.p>


        <motion.a
          href="#work"
          className="scroll-indicator"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 1.8,
          }}
        >

          <motion.span
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowDown size={20} />
          </motion.span>

          SCROLL TO EXPLORE

        </motion.a>

      </div>

    </section>
  );
}

export default Hero;