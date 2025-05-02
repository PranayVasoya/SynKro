"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Cog,        Bell,       Trophy,    MessageCircle, Sun,
  Moon,       HelpCircle, Users,     LogOut,        User,
  PlusCircle, X,          Heart,     Send,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button"; // Assuming you have this component
import { useTheme } from "../theme-context"; // Ensure this path is correct

// --- ProjectPopup Component (Using the version with API call) ---
const ProjectPopup = ({
  userId,
  onClose,
  onProjectCreated,
}: {
  userId: string | undefined;
  onClose: () => void;
  onProjectCreated: () => void; // Callback after successful creation
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
    status: "active" | "completed"; // Added status from second file's logic
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
      status: "active", // Default to active
    };

    try {
      // Use the actual API endpoint from the second file
      await axios.post("/api/projects/create", projectData);
      toast.success("Project created successfully!");
      onProjectCreated(); // Notify parent component
      onClose();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || // Prefer specific server error
        error.response?.data?.message || // Fallback server message
        error.message ||
        "Failed to create project.";
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
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4" // Higher z-index
      onClick={onClose}
      data-testid="project-popup"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md border border-border"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Create New Project
          </h2>
          {/* Use Button component for consistency */}
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
              // Use theme-aware classes like bg-input or bg-muted depending on your theme setup
              className="w-full p-2 border rounded-md bg-input dark:bg-background text-foreground border-border focus:ring-2 focus:ring-primary transition-colors"
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
              className="w-full p-2 border rounded-md bg-input dark:bg-background text-foreground border-border focus:ring-2 focus:ring-primary h-20 transition-colors resize-none"
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
              className="w-full p-2 border rounded-md bg-input dark:bg-background text-foreground border-border focus:ring-2 focus:ring-primary transition-colors"
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
          <div>
            <label className="flex items-center text-sm text-muted-foreground gap-2 cursor-pointer">
              <input
                id="proj-members"
                type="checkbox"
                checked={lookingForMembers}
                onChange={(e) => setLookingForMembers(e.target.checked)}
                className="accent-primary w-4 h-4" // Use accent color for checkbox
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

// --- ProjectCard Component (From second file) ---
const ProjectCard = ({
  project,
  idx,
  user,
  handleLike,
  handleComment,
  router,
}: {
  project: any; // Consider defining a stricter Project type
  idx: number;
  user: { _id?: string; username?: string };
  handleLike: (projectId: string) => void;
  handleComment: (
    projectId: string,
    text: string,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => void;
  router: any; // Type from NextRouter useRouter()
}) => {
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const isLiked = project.likes?.some((like: any) => like === user._id || like._id === user._id); // Check both possibilities

  return (
    <motion.div
      key={project._id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.05 }}
      whileHover={{
        y: -3,
        scale: 1.02,
        // Use CSS variable for primary color hover border
        borderColor: "hsl(var(--primary))",
      }}
      className="bg-card rounded-lg border-2 border-transparent p-4 flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-200 h-full" // Added h-full
    >
      {/* Clickable area for navigation */}
      <div onClick={() => router.push(`/projects/${project._id}`)} className="flex-grow mb-3">
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
          By: {project.createdBy?.username || "Unknown User"} {/* Safer access */}
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
                e.stopPropagation(); // Prevent card click
                handleLike(project._id);
             }}
             className={`flex items-center px-2 py-1 rounded-md text-sm ${
                isLiked
                ? "text-destructive hover:bg-destructive/10"
                : "text-muted-foreground hover:bg-muted"
            }`}
           >
            <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
             {project.likes?.length || 0} Like{project.likes?.length !== 1 ? 's' : ''}
          </Button>
        </div>

        {/* Comments */}
        <div className="space-y-2">
          {/* Display existing comments (limit?) */}
          {project.comments?.slice(0, 2).map((comment: any) => ( // Show latest 2 comments
            <div
              key={comment._id}
              className="text-sm text-muted-foreground border-t border-border/50 pt-2 first:border-t-0" // Subtle border
            >
              <span className="font-semibold text-foreground/80">{comment.userId?.username || 'User'}: </span>
              {comment.text}
              {/* <div className="text-xs text-muted-foreground/70">
                {new Date(comment.createdAt).toLocaleDateString()}
              </div> */}
            </div>
          ))}
           {project.comments?.length > 2 && (
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
              className="flex-1 p-2 border rounded-md bg-input text-foreground border-border focus:ring-2 focus:ring-primary text-sm h-9" // Fixed height
              onClick={(e) => e.stopPropagation()} // Prevent card click
              onKeyDown={(e) => {
                 e.stopPropagation();
                 if (e.key === "Enter" && commentInputRef.current?.value.trim()) {
                   handleComment(project._id, commentInputRef.current.value, commentInputRef);
                 }
              }}
            />
             <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                   e.stopPropagation();
                   if (commentInputRef.current?.value.trim()) {
                     handleComment(project._id, commentInputRef.current.value, commentInputRef);
                   }
                }}
                className="text-primary hover:bg-primary/10 h-9 w-9 flex-shrink-0" // Fixed size
              >
                <Send className="w-4 h-4" />
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
  const { theme, toggleTheme } = useTheme(); // Use theme context

  // State variables from both files, merged
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<{ _id?: string; username?: string }>({});
  const [projects, setProjects] = useState<any[]>([]); // State for projects
  const [searchResults, setSearchResults] = useState<{ projects: any[]; users: any[] }>({ projects: [], users: [] }); // State for search
  const [notifications, setNotifications] = useState<any[]>([]); // State for notifications

  // Refs from both files, merged
  const settingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // --- Data Fetching Effects ---

  // Fetch User (essential for auth check)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Use the correct API endpoint
        const res = await axios.get<{ data: { _id: string; username: string } }>("/api/users/me");
        if (res.data?.data) {
            setUser(res.data.data);
            setIsAuthenticated(true);
        } else {
             throw new Error("User data not found in response");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setIsAuthenticated(false);
        toast.error("Authentication failed. Redirecting to sign in.");
        router.push("/signin"); // Redirect if user fetch fails
      }
    };
    fetchUser();
  }, [router]);

  // Fetch Projects (only after authenticated)
  const fetchProjects = async () => {
    if (!isAuthenticated) return; // Don't fetch if not logged in
    try {
      const res = await axios.get("/api/projects"); // Use correct endpoint
      setProjects(res.data?.data || []); // Ensure it's an array
    } catch (err) {
      console.error("Failed to fetch projects", err);
      toast.error("Failed to load projects");
      setProjects([]); // Set to empty array on error
    }
  };
  useEffect(() => {
    fetchProjects();
  }, [isAuthenticated]); // Re-fetch if auth state changes (e.g., after login)

  // Fetch Notifications (only after authenticated)
  const fetchNotifications = async () => {
     if (!isAuthenticated) return;
     try {
       const res = await axios.get("/api/notifications"); // Use correct endpoint
       setNotifications(res.data?.data || []);
     } catch (err) {
       console.error("Failed to fetch notifications", err);
       // Don't toast here, might be too noisy
       setNotifications([]);
     }
   };
  useEffect(() => {
    fetchNotifications();
  }, [isAuthenticated]);

  // --- Search Effect ---
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchText.trim()) {
        setSearchResults({ projects: [], users: [] });
        return; // Clear results if search is empty
      }
      try {
        // Use Promise.all for parallel requests
        const [projectsRes, usersRes] = await Promise.all([
          axios.get(`/api/projects?search=${encodeURIComponent(searchText)}`),
          axios.get(`/api/users?search=${encodeURIComponent(searchText)}`), // Assuming a user search endpoint
        ]);
        setSearchResults({
          projects: projectsRes.data?.data?.slice(0, 5) || [], // Limit results
          users: usersRes.data?.data?.slice(0, 5) || [],
        });
      } catch (err) {
        console.error("Search failed", err);
        toast.error("Search failed");
        setSearchResults({ projects: [], users: [] }); // Clear on error
      }
    };

    // Debounce the search API call
    const timeoutId = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount or searchText change
  }, [searchText]);

  // --- UI Effects (Sidebar, Dropdowns) ---

  // Handle closing sidebar on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && showSidebar) {
        // console.log("Window resized to desktop, closing mobile sidebar");
        setShowSidebar(false);
      }
    };
    window.addEventListener("resize", handleResize);
    // Initial check in case the component mounts on a large screen with showSidebar=true somehow
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [showSidebar]); // Depend only on showSidebar

  // Handle closing dropdowns on clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close Settings Dropdown
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsDropdown(false);
      }
      // Close Notifications Dropdown
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      // Close Search Results Dropdown
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        // Only close search if it has results, otherwise clicking input again is fine
        if(searchResults.projects.length > 0 || searchResults.users.length > 0) {
           setSearchResults({ projects: [], users: [] });
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchResults]); // Re-run if searchResults change to correctly handle closing it


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
     } catch (err) {
        console.error("Navigation to /leaderboard failed", err);
        toast.error("Leaderboard page not found.");
     }
  };

  const onLogout = async () => {
    try {
      await axios.get("/api/users/logout"); // Use correct endpoint
      toast.success("Logout successful");
      setUser({}); // Clear user state
      setIsAuthenticated(false); // Update auth state
      router.push("/signin"); // Redirect
    } catch (error: any) {
      console.error("Logout failed", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || "Logout failed");
    }
  };

  // Called by ProjectPopup on success
  const handleProjectCreated = () => {
    fetchProjects(); // Re-fetch projects list
    fetchNotifications(); // Potentially refresh notifications if creation triggers one
  };

  const handleLike = async (projectId: string) => {
    if (!user._id) return toast.error("Login required to like projects.");
    try {
      // Send request to like/unlike
      const res = await axios.post<{ message: string; data: { likes: string[] } }>(`/api/projects/${projectId}/like`);

      // Update project state locally for immediate feedback
      setProjects((prevProjects) =>
        prevProjects.map((p) => {
          if (p._id === projectId) {
             // Determine if the user's ID is now in the returned likes array
             const userLiked = res.data.data.likes.includes(user._id!);
             // Update the likes array on the project object
             // Note: The API should ideally return the updated project or at least the full like list
             // This assumes the API returns the new list of user IDs who liked it
             return { ...p, likes: res.data.data.likes };
          }
          return p;
        })
      );
      toast.success(res.data.message || "Action successful");
      fetchNotifications(); // Refresh notifications
    } catch (error: any) {
      console.error("Like/unlike failed", error);
      toast.error(error.response?.data?.error || "Failed to update like status");
    }
  };


  const handleComment = async (
    projectId: string,
    text: string,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    if (!text.trim()) return; // Ignore empty comments
    if (!user._id) return toast.error("Login required to comment.");
    if (!inputRef?.current) return; // Safety check

    const originalValue = inputRef.current.value; // Store original value
    inputRef.current.value = ""; // Clear input immediately for responsiveness
    inputRef.current.disabled = true; // Disable input during submission

    try {
      // Send comment to API
      await axios.post(`/api/projects/${projectId}/comment`, { text });
      toast.success("Comment added");
      // Refresh projects to get the new comment list including the new one
      fetchProjects();
      fetchNotifications(); // Refresh notifications
    } catch (error: any) {
      console.error("Comment failed", error);
      toast.error(error.response?.data?.error || "Failed to add comment");
      // Restore input value on error
      if (inputRef.current) {
        inputRef.current.value = originalValue;
      }
    } finally {
        // Re-enable input regardless of success/failure
        if (inputRef.current) {
           inputRef.current.disabled = false;
           inputRef.current.focus(); // Optionally refocus
        }
    }
  };


  const markNotificationAsRead = async (notificationId: string) => {
    // Optimistically mark as read in UI
    setNotifications((prev) =>
      prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
    );
    try {
      await axios.put(`/api/notifications/${notificationId}/read`); // Use correct endpoint
      // No need to re-fetch, already updated optimistically
    } catch (err) {
      console.error("Mark notification read failed", err);
      // Optionally revert optimistic update on failure, but might be overkill
      toast.error("Failed to mark notification as read");
       // Revert optimistic update on error
       setNotifications((prev) =>
         prev.map((n) => (n._id === notificationId ? { ...n, read: false } : n))
       );
    }
  };

  // --- Sidebar Menu Items ---
  const menuItems = [
    {
      label: "Chat",
      icon: <MessageCircle className="w-5 h-5" />,
      action: () => { router.push("/chat"); setShowSidebar(false); }, // Close sidebar on nav
    },
    {
      label: "Community",
      icon: <Users className="w-5 h-5" />,
      action: () => { router.push("/community"); setShowSidebar(false); },
    },
    {
      label: "Profile",
      icon: <User className="w-5 h-5" />,
      action: () => { router.push(`/profile`); setShowSidebar(false); }, // Navigate to own profile
    },
    {
      label: "Settings",
      icon: <Cog className="w-5 h-5" />,
      action: (e: React.MouseEvent) => {
          e.stopPropagation(); // Prevent sidebar close if clicking Settings itself
          setShowSettingsDropdown((prev) => !prev);
          // Do not close main sidebar here
      },
    },
  ];

  // --- Reusable Components for Sidebar ---

  const MenuLinks = () => (
    <motion.div
      className="flex flex-col space-y-1 w-full"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } }, // Adjusted stagger
      }}
      initial="hidden"
      animate="visible"
      exit="hidden" // Added exit for potential future use
    >
      {menuItems.map((item, idx) => (
        <div
          key={idx}
          className="relative"
          // Attach ref only to the Settings item wrapper
          ref={item.label === "Settings" ? settingsRef : null}
        >
          <motion.button // Use button for accessibility
            type="button"
            variants={{ // Individual item animation
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 },
            }}
            className="flex items-center text-foreground cursor-pointer px-3 py-2 hover:bg-muted rounded-md transition-colors duration-200 w-full text-left"
            onClick={(e) => {
                // e.stopPropagation(); // Allow event to bubble for overlay click unless it's settings
                item.action(e); // Pass event to action
            }}
            whileHover={{ x: 3 }} // Subtle hover effect
            whileTap={{ scale: 0.98 }} // Tap effect
            data-testid={`menu-${item.label.toLowerCase()}`}
          >
            {item.icon}
            <span className="ml-3 font-medium text-sm">{item.label}</span>
          </motion.button>

          {/* Settings Dropdown - Placed inside the loop, conditional render */}
          <AnimatePresence>
            {item.label === "Settings" && showSettingsDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                // Position absolutely relative to the Settings button wrapper
                className="absolute left-0 top-full mt-1 w-48 bg-popover shadow-lg rounded-md border border-border z-[120] overflow-hidden" // Ensure high z-index
                // Prevent clicks inside dropdown from closing it via the main outside click handler
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button" // Specify button type
                  onClick={() => {
                    toggleTheme();
                    setShowSettingsDropdown(false); // Close dropdown after action
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                  data-testid="menu-theme-toggle"
                >
                  {theme === "light" ? (
                    <Moon className="w-4 h-4 mr-2" />
                  ) : (
                    <Sun className="w-4 h-4 mr-2" />
                  )}
                  Toggle Theme
                </button>
                <button
                  type="button"
                  onClick={() => {
                     try {
                        router.push("/faq");
                        setShowSettingsDropdown(false);
                        setShowSidebar(false); // Close mobile sidebar as well
                     } catch(err) {
                        console.error("Navigation to /faq failed", err);
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
      ))}
    </motion.div>
  );

  // Menu Icon (Hamburger/Close)
  const MenuIcon = ({ onClick, isClose = false }: { onClick: (e: React.MouseEvent) => void; isClose?: boolean }) => (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick} // Pass the event handler directly
      className="text-foreground z-[130]" // Ensure button is clickable above overlays
      aria-label={isClose ? "Close menu" : "Open menu"}
      data-testid={isClose ? "menu-close" : "menu-open"}
    >
      {isClose ? <X className="w-6 h-6" /> :
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
      }
    </Button>
  );

  // --- JSX Structure ---
  return (
    // Use theme-aware background for the main container
    <div className={`flex min-h-screen w-full relative bg-background text-foreground ${theme}`}>
      {/* Desktop Sidebar (Static) */}
      <aside className="hidden md:flex flex-col w-64 bg-card p-4 space-y-6 border-r border-border h-screen sticky top-0 shadow-sm z-[90]" data-testid="desktop-sidebar">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-foreground tracking-tight px-3"
        >
          SynKro
        </motion.h1>
        {/* Render MenuLinks component */}
        <MenuLinks />
        {/* Create Project Button at the bottom */}
        <div className="mt-auto pt-4 border-t border-border">
          <Button
            className="w-full flex items-center justify-center" // Ensure icon and text align
            onClick={() => setShowProjectPopup(true)}
            data-testid="create-project-desktop"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Create Project
          </Button>
        </div>
      </aside>

      {/* Mobile Menu Button (Fixed Position) */}
      {/* Only show the hamburger when the sidebar is closed on mobile */}
      {!showSidebar && (
        <div className="md:hidden fixed top-3 left-3 z-[120]">
          <MenuIcon onClick={(e) => { e.stopPropagation(); setShowSidebar(true); }} />
        </div>
      )}

      {/* Mobile Sidebar (Animated Drawer) */}
      <AnimatePresence>
        {showSidebar && (
          <>
            {/* Overlay */}
            <motion.div
              key="sidebar-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-[100] md:hidden" // Ensure overlay is below sidebar content but above main content
              onClick={() => setShowSidebar(false)} // Close on overlay click
              data-testid="sidebar-overlay"
            />
            {/* Sidebar Content */}
            <motion.aside
              key="sidebar-content"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 w-64 h-screen bg-card p-4 space-y-6 border-r border-border z-[110] overflow-y-auto shadow-lg flex flex-col md:hidden" // Highest z-index for sidebar itself
              data-testid="mobile-sidebar"
            >
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-foreground tracking-tight px-3">
                  SynKro
                </h1>
                {/* Close Icon inside the sidebar */}
                <MenuIcon onClick={(e) => { e.stopPropagation(); setShowSidebar(false); }} isClose={true} />
              </div>
              {/* Render MenuLinks component */}
              <MenuLinks />
              {/* Create Project Button at the bottom */}
              <div className="mt-auto pt-4 border-t border-border">
                <Button
                  className="w-full flex items-center justify-center"
                  onClick={() => {
                    setShowProjectPopup(true);
                    setShowSidebar(false); // Close sidebar after clicking
                  }}
                  data-testid="create-project-mobile"
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
          // Use theme-aware card background
          className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-card rounded-lg shadow-sm p-4 border border-border relative z-10" // z-10 to be above content but below popups
        >
          {/* Search Input & Results */}
          <div className="w-full sm:flex-1 relative" ref={searchRef}>
            <motion.input
              type="text"
              // Use theme-aware input background
              className="w-full p-3 bg-input text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base placeholder-muted-foreground transition-colors"
              placeholder="Search projects, users..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => { /* Can trigger search fetch immediately on focus if desired */ }}
              whileFocus={{ scale: 1.01 }} // Subtle focus animation
              transition={{ duration: 0.1 }}
              aria-label="Search"
            />
            {/* Search Results Dropdown */}
            <AnimatePresence>
              {(searchResults.projects.length > 0 || searchResults.users.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-full mt-2 w-full bg-popover rounded-md shadow-lg border border-border z-50 max-h-80 overflow-y-auto" // High z-index
                  data-testid="search-results"
                >
                  {searchResults.projects.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-1 uppercase tracking-wider">
                        Projects
                      </h3>
                      {searchResults.projects.map((project) => (
                        <Button
                           variant="ghost"
                           key={project._id}
                           className="w-full text-left justify-start px-3 py-1.5 h-auto text-sm text-popover-foreground hover:bg-muted transition-colors rounded"
                           onClick={() => {
                              router.push(`/projects/${project._id}`);
                              setSearchText(""); // Clear search after selection
                              setSearchResults({ projects: [], users: [] }); // Close dropdown
                           }}
                         >
                          {project.title}
                         </Button>
                      ))}
                    </div>
                  )}
                  {searchResults.users.length > 0 && (
                    <div className="p-2 border-t border-border">
                      <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-1 uppercase tracking-wider">
                        Users
                      </h3>
                      {searchResults.users.map((u) => (
                        <Button
                           variant="ghost"
                           key={u._id}
                           className="w-full text-left justify-start px-3 py-1.5 h-auto text-sm text-popover-foreground hover:bg-muted transition-colors rounded"
                           onClick={() => {
                              router.push(`/profile/${u._id}`); // Navigate to user profile
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
            {/* Leaderboard */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLeaderboard}
              className="text-yellow-500 hover:bg-yellow-500/10 w-9 h-9 sm:w-10 sm:h-10" // Adjusted size
              aria-label="Leaderboard"
              data-testid="leaderboard-button"
            >
              <Trophy className="w-5 h-5" />
            </Button>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); setShowNotifications((prev) => !prev); }}
                className="text-primary hover:bg-primary/10 w-9 h-9 sm:w-10 sm:h-10 relative" // Adjusted size
                aria-label="Notifications"
                data-testid="notifications-button"
              >
                <Bell className="w-5 h-5" />
                {/* Unread indicator */}
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                )}
              </Button>
              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-popover shadow-lg rounded-md border border-border z-50 overflow-hidden max-h-96 overflow-y-auto" // Wider dropdown
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                     data-testid="notifications-dropdown"
                  >
                    <div className="p-2 px-3 border-b border-border">
                       <h4 className="text-sm font-semibold text-popover-foreground">Notifications</h4>
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
                            if (!notification.read) markNotificationAsRead(notification._id);
                            if (notification.link) {
                               try { router.push(notification.link); }
                               catch (err) { toast.error("Invalid notification link.") }
                            }
                            setShowNotifications(false); // Close dropdown after click
                          }}
                        >
                          {/* Render notification message */}
                           <p className="line-clamp-2">{notification.message}</p>
                           <span className="text-xs text-muted-foreground mt-0.5 block">
                               {new Date(notification.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'})}
                           </span>
                          {!notification.read && (
                            <span className="absolute top-3 right-3 block h-1.5 w-1.5 rounded-full bg-primary" />
                          )}
                        </button>
                      ))}
                      </div>
                    )}
                     <div className="p-2 px-3 border-t border-border text-center">
                       <Button variant="link" size="sm" className="text-xs text-primary">View All (Not implemented)</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-destructive hover:bg-destructive/10 w-9 h-9 sm:w-10 sm:h-10" // Adjusted size
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
          transition={{ duration: 0.5, delay: 0.1 }} // Slightly delayed
          className="w-full text-center mb-8 md:mb-10 py-4"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Welcome back, {user.username || "Developer"}!
          </h1>
          <p className="text-muted-foreground mt-1 text-base sm:text-lg">Explore projects or start your own.</p>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }} // Slightly more delayed
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              Explore Projects
            </h2>
            {/* Show create button here only on larger screens if not in sidebar */}
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex md:hidden" // Show on SM, hide on MD+ (desktop sidebar has it)
              onClick={() => setShowProjectPopup(true)}
              data-testid="create-project-main-tablet"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Create New
            </Button>
          </div>

          {/* Project Grid */}
          {projects.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-10 border border-dashed border-border rounded-lg">
              No projects found yet. <br />
               <Button variant="link" onClick={() => setShowProjectPopup(true)} className="text-primary">
                    Create the first project!
               </Button>
            </div>
           ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project, idx) => (
                <ProjectCard
                  key={project._id || idx} // Use _id if available, fallback to index
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

      {/* Project Popup Modal (Rendered outside main content flow) */}
      <AnimatePresence>
        {showProjectPopup && (
          <ProjectPopup
            userId={user._id}
            onClose={() => setShowProjectPopup(false)}
            onProjectCreated={handleProjectCreated} // Pass the handler
          />
        )}
      </AnimatePresence>
    </div>
  );
}