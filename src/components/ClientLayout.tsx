"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/app/theme-context";

// Dynamically import components to avoid hydration issues
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const ChatWidget = dynamic(() => import("./chatbot/ChatWidget").then(mod => ({ default: mod.ChatWidget })), { ssr: false });

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Exclude Navbar for /dashboard route
  const shouldRenderNavbar = pathname !== "/dashboard";

  return (
    <ThemeProvider>
      {shouldRenderNavbar && <Navbar />}
      {children}
      <ChatWidget />
    </ThemeProvider>
  );
}