"use client";

import axios from "axios";
import { useTheme } from "../theme-context";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";

// Components
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/dashboard/ProjectCard";

// Interfaces
import type { ApiErrorResponse } from "@/interfaces/api";
import type { Project, LikeData } from "@/interfaces/project";
import type { NotificationData } from "@/interfaces/notification";
import type { UserData } from "@/interfaces/user";

// Icons
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
  X,
} from "lucide-react";

// Main Dashboard Component
export default function Dashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // UI State
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  // Data & Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null (loading), true (authenticated), false (not authenticated)
  const [user, setUser] = useState<Partial<UserData>>({}); // partial as it might not be fully loaded initially
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchResults, setSearchResults] = useState<{
    projects: Project[];
    users: UserData[];
  }>({ projects: [], users: [] });
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Refs for DOM elements
  const settingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch User (runs once on mount to determine authentication and get user data)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get<{ data: UserData }>("/api/users/me");
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
  }, [router]);

  // Fetch Projects (memoized)
  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await axios.get<{ data: Project[] }>("/api/projects");
      setProjects(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch projects", err);
      toast.error("Failed to load projects");
      setProjects([]);
    }
  }, [isAuthenticated]);

  // Fetch Notifications (memoized)
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await axios.get<{ data: NotificationData[] }>(
        "/api/notifications"
      );
      setNotifications(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
      setNotifications([]);
    }
  }, [isAuthenticated]);

  // Effects to call memoized fetch functions
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // --- Search Effect ---
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchText.trim()) {
        setSearchResults({ projects: [], users: [] });
        return;
      }
      try {
        const [projectsRes, usersRes] = await Promise.all([
          axios.get<{ data: Project[] }>(
            `/api/projects?search=${encodeURIComponent(searchText)}`
          ),
          axios.get<{ data: UserData[] }>(
            `/api/users?search=${encodeURIComponent(searchText)}`
          ),
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
    handleResize();
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
  }, [searchResults]);

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
      console.error("Logout failed", error);
      let errorMessage = "Logout failed";
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
      console.error("Comment failed", error);
      let errorMessage = "Failed to add comment";
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
    },
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
    >
      {menuItemsDefinition.map((item, idx) => (
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
      ))}
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
      className={`flex min-h-screen w-full relative bg-card text-foreground`}
    >
      <Toaster position="top-center" reverseOrder={false} />
      {/* Desktop Sidebar */}
      <aside className="bg-card hidden md:flex flex-col w-64 p-4 space-y-6 border-r border-border h-screen sticky top-0 shadow-md z-[90]">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-semibold text-foreground mx-2"
        >
          SynKro
        </motion.h1>
        <MenuLinks />
      </aside>
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
      <main className="flex-1 flex flex-col items-center p-4 sm:p-6 w-full overflow-y-auto bg-background">
        {/* Header Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full flex flex-row items-center gap-3 sm:gap-4 mb-6 bg-card rounded-lg shadow-lg p-3 sm:p-4 border border-border relative z-10"
        >
          {/* Mobile Menu Button */}
          <div className="md:hidden flex-shrink-0">
            <MenuIcon
              onClick={(e) => {
                e.stopPropagation();
                setShowSidebar(true);
              }}
            />
          </div>

          {/* Search Input & Results */}
          <div className="w-full flex-1 relative" ref={searchRef}>
            <motion.input
              type="text"
              className="w-full p-3 bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base placeholder-placeholder transition-colors shadow-md"
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
                      <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-1 uppercase tracking-wider">
                        Projects
                      </h3>
                      {searchResults.projects.map((project) => (
                        <Button
                          variant="ghost"
                          key={project._id}
                          className="w-full text-left justify-start px-3 py-1.5 h-auto text-sm text-popover-foreground hover:bg-accent transition-colors rounded"
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
                      <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-1 uppercase tracking-wider">
                        Users
                      </h3>
                      {searchResults.users.map((user) => (
                        <Button
                          variant="ghost"
                          key={user._id}
                          className="w-full text-left justify-start px-3 py-1.5 h-auto text-sm text-popover-foreground hover:bg-accent transition-colors rounded"
                          onClick={() => {
                            router.push(`/profile/${user._id}`);
                            setSearchText("");
                            setSearchResults({ projects: [], users: [] });
                          }}
                        >
                          {user.username}
                        </Button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLeaderboard}
              className="text-golden hover:bg-golden/10 w-8 h-8 sm:w-10 sm:h-10"
              aria-label="Leaderboard"
              data-testid="leaderboard-button"
            >
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <div className="relative" ref={notificationsRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications((prev) => !prev);
                }}
                className="text-primary hover:bg-primary/10 w-8 h-8 sm:w-10 sm:h-10 relative"
                aria-label="Notifications"
                data-testid="notifications-button"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 block h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
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
                      <h4 className="text-sm font-semibold text-muted-foreground">
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
                              !notification.read
                                ? "font-medium"
                                : "opacity-70 bg-accent"
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
                                  toast.error("Invalid notification link."); // TODO: check this later
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
                            {/* TODO: Add "Mark all as Read" (Double Tick) and "Clear All" (Dustbin) buttons */}
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
              className="text-destructive hover:bg-destructive/10 w-8 h-8 sm:w-10 sm:h-10"
              aria-label="Logout"
              data-testid="logout-button"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
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
            {/* Placeholder space for future quick-access buttons */}
          </div>
          {/* Project Grid */}
          {projects.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-10 border border-dashed border-border rounded-lg">
              {" "}
              No projects found yet. <br />{" "}
              <Button
                variant="link"
                // TODO: Verify whether it redirects properly
                onClick={() => router.push("/profile")}
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
    </div>
  );
}
