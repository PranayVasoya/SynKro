"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="bg-navbar w-full px-6 lg:px-44 py-4 flex flex-row justify-between items-center border-b-2 border-navbar-border">
      <Link
        href="/"
        tabIndex={-1}
        className="font-semibold text-3xl sm:text-4xl text-navbar-foreground"
      >
        SynKro
      </Link>

      <div className="flex flex-row items-center">
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

        <Button
          variant="ghost"
          size="icon"
          className="ml-4"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-6 w-6" />
          ) : (
            <Sun className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
