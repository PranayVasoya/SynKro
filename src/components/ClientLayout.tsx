"use client";

import dynamic from "next/dynamic";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/app/theme-context";

// ✨ 1. Import the ChatWidget component
import { ChatWidget } from "./chatbot/ChatWidget"; // Make sure this path is correct

// Dynamically import Navbar (client-side only)
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });

export default function ClientLayout({ children }: { children: ReactNode }) {
  console.log("Rendering ClientLayout");
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false); // To prevent hydration mismatch

  useEffect(() => {
    setIsMounted(true); // This will be true only after the initial render on the client
  }, []);

  // Exclude Navbar for /dashboard route
  const shouldRenderNavbar = isMounted && pathname !== "/dashboard";

  return (
    <ThemeProvider>
      {shouldRenderNavbar && <Navbar />}
      {children}
      
      {/* ✨ 2. Add the ChatWidget here, wrapped in the isMounted check */}
      {/* This ensures the widget only renders on the client, preventing any hydration errors. */}
      {/* It will appear on ALL pages, including the dashboard, which is usually desired for a help widget. */}
      {isMounted && <ChatWidget />}

    </ThemeProvider>
  );
}