"use client"; // Ensure this component runs on the client side

import { useState } from "react";
import Link from "next/link";
import { Bell, MessageCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [projects] = useState(["Project 1", "Sample Title", "Synchronization", "Long Project Name"]);
  const [bookmarks] = useState(["Bookmark 1", "Welcome To The", "Internet, Have a", "Look Around"]);

  // Simulate checking if user is logged in
  const isAuthenticated = true; // Change this logic based on real authentication

  if (!isAuthenticated) {
    router.push("/signin"); // Redirect to sign-in page if not authenticated
    return null; // Prevent rendering before redirect
  }

  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r border-gray-300 p-4 flex flex-col">
        <h1 className="text-xl font-bold text-black flex items-center justify-between">
          SynKro 
        </h1>
        <div className="mt-4">
          <h2 className="text-gray-700 font-semibold">Projects</h2>
          <ul className="mt-2 space-y-2">
            {projects.map((project, index) => (
              <li key={index} className="flex items-center text-gray-800 hover:underline cursor-pointer">
                📄 {project}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <h2 className="text-gray-700 font-semibold">Bookmarks</h2>
          <ul className="mt-2 space-y-2">
            {bookmarks.map((bookmark, index) => (
              <li key={index} className="flex items-center text-gray-800 hover:underline cursor-pointer">
                🔖 {bookmark}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto">
          <Link href="/profile">
            <p className="text-gray-800 hover:underline cursor-pointer">👤 Profile</p>
          </Link>
          <Link href="/settings">
            <p className="text-gray-800 hover:underline cursor-pointer">⚙️ Settings</p>
          </Link>
        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Search for projects"
            className="w-full max-w-lg p-2 border border-gray-300 rounded-lg"
          />
          <div className="flex space-x-4">
            <Bell className="text-gray-700 cursor-pointer" />
            <MessageCircle className="text-gray-700 cursor-pointer" />
            <Users className="text-gray-700 cursor-pointer" />
          </div>
        </div>

        {/* Welcome Message */}
        <h2 className="text-2xl text-black font-semibold mt-6">Welcome to your dashboard, John Doe.</h2>
        <button className="mt-2 px-4 py-2 bg-black text-white rounded-lg">+ New</button>

        {/* Project Slider */}
        <div className="mt-6 p-4 bg-gray-200 rounded-lg">
          <h3 className="text-black text-lg font-semibold">Projects</h3>
          <div className="flex items-center justify-between">
            <button className="p-2 bg-gray-300 rounded-lg">⬅</button>
            <div className="flex space-x-4">
              <div className="w-48 h-32 bg-gray-400 rounded-lg"></div>
              <div className="w-48 h-32 bg-gray-400 rounded-lg"></div>
            </div>
            <button className="p-2 bg-gray-300 rounded-lg">➡</button>
          </div>
          <div className="flex justify-center space-x-2 mt-2">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
