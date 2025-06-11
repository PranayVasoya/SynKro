"use client";

import Link from "next/link";
import { useTheme } from "../app/theme-context";
import { Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "./ui/button";

const Navbar = () => {
  const { toggleTheme, theme } = useTheme();
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  return (
    <div className="bg-navbar w-full px-6 lg:px-44 py-4 flex flex-row justify-between items-center border-b-2 border-navbar-border">
      <Link
        href="/"
        tabIndex={-1}
        className="font-semibold text-4xl text-foreground"
      >
        SynKro
      </Link>

      <div className="flex flex-row items-center">
        <Button
          variant="ghost"
          size="default"
          className={`rounded-full font-semibold text-xl ${isHomePage ? "visible" : "invisible"}`}
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
            <Moon />
          ) : (
            <Sun />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
