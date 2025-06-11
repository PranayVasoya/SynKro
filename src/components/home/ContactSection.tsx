"use client";

import { motion } from "framer-motion";

export default function ContactSection() {
    return (
        <section className="py-8 bg-card">
        <div className="max-w-7xl mx-auto px-8 lg:px-44 text-center">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
          >
            Contact Us
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-primary lg:text-lg flex flex-col items-center gap-1 sm:gap-1.5"
          >
            <a
              href="mailto:krish.panchal.btech2022@sitpune.edu.in"
              className="hover:underline"
            >
              krish.panchal.btech2022@sitpune.edu.in
            </a>
            <a
              href="mailto:krish.panchal.btech2022@sitpune.edu.in"
              className="hover:underline"
            >
              mehra.dhairya.btech2022@sitpune.edu.in
            </a>
            <a
              href="mailto:krish.panchal.btech2022@sitpune.edu.in"
              className="hover:underline"
            >
              pranay.vasoya.btech2022@sitpune.edu.in
            </a>
            <a
              href="mailto:krish.panchal.btech2022@sitpune.edu.in"
              className="hover:underline"
            >
              devvrat.saini.btech2022@sitpune.edu.in
            </a>
          </motion.div>
        </div>
      </section>
    );
}
