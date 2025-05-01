"use client";

import Link from "next/link";
import { useTheme } from "../app/theme-context"; // Ensure this path is correct
import { Sun } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { toggleTheme } = useTheme();
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  return (
    <div className="bg-white dark:bg-customDarkGray w-full px-6 lg:px-44 py-3 flex flex-row justify-between items-center border-b-4 border-gray-300 dark:border-customMediumGray">
      <Link
        href="/"
        tabIndex={-1}
        className="font-semibold text-4xl text-black dark:text-white"
      >
        SynKro
      </Link>
      <div className="flex flex-row items-center">
        {/* Always render the Sign In button link */}
        <Link
          href="/signin"
          tabIndex={-1} // Keep it non-tabbable
          aria-hidden={!isHomePage} // Hide from screen readers when invisible
          // Apply base styles PLUS conditional visibility/opacity
          className={`
            font-semibold text-xl border-4 rounded-full border-black dark:border-white px-4 py-2 text-black dark:text-white
            transition-opacity duration-150 ease-in-out
            ${isHomePage ? 'visible opacity-100' : 'invisible opacity-0'}
          `}
        >
          Sign In
        </Link>

        {/* Theme toggle button's margin is now always relative to the Sign In Link */}
        <button
          onClick={() => toggleTheme()}
          className="ml-4 p-2 rounded-full bg-transparent transition-colors"
          aria-label="Toggle theme" // Add accessibility label
        >
           {/* Add consistent coloring to the icon */}
           <Sun className="text-black dark:text-white" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;