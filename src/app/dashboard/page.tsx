"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, Cog, Bell, Trophy, MessageCircle, Sun, Moon, HelpCircle, Users } from "lucide-react";

// ProjectPopup Component
const ProjectPopup = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [lookingForMembers, setLookingForMembers] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = {
      title,
      description,
      techStack: techStack.split(",").map(item => item.trim()),
      repoLink,
      liveLink,
      createdBy: "userIdHere",
      lookingForMembers,
    };
    console.log("Project Data:", projectData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-2xl w-96 transform transition-all duration-300 hover:shadow-3xl border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-800">Create New Project</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 h-16"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Repo Link</label>
              <input
                type="url"
                value={repoLink}
                onChange={(e) => setRepoLink(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Live Link</label>
              <input
                type="url"
                value={liveLink}
                onChange={(e) => setLiveLink(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                checked={lookingForMembers}
                onChange={(e) => setLookingForMembers(e.target.checked)}
                className="mr-2 accent-blue-500"
              />
              Looking for Members
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const isAuthenticated = true;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isAuthenticated) return null;

  const menuItems = [
    { label: "Chat", icon: <MessageCircle className="w-5 h-5" />, action: () => router.push("/chat") },
    { label: "Community", icon: <Users className="w-5 h-5" />, action: () => router.push("/community") },
    { label: "Profile", icon: <UserCircle className="w-5 h-5" />, action: () => router.push("/profile") },
    { label: "Settings", icon: <Cog className="w-5 h-5" />, action: () => setShowSettingsDropdown(!showSettingsDropdown) },
  ];

  const MenuLinks = () => (
    <div className="flex flex-col space-y-2 w-full">
      {menuItems.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center text-gray-700 cursor-pointer px-2 py-2 hover:bg-gray-300 rounded transition relative"
          onClick={item.action}
        >
          {item.icon}
          <span className="ml-2">{item.label}</span>
          {item.label === "Settings" && showSettingsDropdown && (
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50">
              <button
                onClick={() => {
                  // Toggle light/dark theme logic here
                  console.log("Toggled theme");
                  setShowSettingsDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-md"
              >
                <Sun className="w-5 h-5 mr-2" /> Light Theme
              </button>
              <button
                onClick={() => {
                  // Toggle light/dark theme logic here
                  console.log("Toggled theme");
                  setShowSettingsDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <Moon className="w-5 h-5 mr-2" /> Dark Theme
              </button>
              <button
                onClick={() => {
                  router.push("/faq");
                  setShowSettingsDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-md"
              >
                <HelpCircle className="w-5 h-5 mr-2" /> FAQ
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const MenuIcon = ({ onClick }) => (
    <button onClick={onClick}>
      <svg
        className="w-6 h-6 text-black"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>
  );

  const handleLeaderboard = () => {
    router.push("/leaderboard");
  };

  return (
    <div className="flex min-h-screen w-full relative">
      <aside className="hidden md:flex flex-col w-64 bg-gray-200 p-6 space-y-4 border-r border-gray-300 h-screen">
        <h1 className="text-xl font-bold text-black">SynKro</h1>
        <MenuLinks />
      </aside>

      {!showSidebar && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <MenuIcon onClick={() => setShowSidebar(true)} />
        </div>
      )}

      {showSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-40 z-40"
            onClick={() => setShowSidebar(false)}
          />
          <aside className="fixed top-0 left-0 w-64 h-screen bg-gray-200 p-6 space-y-4 border-r border-gray-300 z-50 transition-transform duration-300 transform translate-x-0 overflow-y-auto">
            <div className="flex justify-end">
              <MenuIcon onClick={() => setShowSidebar(false)} />
            </div>
            <h1 className="text-xl font-bold text-black">SynKro BETA</h1>
            <MenuLinks />
          </aside>
        </>
      )}

      <main className="flex-1 flex flex-col items-center justify-start p-8 w-full">
        <div className="w-full flex justify-between items-center mb-6 sm:mb-8 border-b border-gray-300 pb-2">
          <input
            type="text"
            className="w-full max-w-2xl p-2 sm:p-3 bg-gray-200 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base placeholder-gray-500"
            placeholder="Search for projects..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-200 rounded-full" onClick={handleLeaderboard}>
              <Trophy className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full">
              <UserCircle className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="w-full border-b border-gray-300 mb-3 sm:mb-4 pb-3 sm:pb-4 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
            Welcome to your dashboard, John Doe.
          </h1>
        </div>

        <div className="w-full max-w-4xl">
          <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-300 h-48 rounded-lg flex items-center justify-center"></div>
            <div className="bg-gray-300 h-48 rounded-lg flex items-center justify-center"></div>
          </div>
        </div>
      </main>

      {showProjectPopup && <ProjectPopup onClose={() => setShowProjectPopup(false)} />}
    </div>
  );
}
