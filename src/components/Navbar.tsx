"use client";

import Link from "next/link";
import { useTheme } from "../app/theme-context";
import { Sun } from "lucide-react";

const Navbar = () => {
  const { toggleTheme } = useTheme();

  return (
    <div className="bg-white dark:bg-customDarkGray w-screen px-6 lg:px-44 py-3 flex flex-row justify-between items-center border-b-4 border-gray-300 dark:border-customMediumGray">
      <Link
        href="/"
        className="font-semibold text-4xl text-black dark:text-white"
      >
        SynKro
      </Link>
      <div className="flex flex-row items-center">
        <Link
          href="/signin"
          className="font-semibold text-xl border-4 rounded-full border-black dark:border-white px-4 py-2 text-black dark:text-white"
        >
          Sign In
        </Link>
        <button
          onClick={() => toggleTheme()}
          className="ml-4 p-2 rounded-full bg-transparent transition-colors"
        ><Sun /></button>
      </div>
    </div>
  );
};

export default Navbar;
