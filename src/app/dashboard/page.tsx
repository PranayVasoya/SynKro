"use client";

import { useState, useEffect, useRef, useCallback } from "react"; // Added useCallback
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"; // Import router type
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
  Heart,
  Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios"; // Import AxiosError
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { useTheme } from "../theme-context";

// --- Type Definitions ---
interface UserData {
  _id: string;
  username: string;
}

interface CommentData {
  _id: string;
  text: string;
  userId: Partial<UserData> | null; // Allow partial user data
  createdAt: string;
}

type LikeData = string | { _id: string }; // Can be ID or object

interface ProjectData {
  _id: string;
  title: string;
  description: string;
  techStack?: string[];
  repoLink?: string;
  liveLink?: string;
  createdBy: Partial<UserData> | null; // Allow partial user data
  lookingForMembers: boolean;
  status: "active" | "completed";
  likes?: LikeData[];
  comments?: CommentData[];
}

interface NotificationData {
  _id: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}
// --- End Type Definitions ---

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

  // Adjusted ProjectData interface used internally for submission payload
  interface ProjectSubmissionData {
    title: string;
    description: string;
    techStack: string[];
    repoLink?: string;
    liveLink?: string;
    createdBy: string;
    lookingForMembers: boolean;
    status: "active" | "completed";
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User information not available. Cannot create project.");
      return;
    }
    setIsSubmitting(true);

    const projectData: ProjectSubmissionData = {
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
      status: "active",
    };

    try {
      await axios.post("/api/projects/create", projectData);
      toast.success("Project created successfully!");
      onProjectCreated();
      onClose();
    } catch (error: unknown) {
      // Use unknown
      let errorMessage = "Failed to create project.";
      if (axios.isAxiosError(error)) {
        // Type guard
        const serverError = error.response?.data as
          | ApiErrorResponse
          | undefined;
        errorMessage =
          serverError?.error ||
          serverError?.message ||
          error.message ||
          errorMessage;
      } else if (error instanceof Error) {
        // Type guard
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
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4"
      onClick={onClose}
      data-testid="project-popup"
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
          {/* Title */}
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
              className="w-full p-2 border rounded-md bg-input dark:bg-background text-foreground border-border focus:ring-2 focus:ring-primary transition-colors"
              required
            />
          </div>
          {/* Description */}
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
              className="w-full p-2 border rounded-md bg-input dark:bg-background text-foreground border-border focus:ring-2 focus:ring-primary h-20 transition-colors resize-none"
            />
          </div>
          {/* Tech Stack */}
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
              className="w-full p-2 border rounded-md bg-input dark:bg-background text-foreground border-border focus:ring-2 focus:ring-primary transition-colors"
            />
          </div>
          {/* Links */}
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
                className="w-full p-2 border rounded-md bg-input dark:bg-background text-foreground border-border focus:ring-2 focus:ring-primary transition-colors"
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
                className="w-full p-2 border rounded-md bg-input dark:bg-background text-foreground border-border focus:ring-2 focus:ring-primary transition-colors"
              />
            </div>
          </div>
          {/* Looking for Members */}
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
          {/* Buttons */}
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

// --- ProjectCard Component ---
const ProjectCard = ({
  project,
  idx,
  user,
  handleLike,
  handleComment,
  router,
}: {
  project: ProjectData; // Use specific type
  idx: number;
  user: Partial<UserData>; // Use partial type
  handleLike: (projectId: string) => void;
  handleComment: (
    projectId: string,
    text: string,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => void;
  router: AppRouterInstance; // Use specific type
}) => {
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  // Updated like check logic
  const isLiked =
    project.likes?.some(
      (like: LikeData) =>
        (typeof like === "string" ? like : like._id) === user._id
    ) ?? false; // Default to false if likes array is undefined

  return (
    <motion.div
      key={project._id} // Use _id from ProjectData
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
      whileHover={{ y: -3, scale: 1.02, borderColor: "hsl(var(--primary))" }}
      className="bg-card rounded-lg border-2 border-transparent p-4 flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-200 h-full"
    >
      {/* Clickable Area */}
      <div
        onClick={() => router.push(`/projects/${project._id}`)}
        className="flex-grow mb-3"
      >
        <h3 className="font-semibold text-card-foreground">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {project.description}
        </p>
        {project.techStack && project.techStack.length > 0 && (
          <div className="text-xs text-muted-foreground mt-2">
            Tech: {project.techStack.join(", ")}
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-1">
          By: {project.createdBy?.username || "Unknown User"}{" "}
          {/* Safe access */}
        </div>
      </div>
      {/* Interaction Area */}
      <div className="mt-auto space-y-3 border-t border-border pt-3">
        {/* Likes */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleLike(project._id);
            }}
            className={`flex items-center px-2 py-1 rounded-md text-sm ${
              isLiked
                ? "text-destructive hover:bg-destructive/10"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Heart
              className={`w-4 h-4 mr-1 ${isLiked ? "fill-current" : ""}`}
            />
            {project.likes?.length || 0} Like
            {project.likes?.length !== 1 ? "s" : ""}
          </Button>
        </div>
        {/* Comments */}
        <div className="space-y-2">
          {project.comments?.slice(-2).map(
            (
              comment: CommentData // Show latest 2, use specific type
            ) => (
              <div
                key={comment._id}
                className="text-sm text-muted-foreground border-t border-border/50 pt-2 first:border-t-0"
              >
                <span className="font-semibold text-foreground/80">
                  {comment.userId?.username || "User"}:{" "}
                </span>
                {comment.text}
              </div>
            )
          )}
          {project.comments && project.comments.length > 2 && (
            <button
              onClick={() => router.push(`/projects/${project._id}`)}
              className="text-xs text-primary hover:underline pt-1"
            >
              View all comments...
            </button>
          )}
          {/* Add Comment Input */}
          <div className="flex items-center space-x-2 pt-2">
            <input
              ref={commentInputRef}
              type="text"
              placeholder="Add a comment..."
              className="flex-1 p-2 border rounded-md bg-input text-foreground border-border focus:ring-2 focus:ring-primary text-sm h-9"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (
                  e.key === "Enter" &&
                  commentInputRef.current?.value.trim()
                ) {
                  handleComment(
                    project._id,
                    commentInputRef.current.value,
                    commentInputRef
                  );
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                if (commentInputRef.current?.value.trim()) {
                  handleComment(
                    project._id,
                    commentInputRef.current.value,
                    commentInputRef
                  );
                }
              }}
              className="text-primary hover:bg-primary/10 h-9 w-9 flex-shrink-0"
            >
              {" "}
              <Send className="w-4 h-4" />{" "}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
// --- End ProjectCard Component ---

// --- Main Dashboard Component ---
export default function Dashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [showSidebar, setShowSidebar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<Partial<UserData>>({}); // Use partial UserData
  const [projects, setProjects] = useState<ProjectData[]>([]); // Use ProjectData array
  const [searchResults, setSearchResults] = useState<{
    projects: ProjectData[];
    users: UserData[];
  }>({ projects: [], users: [] }); // Use specific types
  const [notifications, setNotifications] = useState<NotificationData[]>([]); // Use NotificationData array

  const settingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // --- Data Fetching ---

  // Fetch User (runs once on mount)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get<{ data: UserData }>("/api/users/me"); // Expect UserData
        if (res.data?.data) {
          setUser(res.data.data);
          setIsAuthenticated(true);
        } else {
          throw new Error("User data not found");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setIsAuthenticated(false);
        toast.error("Authentication failed. Redirecting...");
        router.push("/signin");
      }
    };
    fetchUser();
  }, [router]); // Depend on router instance

  // Fetch Projects (memoized)
  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await axios.get<{ data: ProjectData[] }>("/api/projects"); // Expect ProjectData array
      setProjects(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch projects", err);
      toast.error("Failed to load projects");
      setProjects([]);
    }
  }, [isAuthenticated]); // Re-run if isAuthenticated changes

  // Fetch Notifications (memoized)
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await axios.get<{ data: NotificationData[] }>(
        "/api/notifications"
      ); // Expect NotificationData array
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setNotifications([]);
    }
  }, [isAuthenticated]); // Re-run if isAuthenticated changes

  // Effects to call memoized fetch functions
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]); // Depend on the memoized function

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]); // Depend on the memoized function

  // --- Search Effect ---
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchText.trim()) {
        setSearchResults({ projects: [], users: [] });
        return;
      }
      try {
        const [projectsRes, usersRes] = await Promise.all([
          axios.get<{ data: ProjectData[] }>(
            `/api/projects?search=${encodeURIComponent(searchText)}`
          ),
          axios.get<{ data: UserData[] }>(
            `/api/users?search=${encodeURIComponent(searchText)}`
          ), // Expect UserData array
        ]);
        setSearchResults({
          projects: projectsRes.data?.data?.slice(0, 5) || [],
          users: usersRes.data?.data?.slice(0, 5) || [],
        });
      } catch (err) {
        console.error("Search failed", err);
        toast.error("Search failed");
        setSearchResults({ projects: [], users: [] });
      }
    };
    const timeoutId = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  // --- UI Effects ---
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && showSidebar) {
        setShowSidebar(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, [showSidebar]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettingsDropdown(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        if (
          searchResults.projects.length > 0 ||
          searchResults.users.length > 0
        ) {
          setSearchResults({ projects: [], users: [] });
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchResults]); // Include searchResults dependency

  // --- Loading State ---
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        Loading dashboard...
      </div>
    );
  }

  // --- Event Handlers ---
  const handleLeaderboard = () => {
    try {
      router.push("/leaderboard");
    } catch (_err) {
      console.error("Nav to /leaderboard failed", _err);
      toast.error("Leaderboard page not found.");
    }
  };

  const onLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      setUser({});
      setIsAuthenticated(false);
      router.push("/signin");
    } catch (error: unknown) {
      // Use unknown
      console.error("Logout failed", error);
      let errorMessage = "Logout failed";
      if (axios.isAxiosError(error)) {
        // Type guard
        const serverError = error.response?.data as
          | ApiErrorResponse
          | undefined;
        errorMessage =
          serverError?.error ||
          serverError?.message ||
          error.message ||
          errorMessage;
      } else if (error instanceof Error) {
        // Type guard
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleProjectCreated = () => {
    fetchProjects();
    fetchNotifications();
  };

  const handleLike = async (projectId: string) => {
    if (!user._id) return toast.error("Login required");
    try {
      const res = await axios.post<{
        message: string;
        data: { likes: LikeData[] };
      }>(`/api/projects/${projectId}/like`);

      const updatedLikes = res.data?.data?.likes;

      if (Array.isArray(updatedLikes)) {
        setProjects((prevProjects) =>
          prevProjects.map((p) =>
            p._id === projectId ? { ...p, likes: updatedLikes } : p
          )
        );
      } else {
        console.warn(
          `Like API for project ${projectId} did not return a valid 'likes' array. Received:`,
          updatedLikes
        );
        fetchProjects();
      }

      toast.success(res.data.message || "Action successful");
      fetchNotifications();
    } catch (error: unknown) {
      console.error("Like/unlike failed", error);
      let errorMessage = "Failed to update like status";
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as
          | ApiErrorResponse
          | undefined;
        errorMessage =
          serverError?.error ||
          serverError?.message ||
          error.message ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleComment = async (
    projectId: string,
    text: string,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    if (!text.trim() || !user._id || !inputRef?.current) return;
    const originalValue = inputRef.current.value;
    inputRef.current.value = "";
    inputRef.current.disabled = true;
    try {
      await axios.post(`/api/projects/${projectId}/comment`, { text });
      toast.success("Comment added");
      fetchProjects();
      fetchNotifications();
    } catch (error: unknown) {
      // Use unknown
      console.error("Comment failed", error);
      let errorMessage = "Failed to add comment";
      if (axios.isAxiosError(error)) {
        // Type guard
        const serverError = error.response?.data as
          | ApiErrorResponse
          | undefined;
        errorMessage =
          serverError?.error ||
          serverError?.message ||
          error.message ||
          errorMessage;
      } else if (error instanceof Error) {
        // Type guard
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      if (inputRef.current) {
        inputRef.current.value = originalValue;
      }
    } finally {
      if (inputRef.current) {
        inputRef.current.disabled = false;
        inputRef.current.focus();
      }
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
    );
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
    } catch (err) {
      console.error("Mark read failed", err);
      toast.error("Failed to mark notification");
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: false } : n))
      );
    }
  };

  // --- Sidebar Menu Items Definition ---
  const menuItemsDefinition = [
    // Renamed to avoid conflict inside MenuLinks
    {
      label: "Chat",
      icon: <MessageCircle className="w-5 h-5" />,
      action: () => {
        router.push("/chat");
        setShowSidebar(false);
      },
    },
    {
      label: "Community",
      icon: <Users className="w-5 h-5" />,
      action: () => {
        router.push("/community");
        setShowSidebar(false);
      },
    },
    {
      label: "Profile",
      icon: <User className="w-5 h-5" />,
      action: () => {
        router.push(`/profile`);
        setShowSidebar(false);
      },
    }, // Use /profile, server might handle user ID
    {
      label: "Settings",
      icon: <Cog className="w-5 h-5" />,
      action: (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowSettingsDropdown((prev) => !prev);
      },
    },
  ];

  // --- Reusable Components ---
  const MenuLinks = () => (
    <motion.div
      className="flex flex-col space-y-1 w-full"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
      }}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {menuItemsDefinition.map(
        (
          item,
          idx // Use renamed definition
        ) => (
          <div
            key={idx}
            className="relative"
            ref={item.label === "Settings" ? settingsRef : null}
          >
            <motion.button
              type="button"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
              className="flex items-center text-foreground cursor-pointer px-3 py-2 hover:bg-muted rounded-md transition-colors duration-200 w-full text-left"
              onClick={(e) => {
                item.action(e);
              }}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              data-testid={`menu-${item.label.toLowerCase()}`}
            >
              {item.icon}{" "}
              <span className="ml-3 font-medium text-sm">{item.label}</span>
            </motion.button>
            <AnimatePresence>
              {item.label === "Settings" && showSettingsDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-1 w-48 bg-popover shadow-lg rounded-md border border-border z-[120] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme();
                      setShowSettingsDropdown(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                    data-testid="menu-theme-toggle"
                  >
                    {theme === "light" ? (
                      <Moon className="w-4 h-4 mr-2" />
                    ) : (
                      <Sun className="w-4 h-4 mr-2" />
                    )}{" "}
                    Toggle Theme
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        router.push("/faq");
                        setShowSettingsDropdown(false);
                        setShowSidebar(false);
                      } catch (_err) {
                        console.error("Nav to /faq failed", _err);
                        toast.error("FAQ page not found.");
                      }
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                    data-testid="menu-faq"
                  >
                    <HelpCircle className="w-4 h-4 mr-2" /> FAQ
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      )}
    </motion.div>
  );

  const MenuIcon = ({
    onClick,
    isClose = false,
  }: {
    onClick: (e: React.MouseEvent) => void;
    isClose?: boolean;
  }) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="text-foreground z-[130]"
      aria-label={isClose ? "Close menu" : "Open menu"}
      data-testid={isClose ? "menu-close" : "menu-open"}
    >
      {isClose ? (
        <X className="w-6 h-6" />
      ) : (
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
      )}
    </Button>
  );
  // --- End Reusable Components ---

  // --- JSX Structure ---
  return (
    <div
      className={`flex min-h-screen w-full relative bg-muted dark:bg-background text-foreground ${theme}`}
    >
      <Toaster position="top-center" reverseOrder={false} />
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 bg-card p-4 space-y-6 border-r border-border h-screen sticky top-0 shadow-sm z-[90]"
        data-testid="desktop-sidebar"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-foreground tracking-tight px-3"
        >
          SynKro
        </motion.h1>
        <MenuLinks />
      </aside>
      {/* Mobile Menu Button */}
      {!showSidebar && (
        <div className="md:hidden fixed top-3 left-3 z-[120]">
          {" "}
          <MenuIcon
            onClick={(e) => {
              e.stopPropagation();
              setShowSidebar(true);
            }}
          />{" "}
        </div>
      )}
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              key="sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-[100] md:hidden"
              onClick={() => setShowSidebar(false)}
              data-testid="sidebar-overlay"
            />
            <motion.aside
              key="sidebar-content"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-64 h-screen bg-card p-4 space-y-6 border-r border-border z-[110] overflow-y-auto shadow-lg flex flex-col md:hidden"
              data-testid="mobile-sidebar"
            >
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground tracking-tight px-3">
                  SynKro
                </h1>
                <MenuIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSidebar(false);
                  }}
                  isClose={true}
                />
              </div>
              <MenuLinks />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center p-4 sm:p-6 w-full overflow-y-auto bg-muted dark:bg-background">
        {" "}
        {/* Light mode contrast */}
        {/* Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-card rounded-lg shadow-sm p-4 border border-border relative z-10"
        >
          {/* Search Input & Results */}
          <div className="w-full sm:flex-1 relative" ref={searchRef}>
            <motion.input
              type="text"
              className="w-full p-3 bg-muted dark:bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base placeholder-muted-foreground transition-colors"
              placeholder="Search projects, users..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.1 }}
              aria-label="Search"
            />
            <AnimatePresence>
              {(searchResults.projects.length > 0 ||
                searchResults.users.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full mt-2 w-full bg-popover rounded-md shadow-lg border border-border z-50 max-h-80 overflow-y-auto"
                  data-testid="search-results"
                >
                  {searchResults.projects.length > 0 && (
                    <div className="p-2">
                      {" "}
                      <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-1 uppercase tracking-wider">
                        Projects
                      </h3>{" "}
                      {searchResults.projects.map((project) => (
                        <Button
                          variant="ghost"
                          key={project._id}
                          className="w-full text-left justify-start px-3 py-1.5 h-auto text-sm text-popover-foreground hover:bg-muted transition-colors rounded"
                          onClick={() => {
                            router.push(`/projects/${project._id}`);
                            setSearchText("");
                            setSearchResults({ projects: [], users: [] });
                          }}
                        >
                          {project.title}
                        </Button>
                      ))}
                    </div>
                  )}
                  {searchResults.users.length > 0 && (
                    <div className="p-2 border-t border-border">
                      {" "}
                      <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-1 uppercase tracking-wider">
                        Users
                      </h3>{" "}
                      {searchResults.users.map((u) => (
                        <Button
                          variant="ghost"
                          key={u._id}
                          className="w-full text-left justify-start px-3 py-1.5 h-auto text-sm text-popover-foreground hover:bg-muted transition-colors rounded"
                          onClick={() => {
                            router.push(`/profile/${u._id}`);
                            setSearchText("");
                            setSearchResults({ projects: [], users: [] });
                          }}
                        >
                          {u.username}
                        </Button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLeaderboard}
              className="text-yellow-500 hover:bg-yellow-500/10 w-9 h-9 sm:w-10 sm:h-10"
              aria-label="Leaderboard"
              data-testid="leaderboard-button"
            >
              <Trophy className="w-5 h-5" />
            </Button>
            <div className="relative" ref={notificationsRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications((prev) => !prev);
                }}
                className="text-primary hover:bg-primary/10 w-9 h-9 sm:w-10 sm:h-10 relative"
                aria-label="Notifications"
                data-testid="notifications-button"
              >
                <Bell className="w-5 h-5" />{" "}
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                )}
              </Button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-popover shadow-lg rounded-md border border-popover-border z-50 overflow-hidden max-h-96 overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                    data-testid="notifications-dropdown"
                  >
                    <div className="p-2 px-3 border-b border-popover-border">
                      <h4 className="text-sm font-semibold text-popover-foreground">
                        Notifications
                      </h4>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-3 py-4 text-sm text-center text-muted-foreground">
                        No new notifications
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {notifications.map((notification) => (
                          <button
                            type="button"
                            key={notification._id}
                            className={`w-full text-left px-3 py-2.5 text-sm text-popover-foreground hover:bg-muted transition-colors block ${
                              !notification.read ? "font-medium" : "opacity-70"
                            }`}
                            onClick={() => {
                              if (!notification.read)
                                markNotificationAsRead(notification._id);
                              if (notification.link) {
                                try {
                                  router.push(notification.link);
                                } catch (err) {
                                  console.error(
                                    "Navigation to /faq failed",
                                    err
                                  );
                                  toast.error("Invalid notification link.");
                                }
                              }
                              setShowNotifications(false);
                            }}
                          >
                            <p className="line-clamp-2">
                              {notification.message}
                            </p>
                            <span className="text-xs text-muted-foreground mt-0.5 block">
                              {new Date(
                                notification.createdAt
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                            {!notification.read && (
                              <span className="absolute top-3 right-3 block h-1.5 w-1.5 rounded-full bg-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="p-2 px-3 border-t border-popover-border text-center">
                      <Button
                        variant="link"
                        size="sm"
                        className="text-xs text-primary"
                      >
                        View All (Not implemented)
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-destructive hover:bg-destructive/10 w-9 h-9 sm:w-10 sm:h-10"
              aria-label="Logout"
              data-testid="logout-button"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="w-full text-center mb-8 md:mb-10 py-4"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Welcome back, {user.username || "Developer"}!
          </h1>
          <p className="text-muted-foreground mt-1 text-base sm:text-lg">
            Explore projects or start your own.
          </p>
        </motion.div>
        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              Explore Projects
            </h2>
            <Button
              variant="secondary"
              size="sm"
              className="hidden sm:flex md:hidden border border-border"
              onClick={() => setShowProjectPopup(true)}
              data-testid="create-project-main-tablet"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Create New
            </Button>
          </div>
          {/* Project Grid */}
          {projects.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-10 border border-dashed border-border rounded-lg">
              {" "}
              No projects found yet. <br />{" "}
              <Button
                variant="link"
                onClick={() => setShowProjectPopup(true)}
                className="text-primary"
              >
                Create the first project!
              </Button>{" "}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project, idx) => (
                <ProjectCard
                  key={project._id || idx}
                  project={project}
                  idx={idx}
                  user={user}
                  handleLike={handleLike}
                  handleComment={handleComment}
                  router={router}
                />
              ))}
            </div>
          )}
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
