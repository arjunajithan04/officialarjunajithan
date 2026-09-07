import {
  type MouseEvent,
  type ReactNode,
  useRef,
} from "react";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

function Magnetic({
  children,
  strength = 0.25,
  className = "",
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const x =
      (event.clientX - (rect.left + rect.width / 2)) * strength;

    const y =
      (event.clientY - (rect.top + rect.height / 2)) * strength;

    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;

    ref.current.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <div
      ref={ref}
      className={`magnetic ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

export default Magnetic;