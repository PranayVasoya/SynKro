"use client";

import { motion } from "framer-motion";

// Components
import Link from "next/link";

export default function HomePageFooter() {
  return (
    <footer className="bg-footer py-6">
      <div className="max-w-7xl mx-auto px-8 lg:px-44 text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-foreground text-sm mb-2"
        >
          Developed and maintained by: Krish Panchal, Dhairya Mehra, Pranay
          Vasoya and Devvrat Saini
        </motion.p>
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-foreground text-sm"
        >
          © {new Date().getFullYear()} SynKro. All rights reserved.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-2 flex justify-center gap-4 text-customPurple text-sm"
        >
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
        </motion.div>
      </div>
    </footer>
  );
}
