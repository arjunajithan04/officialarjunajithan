import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const cursorEase = [0.22, 1, 0.36, 1] as const;

type CursorState = {
  label: string;
  active: boolean;
};

function getCursorState(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) {
    return { label: "", active: false };
  }

  const element = target.closest(
    "[data-cursor], .project-row-enhanced, .project-row, .contact-v3-email, .contact-v3-send, .contact-v3-copy, .contact-v3-social, img, a, button"
  );

  if (!(element instanceof Element)) {
    return { label: "", active: false };
  }

  const explicit = element.getAttribute("data-cursor");
  if (explicit) return { label: explicit, active: true };

  if (element.matches(".project-row-enhanced, .project-row")) {
    return { label: "VIEW", active: true };
  }

  if (element.matches(".contact-v3-email, .contact-v3-send")) {
    return { label: "MAIL", active: true };
  }

  if (element.matches(".contact-v3-copy")) {
    return { label: "COPY", active: true };
  }

  if (element.matches(".contact-v3-social")) {
    return { label: "OPEN", active: true };
  }

  if (element.matches("img")) {
    return { label: "EXPLORE", active: true };
  }

  if (element.matches("a, button")) {
    return { label: "OPEN", active: true };
  }

  return { label: "", active: false };
}

export default function SmartCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const smoothX = useSpring(x, {
    stiffness: 420,
    damping: 34,
    mass: 0.35,
  });

  const smoothY = useSpring(y, {
    stiffness: 420,
    damping: 34,
    mass: 0.35,
  });

  const [cursor, setCursor] = useState<CursorState>({
    label: "",
    active: false,
  });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;

      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      setCursor(getCursorState(event.target));
    };

    const handlePointerLeave = () => {
      setVisible(false);
      setCursor({ label: "", active: false });
    };

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      setCursor(getCursorState(event.target));
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [x, y]);

  return (
    <motion.div
      className={`smart-cursor ${cursor.active ? "is-active" : ""}`}
      style={{ x: smoothX, y: smoothY }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: cursor.active ? 1 : 0.72,
      }}
      transition={{ duration: 0.22, ease: cursorEase }}
      aria-hidden="true"
    >
      <motion.span
        key={cursor.label || "idle"}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: cursor.active ? 1 : 0, y: 0 }}
        transition={{ duration: 0.18, ease: cursorEase }}
      >
        {cursor.label}
      </motion.span>
    </motion.div>
  );
}