"use client";

import Navbar from "@components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-customDarkGray">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-white dark:bg-customDarkGray w-full overflow-hidden py-32">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center px-8 py-12 lg:px-44 lg:py-16">
          <div className="flex flex-col items-center lg:items-start gap-y-4 lg:gap-y-6">
            <p className="text-3xl text-center lg:text-start lg:text-4xl font-semibold text-gray-900 dark:text-white">
              Welcome to your
              <br />
              SynKro community
            </p>
            <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">
              Sync karo yaar!
            </p>
            <div className="flex flex-col gap-3 w-full lg:w-auto lg:items-center">
              <Link href="/signin" tabIndex={-1}>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  whileHover={{ backgroundColor: "#8c8bf1" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 lg:px-12 py-2 text-lg lg:text-xl font-semibold border-4 border-gray-900 dark:border-white bg-white dark:bg-customDarkGray rounded-full w-full lg:w-auto transition-all"
                  style={{ color: "#333333", backgroundColor: "#ffffff" }}
                >
                  Sign in to your account
                </motion.button>
              </Link>
              <Link href="/signup" tabIndex={-1}>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ backgroundColor: "#8c8bf1" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 lg:px-12 py-2 text-lg lg:text-xl font-semibold border-4 border-gray-900 dark:border-white bg-white dark:bg-customDarkGray rounded-full w-full lg:w-auto transition-all"
                  style={{ color: "#333333", backgroundColor: "#ffffff" }}
                >
                  Create a new account
                </motion.button>
              </Link>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src="/people.png"
              alt="group"
              width={600}
              height={600}
              className="max-w-full h-auto lg:max-w-[600px]"
            />
          </motion.div>
        </div>

        {/* Gear Image as Background Element */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Image
            src="/gear.png"
            alt="gear"
            width={300}
            height={300}
            className="absolute bottom-[-50px] right-[-50px] opacity-30 pointer-events-none select-none z-0"
            style={{
              filter: "grayscale(100%) brightness(90%)",
            }}
          />
        </motion.div>
      </div>

      {/* About Section */}
      <section className="py-32 bg-gray-100 dark:bg-customMediumGray">
        <div className="max-w-7xl mx-auto px-8 lg:px-44 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6"
          >
            About SynKro
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto"
          >
            SynKro is a dynamic collaborative platform crafted to unite developers, designers, and innovators from around the globe. Our vision is to create a vibrant ecosystem where creativity flourishes, ideas are synchronized effortlessly, and projects are brought to life through teamwork. Targeting tech enthusiasts, startups, and seasoned professionals, SynKro offers a space to showcase skills, collaborate on cutting-edge projects, and grow professionally. With a focus on community-driven innovation, we provide tools for real-time collaboration, skill sharing, and project management, making SynKro the go-to hub for the next generation of tech leaders. Join us to connect, create, and contribute to a thriving global network!
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white dark:bg-customDarkGray">
        <div className="max-w-7xl mx-auto px-8 lg:px-44 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-10"
          >
            Key Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ rotate: 2, scale: 1.02 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 bg-gray-50 dark:bg-customMediumGray rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Project Creation and Management</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Easily create and manage projects with a dedicated popup interface, including title, description, tech stack, and links, tailored for team collaboration.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ rotate: 2, scale: 1.02 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 bg-gray-50 dark:bg-customMediumGray rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Skill Profile Customization</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Customize your skill profile with a wide range of categories (e.g., programming, frontend, backend) and save selections for a personalized showcase.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ rotate: 2, scale: 1.02 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 bg-gray-50 dark:bg-customMediumGray rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Collaborative Project Updates</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share and update projects in real-time with team members, featuring tech stack details and member recruitment options.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ rotate: 2, scale: 1.02 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 bg-gray-50 dark:bg-customMediumGray rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Badge and Achievement Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Earn and display badges (e.g., Top Contributor, Leaderboard Champion) based on your contributions and skills mastered.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ rotate: 2, scale: 1.02 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-6 bg-gray-50 dark:bg-customMediumGray rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Community Skill Matching</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with others based on shared skills and interests, fostering collaboration through a robust matching system.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ rotate: 2, scale: 1.02 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="p-6 bg-gray-50 dark:bg-customMediumGray rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Profile-Based Networking</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Network with peers via detailed profiles, including project history, social links, and real-time skill updates.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 bg-gray-100 dark:bg-customMediumGray">
        <div className="max-w-7xl mx-auto px-8 lg:px-44 text-center">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Contact Us
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            
            <a
              href="mailto:krish.panchal.btech2022@sitpune.edu.in"
              className="text-customPurple hover:underline text-lg"
            >
              krish.panchal.btech2022@sitpune.edu.in
            </a>
            <br/>
            <a
              href="mailto:krish.panchal.btech2022@sitpune.edu.in"
              className="text-customPurple hover:underline text-lg"
            >
              mehra.dhairya.btech2022@sitpune.edu.in
            </a>
            <br/>
            <a
              href="mailto:krish.panchal.btech2022@sitpune.edu.in"
              className="text-customPurple hover:underline text-lg"
            >
              pranay.vasoya.btech2022@sitpune.edu.in
            </a>
            <br/>
            <a
              href="mailto:krish.panchal.btech2022@sitpune.edu.in"
              className="text-customPurple hover:underline text-lg"
            >
              devvrat.saini.btech2022@sitpune.edu.in
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-customDarkGray py-6">
        <div className="max-w-7xl mx-auto px-8 lg:px-44 text-center">
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 text-sm mb-2"
          >
            Developed and maintained by: Krish Panchal, Dhairya Mehra, Pranay Vasoya and Devvrat Saini
          </motion.p>
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-600 dark:text-gray-300 text-sm"
          >
            © 2025 SynKro. All rights reserved.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-2 flex justify-center gap-4"
          >
            <a href="/terms" className="text-customPurple hover:underline text-sm">
              Terms
            </a>
            <a href="/privacy" className="text-customPurple hover:underline text-sm">
              Privacy
            </a>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}