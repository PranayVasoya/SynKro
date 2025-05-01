"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Cog,
  Bell,
  Trophy,
  MessageCircle,
  Sun,
  Moon,
  HelpCircle,
  Users,
  LogOut,
  User,
  PlusCircle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios"; // Import AxiosError for better typing
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useTheme } from "../theme-context"; // Ensure this path is correct

// --- ProjectPopup Component ---
const ProjectPopup = ({
  userId,
  onClose,
  onProjectCreated,
}: {
  userId: string | undefined;
  onClose: () => void;
  onProjectCreated: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [lookingForMembers, setLookingForMembers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  interface ProjectData {
    title: string;
    description: string;
    techStack: string[];
    repoLink?: string;
    liveLink?: string;
    createdBy: string;
    lookingForMembers: boolean;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User information not available. Cannot create project.");
      return;
    }
    setIsSubmitting(true);

    const projectData: ProjectData = {
      title,
      description,
      techStack: techStack
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
      repoLink: repoLink || undefined,
      liveLink: liveLink || undefined,
      createdBy: userId,
      lookingForMembers,
    };

    try {
      // TODO: Replace with your actual API endpoint
      console.log("Simulating Project Creation:", projectData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Project created successfully!");
      onProjectCreated();
      onClose();
    } catch (error: unknown) {
      let errorMessage = "Failed to create project.";
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as {
          message?: string;
          error?: string;
        };
        errorMessage =
          serverError?.message ||
          serverError?.error ||
          error.message ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Project creation failed", error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Create New Project
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="proj-title"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Title
            </label>
            <input
              id="proj-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              // Light mode bg adjusted for contrast
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary bg-muted dark:bg-background text-foreground border-border transition-colors"
              required
            />
          </div>
          <div>
            <label
              htmlFor="proj-desc"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Description
            </label>
            <textarea
              id="proj-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              // Light mode bg adjusted
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary bg-muted dark:bg-background text-foreground border-border h-20 transition-colors resize-none"
            />
          </div>
          <div>
            <label
              htmlFor="proj-stack"
              className="block text-sm font-medium text-muted-foreground mb-1"
            >
              Tech Stack (comma separated)
            </label>
            <input
              id="proj-stack"
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              // Light mode bg adjusted
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary bg-muted dark:bg-background text-foreground border-border transition-colors"
            />
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label
                htmlFor="proj-repo"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Repo Link (Optional)
              </label>
              <input
                id="proj-repo"
                type="url"
                value={repoLink}
                onChange={(e) => setRepoLink(e.target.value)}
                // Light mode bg adjusted
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary bg-muted dark:bg-background text-foreground border-border transition-colors"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="proj-live"
                className="block text-sm font-medium text-muted-foreground mb-1"
              >
                Live Link (Optional)
              </label>
              <input
                id="proj-live"
                type="url"
                value={liveLink}
                onChange={(e) => setLiveLink(e.target.value)}
                // Light mode bg adjusted
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary bg-muted dark:bg-background text-foreground border-border transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center text-sm text-muted-foreground gap-2 cursor-pointer">
              <input
                id="proj-members"
                type="checkbox"
                checked={lookingForMembers}
                onChange={(e) => setLookingForMembers(e.target.checked)}
                className="accent-primary w-4 h-4"
              />
              Looking for Members
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
// --- End ProjectPopup Component ---

export default function Dashboard() {
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ _id?: string; username?: string }>({});

  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get<{
          data: { _id: string; username: string };
        }>("/api/users/me");
        setUser(res.data.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setIsAuthenticated(false);
        router.push("/signin");
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettingsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        Loading...
      </div>
    );
  }

  const menuItems = [
    {
      label: "Chat",
      icon: <MessageCircle className="w-5 h-5" />,
      action: () => router.push("/chat"),
    },
    {
      label: "Community",
      icon: <Users className="w-5 h-5" />,
      action: () => router.push("/community"),
    },
    {
      label: "Profile",
      icon: <User className="w-5 h-5" />,
      action: () => router.push(`/profile`),
    },
    {
      label: "Settings",
      icon: <Cog className="w-5 h-5" />,
      action: () => setShowSettingsDropdown((prev) => !prev),
    },
  ];

  // --- MenuLinks Component ---
  const MenuLinks = () => (
    <motion.div
      className="flex flex-col space-y-1 w-full"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
      }}
      initial="hidden"
      animate="visible"
    >
      {menuItems.map((item, idx) => (
        <div
          key={idx}
          className="relative"
          ref={item.label === "Settings" ? settingsRef : null}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 },
            }}
            className="flex items-center text-foreground cursor-pointer px-3 py-2 hover:bg-muted rounded-md transition-colors duration-200 w-full"
            onClick={item.action}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
          >
            {item.icon}
            <span className="ml-3 font-medium text-sm">{item.label}</span>
          </motion.div>

          <AnimatePresence>
            {item.label === "Settings" && showSettingsDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full mt-1 w-48 bg-popover shadow-lg rounded-md border border-border z-50 overflow-hidden"
              >
                <button
                  onClick={() => {
                    toggleTheme();
                    setShowSettingsDropdown(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                >
                  {theme === "light" ? (
                    <Moon className="w-4 h-4 mr-2" />
                  ) : (
                    <Sun className="w-4 h-4 mr-2" />
                  )}
                  Toggle Theme
                </button>
                <button
                  onClick={() => {
                    router.push("/faq");
                    setShowSettingsDropdown(false);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                >
                  <HelpCircle className="w-4 h-4 mr-2" /> FAQ
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  );
  // --- End MenuLinks Component ---

  // --- MenuIcon Component ---
  const MenuIcon = ({ onClick }: { onClick: () => void }) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="text-foreground"
    >
      <svg
        className="w-6 h-6"
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
    </Button>
  );
  // --- End MenuIcon Component ---

  const handleLeaderboard = () => {
    router.push("/leaderboard");
  };

  const onLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/signin");
    } catch (error: any) {
      console.log("Logout Failed", error);
      toast.error(
        error.response?.data?.message || error.message || "Logout failed"
      );
    }
  };

  const handleProjectCreated = () => {
    console.log("Project created, refresh list needed.");
    // TODO: Add logic to re-fetch projects
  };

  return (
    // Light Mode Fix: Use bg-muted for light mode main background
    <div className="flex min-h-screen w-full relative bg-muted dark:bg-background">
      {/* Desktop Sidebar */}
      <motion.aside className="hidden md:flex flex-col w-64 bg-card p-4 space-y-6 border-r border-border h-screen sticky top-0 shadow-sm">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-foreground tracking-tight px-3"
        >
          SynKro
        </motion.h1>
        <MenuLinks />
        <div className="mt-auto pt-4 border-t border-border">
          <Button className="w-full" onClick={() => setShowProjectPopup(true)}>
            <PlusCircle className="w-4 h-4 mr-2" /> Create Project
          </Button>
        </div>
      </motion.aside>

      {/* Mobile Menu Button */}
      {!showSidebar && (
        <div className="md:hidden fixed top-3 left-3 z-50">
          <MenuIcon onClick={() => setShowSidebar(true)} />
        </div>
      )}

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setShowSidebar(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-64 h-screen bg-card p-4 space-y-6 border-r border-border z-50 overflow-y-auto shadow-lg flex flex-col"
            >
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground tracking-tight px-3">
                  SynKro
                </h1>
                <MenuIcon onClick={() => setShowSidebar(false)} />
              </div>
              <MenuLinks />
              <div className="mt-auto pt-4 border-t border-border">
                <Button
                  className="w-full"
                  onClick={() => {
                    setShowProjectPopup(true);
                    setShowSidebar(false);
                  }}
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Create Project
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center p-4 sm:p-6 w-full overflow-y-auto">
        {/* Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-card rounded-lg shadow-sm p-4 border border-border"
        >
          {/* Search Input Wrapper */}
          <div className="w-full sm:flex-1">
            <motion.input
              type="text"
              className="w-full p-3 bg-muted dark:bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base placeholder-muted-foreground transition-colors"
              placeholder="Search for projects, users, skills..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.1 }}
            />
          </div>
          {/* Action Buttons Wrapper */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLeaderboard}
              className="text-yellow-500 hover:bg-muted w-10 h-10 sm:w-11 sm:h-11"
            >
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-500 hover:bg-muted w-10 h-10 sm:w-11 sm:h-11"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-destructive hover:bg-destructive/10 w-10 h-10 sm:w-11 sm:h-11"
            >
              <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // Reduced animation delay
          transition={{ duration: 0.5, delay: 0.05 }}
          // Centered text
          className="w-full text-center mb-10 md:mb-12 py-4"
        >
          {/* Bigger text */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Welcome back, {user.username || "User"}!
          </h1>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Your Projects
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
              onClick={() => setShowProjectPopup(true)}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Create New
            </Button>
          </div>

          {/* Placeholder Project Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                // Reduced animation delay
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{
                  y: -3,
                  scale: 1.02,
                  borderColor: "#8c8bf1", // Purple border hover
                }}
                // Base border transparent for smooth hover effect
                className="bg-card h-40 rounded-lg border-2 border-transparent p-4 flex flex-col justify-between shadow-sm cursor-pointer transition-colors duration-200"
                onClick={() => router.push(`/projects/${idx + 1}`)}
              >
                <h3 className="font-semibold text-card-foreground">
                  Placeholder Project {idx + 1}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  This is a placeholder description for the project card...
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                  Tech: React, Node, CSS
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Project Popup Modal */}
      <AnimatePresence>
        {showProjectPopup && (
          <ProjectPopup
            userId={user._id}
            onClose={() => setShowProjectPopup(false)}
            onProjectCreated={handleProjectCreated}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
