"use client";

import dynamic from "next/dynamic";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/app/theme-context";

// Dynamically import Navbar (client-side only)
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });

export default function ClientLayout({ children }: { children: ReactNode }) {
  console.log("Rendering ClientLayout");
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false); // To prevent hydration mismatch

  useEffect(() => {
    setIsMounted(true); // Ensure component is mounted on client
  }, []);

  // Exclude Navbar for /dashboard route
  const shouldRenderNavbar = isMounted && pathname !== "/dashboard";

  return (
    <ThemeProvider>
      {shouldRenderNavbar && <Navbar />}
      {children}
    </ThemeProvider>
  );
}