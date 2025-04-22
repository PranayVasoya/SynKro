"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, ChevronRight } from "lucide-react";

export default function Community() {
  const router = useRouter();
  const [forums, setForums] = useState([
    { id: 1, title: "General Discussion", description: "Talk about anything related to SynKro.", posts: 45 },
    { id: 2, title: "Project Help", description: "Get help with your projects.", posts: 23 },
    { id: 3, title: "Ideas & Feedback", description: "Share your ideas and feedback.", posts: 15 },
  ]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // No specific action needed for now
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleForumSelect = (forum) => {
    router.push(`/community/${forum.id}`);
    // You can expand this to a detailed forum page later
  };

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
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Community Forums</h2>
          <div className="space-y-6">
            {forums.map((forum) => (
              <div
                key={forum.id}
                className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 cursor-pointer transition-all shadow-md"
                onClick={() => handleForumSelect(forum)}
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-700">{forum.title}</h3>
                  <p className="text-gray-500">{forum.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{forum.posts} Posts</span>
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
