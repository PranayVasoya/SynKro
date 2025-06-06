"use client";

import Link from "next/link";
import { useTheme } from "../app/theme-context";
import { Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { toggleTheme, theme } = useTheme();
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  return (
    <div className="bg-navbar w-full px-6 lg:px-44 py-3 flex flex-row justify-between items-center border-b-4 border-navbar-border">
      <Link
        href="/"
        tabIndex={-1}
        className="font-semibold text-4xl text-foreground"
      >
        SynKro
      </Link>

      <div className="flex flex-row items-center">
        <Link
          href="/signin"
          tabIndex={-1}
          aria-hidden={!isHomePage}
          className={`
            font-semibold text-xl border-4 rounded-full border-button-border px-4 
            py-2 text-foreground transition-opacity duration-150 ease-in-out ${
              isHomePage ? "visible" : "invisible"
            }
          `}
        >
          Sign In
        </Link>

        <button
          onClick={() => toggleTheme()}
          className="ml-4 p-2 rounded-full bg-transparent transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="text-foreground" />
          ) : (
            <Sun className="text-foreground" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
