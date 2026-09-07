import { ReactNode } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  return <>{children}</>;
};

export default SmoothScroll;