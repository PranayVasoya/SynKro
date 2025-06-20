"use client";

import { motion, easeOut } from "framer-motion";
import { HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is SynKro?",
      answer: "SynKro is a platform designed to help users collaborate on projects, chat with team members, and engage with a community forum.",
    },
    {
      question: "How do I create a project?",
      answer: "Navigate to your profile page and click the 'New Project' button to create a new project with details and team options.",
    },
    {
      question: "How can I join a community forum?",
      answer: "Go to the 'Community' section from the dashboard sidebar to explore and join various forums.",
    },
    {
      question: "Where can I find help?",
      answer: "Check this FAQ section or visit the 'Project Help' forum in the community section for assistance.",
    },
    {
      question: "How do I edit my skill profile?",
      answer: "Go to your profile, click 'Edit Profile', expand the skills section, select categories like programming or design, and save your changes.",
    },
    {
      question: "What are badges, and how do I earn them?",
      answer: "Badges (e.g., Top Contributor, Leaderboard Champion) are achievements earned based on project contributions and skill mastery, visible on your profile.",
    },
    // ... (include all your other FAQs here)
    {
      question: "How do I report a bug or issue?",
      answer: "Submit a bug report through the 'Project Help' forum or email support@synkro.com with details of the issue.",
    },
  ];

  // Framer Motion variants for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07, // Slightly faster stagger
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: easeOut, // ✅ use the imported easing function
      },
    },
  };

  return (
    // Main page background - using bg-muted for light mode contrast as in Dashboard
    <div className="flex flex-col min-h-screen bg-muted dark:bg-background">
      <Navbar />

      {/* Centered content area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          // Main FAQ container card
          className="w-full max-w-3xl p-6 sm:p-8 bg-card rounded-xl shadow-xl border border-border"
        >
          {/* Header */}
          <div className="flex items-center justify-center mb-8 text-center">
            <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 mr-3 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Frequently Asked Questions
            </h1>
          </div>

          {/* FAQ List Container with Stagger Animation */}
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible" // Animate when this container is ready
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants} // Use item variants for stagger
                // Individual FAQ item card
                className="p-4 sm:p-5 bg-background dark:bg-muted/30 rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-md sm:text-lg font-semibold text-foreground">
                  {faq.question}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mt-2">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}