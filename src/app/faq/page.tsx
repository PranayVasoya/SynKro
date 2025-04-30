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
    {
      question: "How do I edit my skill profile?",
      answer: "Go to your profile, expand the skills section, select categories like programming or design, and save your changes.",
    },
    {
      question: "What are badges, and how do I earn them?",
      answer: "Badges (e.g., Top Contributor, Leaderboard Champion) are achievements earned based on project contributions and skill mastery, visible on your profile.",
    },
    {
      question: "How do I update a project with my team?",
      answer: "Open your project, use the real-time update feature to add tech stack details or recruit members, and share with your team.",
    },
    {
      question: "Can I connect with others based on skills?",
      answer: "Yes, use the Community Skill Matching feature to find and connect with users who share your skills or interests.",
    },
    {
      question: "How do I add social links to my profile?",
      answer: "Edit your profile settings and input your social media or portfolio links under the networking section.",
    },
    {
      question: "What should I do if a project fails to save?",
      answer: "Ensure you’re connected to the internet, check your input details, and retry. Contact support if the issue persists.",
    },
    {
      question: "How do I leave feedback for the community?",
      answer: "Post your feedback in the 'Project Help' or general forums under the Community section.",
    },
    {
      question: "Can I delete a project I created?",
      answer: "Yes, go to your project, click the settings icon, and select 'Delete' to remove it permanently.",
    },
    {
      question: "How do I track my achievements?",
      answer: "View your badges and achievement history in the profile section under the 'Achievements' tab.",
    },
    {
      question: "What types of projects can I create?",
      answer: "You can create any project type (e.g., web apps, design portfolios) by specifying details in the 'New' project popup.",
    },
    {
      question: "How do I report a bug or issue?",
      answer: "Submit a bug report through the 'Project Help' forum or email support@synkro.com with details of the issue.",
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