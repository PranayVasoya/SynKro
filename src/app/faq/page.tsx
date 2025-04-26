"use client";

import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function FAQ() {
  const router = useRouter();
  const faqs = [
    {
      question: "What is SynKro?",
      answer: "SynKro is a platform designed to help users collaborate on projects, chat with team members, and engage with a community forum.",
    },
    {
      question: "How do I create a project?",
      answer: "Navigate to your profile page and click the 'New' button to create a new project with details and team options.",
    },
    {
      question: "How can I join a community forum?",
      answer: "Go to the 'Community' section from the dashboard sidebar to explore and join various forums.",
    },
    {
      question: "Where can I find help?",
      answer: "Check the FAQ section or visit the 'Project Help' forum in the community section for assistance.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-background dark:to-muted">
      <nav className="w-full bg-gradient-to-b from-blue-50 to-blue-100 dark:from-card dark:to-muted shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">SynKro</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/dashboard")}
            className="border border-border px-4 py-2 rounded-lg hover:bg-muted text-foreground transition-colors"
          >
            ← Back
          </motion.button>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl p-6 bg-background dark:bg-card rounded-2xl shadow-2xl border border-border transform transition-all hover:scale-101 hover:shadow-3xl"
        >
          <h2 className="text-3xl font-bold text-foreground text-center mb-8 flex items-center justify-center">
            <HelpCircle className="w-8 h-8 mr-2 text-primary" /> FAQ
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-6 bg-muted dark:bg-muted/50 rounded-xl hover:bg-muted/80 transition-colors border border-border"
              >
                <h3 className="text-lg font-semibold text-foreground">{faq.question}</h3>
                <p className="text-muted-foreground mt-2">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}