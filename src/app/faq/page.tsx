"use client";

import { useRouter } from "next/navigation";
import { HelpCircle } from "lucide-react";

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <nav className="w-full bg-gray-200 shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-black">SynKro</h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back
          </button>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl p-6 bg-white rounded-2xl shadow-2xl border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8 flex items-center justify-center">
            <HelpCircle className="w-8 h-8 mr-2 text-blue-600" /> FAQ
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-gray-700">{faq.question}</h3>
                <p className="text-gray-600 mt-2">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
