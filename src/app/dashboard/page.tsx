"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Settings } from "lucide-react";
import { Plus } from "lucide-react";


export default function Dashboard() {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchText, setSearchText] = useState("");

  const isAuthenticated = true; // Simulate authentication

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  // Close mobile sidebar if screen becomes large
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
    { label: "Profile", icon: <User className="w-5 h-5" /> },
    { label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const MenuLinks = () => (
    <div className="flex flex-col h-full w-full bg-gray-100 overflow-hidden">
      {/* Spacer to push menu items to the bottom */}
      <div className="flex-grow"></div>
      {/* Bottom Menu */}
      <div className="space-y-2 w-full">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center w-full text-black cursor-pointer px-2 py-2 hover:border-t hover:border-b hover:border-black transition"
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const MenuIcon = ({ onClick }: { onClick: () => void }) => (
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

  return (
    <div className="flex min-h-screen w-full relative">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-100 p-6 space-y-8 border-r border-gray-300 h-screen">
        <h1 className="text-xl font-bold text-black">SynKro</h1>
        <div className="flex flex-col h-full">
          <MenuLinks />
        </div>
      </aside>

      {/* Mobile Menu Toggle */}
      {!showSidebar && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <MenuIcon onClick={() => setShowSidebar(true)} />
        </div>
      )}

      {/* Mobile Sidebar & Backdrop */}
      {showSidebar && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black opacity-40 z-40"
            onClick={() => setShowSidebar(false)}
          />

          {/* Sidebar */}
          <aside className="fixed top-0 left-0 w-64 h-screen bg-gray-100 p-6 space-y-8 border-r border-gray-300 z-50 transition-transform duration-300 transform translate-x-0 overflow-y-auto">
            {/* Menu icon inside sidebar, top-right corner */}
            <div className="flex justify-end">
              <MenuIcon onClick={() => setShowSidebar(false)} />
            </div>

            <h1 className="text-xl font-bold text-black">SynKro</h1>
            <div className="flex flex-col h-full">
              <MenuLinks />
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start p-8 w-full">

        {/* Search for Projects */}
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-3xl mb-6 sm:mb-8">
          <input
            type="text"
            className="w-full p-2 sm:p-3 bg-gray-200 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base placeholder-black"
            placeholder="Search for projects..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Welcome Text with Bottom Border */}
        <div className="w-full border-b border-gray-300 mb-3 sm:mb-4 pb-3 sm:pb-4 text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
            Welcome to Your Dashboard, John Doe
          </h1>
        </div>

        {/* New Button aligned left */}
        <div className="w-full mb-6 flex justify-start">
          <button className="flex items-center gap-2 bg-gray-800 text-white py-2 px-4 rounded-full text-sm sm:text-base hover:bg-gray-700 transition">
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>

      </main>
    </div>
  );
}