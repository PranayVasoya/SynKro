"use client";

import Link from "next/link";
<<<<<<< HEAD
import { useTheme } from "../app/theme-context";
import { Sun, Moon, Home } from "lucide-react"; // Added Home for Dashboard
=======
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
>>>>>>> 4e020f94c6551da8ddd461cca2daf89b6bee1e2f
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isProfilePage = pathname === "/profile"; // Safe client-side check to show Dashboard button only on /profile

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="bg-navbar w-full px-6 lg:px-44 py-4 flex flex-row justify-between items-center border-b-2 border-navbar-border">
<<<<<<< HEAD
      <Link href="/" tabIndex={-1} className="font-semibold text-4xl text-foreground">
=======
      <Link
        href="/"
        tabIndex={-1}
        className="font-semibold text-3xl sm:text-4xl text-navbar-foreground"
      >
>>>>>>> 4e020f94c6551da8ddd461cca2daf89b6bee1e2f
        SynKro
      </Link>
      <div className="flex flex-row items-center space-x-4"> {/* Added space-x-4 for consistent spacing */}
        <Button
          asChild
          variant="ghost"
          size="default"
          className={`rounded-md font-semibold text-xl ${isHomePage ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
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
<<<<<<< HEAD
          {theme === "light" ? <Moon /> : <Sun />}
=======
          {theme === "light" ? (
            <Moon className="h-6 w-6" />
          ) : (
            <Sun className="h-6 w-6" />
          )}
>>>>>>> 4e020f94c6551da8ddd461cca2daf89b6bee1e2f
        </Button>
      </div>
    </div>
  );
};

export default Navbar;