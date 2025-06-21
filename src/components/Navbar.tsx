"use client";

import Link from "next/link";
import { useTheme } from "../app/theme-context";
import { Sun, Moon, Home } from "lucide-react"; // Added Home for Dashboard
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const Navbar = () => {
  const { toggleTheme, theme } = useTheme();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isProfilePage = pathname === "/profile"; // Safe client-side check to show Dashboard button only on /profile
  return (
    <div className="bg-navbar w-full px-6 lg:px-44 py-4 flex flex-row justify-between items-center border-b-2 border-navbar-border">
      <Link href="/" tabIndex={-1} className="font-semibold text-4xl text-foreground">
        SynKro
      </Link>
      <div className="flex flex-row items-center space-x-4"> {/* Added space-x-4 for consistent spacing */}
        <Button
          variant="ghost"
          size="default"
          className={`rounded-full font-semibold text-xl ${isHomePage ? "visible" : "invisible"}`}
          aria-hidden={!isHomePage}
          tabIndex={-1}
        >
          <Link href="/signin">Sign In</Link>
        </Button>
        {isProfilePage && (
          <Button
            variant="ghost"
            size="default"
            className="rounded-full font-semibold text-xl"
            asChild
          >
            <Link href="/dashboard">
              <Home className="w-4 h-4 mr-1" /> Dashboard
            </Link>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-4" // Kept ml-4 for spacing after the last button
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </Button>
      </div>
    </div>
  );
};

export default Navbar;