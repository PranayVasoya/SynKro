"use client";

import Navbar from "@components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="relative bg-white dark:bg-customDarkGray w-screen min-h-screen overflow-hidden">
        <Navbar />

        {/* Main Content */}
        <div className="relative z-10 w-screen flex flex-col-reverse gap-8 lg:flex-row justify-between items-center px-8 py-8 lg:px-44">
          <div className="flex flex-col items-center gap-y-4 lg:gap-y-8">
            <Image
              src="/people.png"
              alt="group"
              width={600}
              height={600}
              className="max-w-full h-auto"
            />
            <Link href="/signin">
              <motion.button
                whileHover={{ backgroundColor: "#8c8bf1", color: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
                className="px-10 lg:px-32 py-4 text-xl lg:text-2xl text-black dark:text-white font-semibold border-4 border-black dark:border-white rounded-full"
              >
                Sign in to your account
              </motion.button>
            </Link>
            <Link href="/signup">
              <motion.button
                whileHover={{ backgroundColor: "#8c8bf1", color: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
                className="px-10 lg:px-32 py-4 text-xl lg:text-2xl text-black dark:text-white font-semibold border-4 border-black dark:border-white rounded-full"
              >
                Create a new account
              </motion.button>
            </Link>
          </div>

          <div className="flex flex-col items-center lg:items-start gap-y-4">
            <p className="text-4xl text-center lg:text-start lg:text-5xl font-semibold text-black dark:text-white">
              Welcome to your
              <br />
              SynKro community
            </p>
            <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">
              Sync karo yaar!
            </p>
          </div>
        </div>

        {/* Gear Image as Background Element */}
        <Image
          src="/gear.png"
          alt="gear"
          width={500}
          height={500}
          className="absolute bottom-[-225px] right-[-100px] opacity-40 pointer-events-none select-none z-0"
          style={{
            filter: "grayscale(100%) brightness(90%)",
          }}
        />
      </div>
      <div className="bg-customPurple dark:bg-purple-800"></div>
    </div>
  );
}
