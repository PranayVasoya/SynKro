"use client";

import axios from "axios";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";

// Components
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/dashboard/ProjectCard";
import MenuIcon from "@/components/dashboard/MenuIcon";
import MenuLinks, {
  MenuItemDefinition,
} from "@/components/dashboard/MenuLinks";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// Interfaces
import type { ApiErrorResponse } from "@/interfaces/api";
import type { Project, LikeData } from "@/interfaces/project";
import type { NotificationData } from "@/interfaces/notification";
import type { UserData } from "@/interfaces/user";

// Icons
import {
  Cog,
  MessageCircle,
  Users,
  User,
} from "lucide-react";

// Main Dashboard Component
export default function Dashboard() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

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

  // Memoized values & Callbacks
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
  const menuItemsDefinition = useMemo(
    (): MenuItemDefinition[] => [
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
    ],
    [router, user?._id]
  );

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

  // --- Theme Toggle State ---
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

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
  const handleSearchResultClick = () => {
    setSearchText("");
    setSearchResults({ projects: [], users: [] });
  };

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
        <MenuLinks
          menuItems={menuItemsDefinition}
          settingsRef={settingsRef}
          showSettingsDropdown={showSettingsDropdown}
          theme={theme}
          toggleTheme={toggleTheme}
          router={router}
          setShowSettingsDropdown={setShowSettingsDropdown}
          setShowSidebar={setShowSidebar}
        />
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
              <MenuLinks
                menuItems={menuItemsDefinition}
                settingsRef={settingsRef}
                showSettingsDropdown={showSettingsDropdown}
                theme={theme}
                toggleTheme={toggleTheme}
                router={router}
                setShowSettingsDropdown={setShowSettingsDropdown}
                setShowSidebar={setShowSidebar}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center p-4 sm:p-6 w-full overflow-y-auto bg-background">
        <DashboardHeader 
          searchText={searchText}
          onSearchTextChange={setSearchText}
          searchResults={searchResults}
          onSearchResultClick={handleSearchResultClick}
          searchRef={searchRef}
          onToggleMobileSidebar={() => setShowSidebar(prev => !prev)}
          onLeaderboardClick={handleLeaderboard}
          onToggleNotifications={() => setShowNotifications(prev => !prev)}
          onLogoutClick={onLogout}
          showNotifications={showNotifications}
          notifications={notifications}
          notificationsRef={notificationsRef}
          onMarkNotificationAsRead={markNotificationAsRead}
        />

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
