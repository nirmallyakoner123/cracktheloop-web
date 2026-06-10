"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Bypassing global smooth scrolling inside application panels/live workspaces to preserve native scrolling
  const isAppPanel = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/call-session");

  if (isAppPanel) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
      }}
    >
      {children}
    </ReactLenis>
  );
}
