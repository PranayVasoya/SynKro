"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, Cog, Bell, Trophy, MessageCircle, Sun, Moon, HelpCircle, Users, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useTheme } from "../theme-context"; // Import the useTheme hook

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-gradient-to-br from-background to-muted dark:from-card dark:to-muted p-6 rounded-xl shadow-2xl w-96 transform transition-all duration-300 hover:shadow-3xl border border-border"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Create New Project</h2>
            <motion.button
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </motion.button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary bg-muted text-foreground border-border transition-all duration-200 hover:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary bg-muted text-foreground border-border h-16 transition-all duration-200 hover:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Tech Stack (comma separated)</label>
              <input
                type="text"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary bg-muted text-foreground border-border transition-all duration-200 hover:border-primary"
              />
            </div>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-foreground">Repo Link</label>
                <input
                  type="url"
                  value={repoLink}
                  onChange={(e) => setRepoLink(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary bg-muted text-foreground border-border transition-all duration-200 hover:border-primary"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-foreground">Live Link</label>
                <input
                  type="url"
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary bg-muted text-foreground border-border transition-all duration-200 hover:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={lookingForMembers}
                  onChange={(e) => setLookingForMembers(e.target.checked)}
                  className="mr-2 accent-primary"
                />
                Looking for Members
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--muted))" }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="px-4 py-1 bg-muted text-foreground rounded-md font-semibold transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--primary))" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-4 py-1 bg-primary text-primary-foreground rounded-md font-semibold transition-colors"
              >
                Create
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const { toggleTheme } = useTheme(); // Use the theme context

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
    <motion.div
      className="flex flex-col space-y-3 w-full"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      {menuItems.map((item, idx) => (
        <motion.div
          key={idx}
          variants={{
            hidden: { opacity: 0, x: -30 },
            visible: { opacity: 1, x: 0 },
          }}
          className="flex items-center text-foreground cursor-pointer px-3 py-2 hover:bg-gradient-to-r hover:from-primary/20 hover:to-primary/40 rounded-lg transition-all duration-300 relative shadow-sm"
          onClick={item.action}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {item.icon}
          <span className="ml-3 font-medium">{item.label}</span>
          {item.label === "Settings" && showSettingsDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 top-10 w-48 bg-background shadow-lg rounded-lg border border-border z-50 overflow-hidden"
            >
              <motion.button
                whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                onClick={() => {
                  toggleTheme();
                  setShowSettingsDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-foreground rounded-t-lg"
              >
                <Sun className="w-5 h-5 mr-2" /> Light Theme
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                onClick={() => {
                  toggleTheme();
                  setShowSettingsDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-foreground"
              >
                <Moon className="w-5 h-5 mr-2" /> Dark Theme
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                onClick={() => {
                  router.push("/faq");
                  setShowSettingsDropdown(false);
                }}
                className="flex items-center w-full px-4 py-2 text-foreground rounded-b-lg"
              >
                <HelpCircle className="w-5 h-5 mr-2" /> FAQ
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );

  const MenuIcon = ({ onClick }) => (
    <motion.button
      whileHover={{ scale: 1.2, rotate: 180 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="p-2 bg-gradient-to-r from-primary to-primary rounded-full shadow-md"
    >
      <svg
        className="w-6 h-6 text-primary-foreground"
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
    </motion.button>
  );

  const handleLeaderboard = () => {
    router.push("/leaderboard");
  };

  const onLogout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      console.log("Logout success", response.data);
      router.push("/signin");
    } catch (error) {
      console.log("Logout Failed", error);
      toast.error(error.response?.data?.message || error.message || "Logout failed");
    }
  };

  return (
    <div className="flex min-h-screen w-full relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-background dark:to-muted">
      <motion.aside
        initial={{ x: 0 }}
        animate={{ x: 0 }}
        className="hidden md:flex flex-col w-64 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-card dark:to-muted p-6 space-y-4 border-r border-border h-screen shadow-lg"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-foreground tracking-wide"
        >
          SynKro
        </motion.h1>
        <MenuLinks />
      </motion.aside>

      {!showSidebar && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <MenuIcon onClick={() => setShowSidebar(true)} />
        </div>
      )}

      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setShowSidebar(false)}
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-64 h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-card dark:to-muted p-6 space-y-4 border-r border-border z-50 overflow-y-auto shadow-lg"
            >
              <div className="flex justify-end">
                <MenuIcon onClick={() => setShowSidebar(false)} />
              </div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-foreground tracking-wide"
              >
                SynKro BETA
              </motion.h1>
              <MenuLinks />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col items-center justify-start p-6 sm:p-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-between items-center mb-6 sm:mb-8 border-b border-border pb-3 bg-background dark:bg-card rounded-lg shadow-md p-4"
        >
          <motion.input
            type="text"
            className="w-full max-w-2xl p-3 bg-muted text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base placeholder-muted-foreground transition-all duration-200 hover:border-primary"
            placeholder="Search for projects..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            whileFocus={{ scale: 1.02, borderColor: "hsl(var(--primary))" }}
            transition={{ duration: 0.2 }}
          />
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-md hover:shadow-lg transition-all"
              onClick={handleLeaderboard}
            >
              <Trophy className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <Bell className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-gradient-to-r from-destructive to-destructive rounded-full shadow-md hover:shadow-lg transition-all"
              onClick={onLogout}
            >
              <LogOut className="w-5 h-5 text-destructive-foreground" />
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full border-b border-border mb-4 sm:mb-6 pb-3 sm:pb-4 text-center"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Welcome to your dashboard, John Doe.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-4xl"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-foreground tracking-wide">Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2].map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.2, ease: "easeOut" }}
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)" }}
                className="bg-muted h-48 rounded-lg flex items-center justify-center border border-border relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 hover:from-blue-500/20 hover:to-blue-500/20 transition-all duration-300"></div>
                <Button
                  variant="outline"
                  className="bg-transparent hover:bg-blue-600 hover:text-white text-blue-500 border-blue-500 transition-all duration-300 z-10"
                  onClick={() => router.push(`/projects/${idx}`)}
                >
                  View Project
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {showProjectPopup && <ProjectPopup onClose={() => setShowProjectPopup(false)} />}
      </AnimatePresence>
    </div>
  );
}