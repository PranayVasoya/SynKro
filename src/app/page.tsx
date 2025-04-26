"use client";

import Image from "next/image";
import Link from 'next/link';
import Navbar from "@components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen overflow-hidden bg-white">
      {/* Top Section with Navbar */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0, backgroundPosition: "200% 0" }}
        transition={{ 
          opacity: { duration: 0.7 },
          y: { duration: 0.7 },
          backgroundPosition: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "linear" }
        }}
        className="w-full p-6 bg-gradient-to-r from-blue-50 via-blue-200 to-blue-50 dark:from-card dark:via-muted dark:to-card shadow-lg relative"
        style={{
          backgroundSize: "200% 100%",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
        }}
      >
        <Navbar />
      </motion.div>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row w-full min-h-[70vh] p-8 md:p-12 relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-card dark:to-muted">
        {/* Left Section (Image and Buttons) */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full md:w-1/2 flex flex-col items-center space-y-6 p-6 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl border border-blue-200 dark:border-gray-700"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full flex justify-center"
          >
            <Image 
              src="/people.jpg" 
              alt="group"
              width={400} 
              height={400} 
              className="max-w-full h-auto rounded-xl shadow-lg"
            />
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link href="/signin">
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(34, 211, 238, 0.7)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto text-center py-4 px-10 bg-gradient-to-r from-cyan-400 to-cyan-700 dark:from-cyan-500 dark:to-cyan-800 text-white rounded-2xl shadow-xl hover:bg-cyan-600 dark:hover:bg-cyan-700 transition-all duration-300 font-extrabold text-2xl"
              >
                Sign in to your account
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(34, 211, 238, 0.7)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto text-center py-4 px-10 bg-gradient-to-r from-cyan-400 to-cyan-700 dark:from-cyan-500 dark:to-cyan-800 text-white rounded-2xl shadow-xl hover:bg-cyan-600 dark:hover:bg-cyan-700 transition-all duration-300 font-extrabold text-2xl"
              >
                Request a new account
              </motion.button>
            </Link>
          </motion.div>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-base text-gray-600 dark:text-gray-300 font-medium text-center mt-4"
          >
            For creating a new account, an admin will be notified to assist you.
          </motion.p>
        </motion.div>

        {/* Right Section (Hero Text and Gear) */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-8 relative"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-2xl shadow-2xl border border-blue-200 dark:border-gray-700 mt-[-30px] md:mt-[-50px] z-10"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-indigo-900 dark:text-white leading-tight">
              Welcome to Your <br /> SynKro Community
            </h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300 mt-6"
            >
              SynKro karo yaar!
            </motion.p>
          </motion.div>

          {/* Gear Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: [1, 1.1, 1], rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute sm:bottom-[-40px] md:bottom-[-120px] lg:bottom-[-160px] bottom-[-20px] left-1/2 transform -translate-x-1/2 max-[425px]:bottom-[-40px] max-[375px]:bottom-[-80px] z-0"
          >
            <Image 
              src="/gear.png" 
              alt="gear"
              width={250} 
              height={250} 
              className="sm:w-[400px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] object-contain drop-shadow-2xl"
              style={{
                filter: "grayscale(100%) brightness(80%)"
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}