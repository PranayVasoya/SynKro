"use client";

import React, { RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import MenuIcon from "./MenuIcon";
import SearchResultsDropdown from "./SearchResultsDropdown";
import NotificationsDropdown from "./NotificationsDropdown";

// Icons
import { Bell, Trophy, LogOut } from "lucide-react";

// Interfaces
import type { Project } from "@/interfaces/project";
import type { UserData } from "@/interfaces/user";
import type { NotificationData } from "@/interfaces/notification";

interface DashboardHeaderProps {
  // Search related
  searchText: string;
  onSearchTextChange: (text: string) => void;
  searchResults: { projects: Project[]; users: UserData[] };
  onSearchResultClick: () => void;
  searchRef: RefObject<HTMLDivElement | null>;

  // Mobile Sidebar
  onToggleMobileSidebar: () => void;

  // Action Buttons
  onLeaderboardClick: () => void;
  onToggleNotifications: () => void;
  onLogoutClick: () => void;

  // Notifications Dropdown
  showNotifications: boolean;
  notifications: NotificationData[];
  notificationsRef: RefObject<HTMLDivElement | null>;
  onMarkNotificationAsRead: (notificationId: string) => Promise<void>;
}

export default function DashboardHeader({
  searchText,
  onSearchTextChange,
  searchResults,
  onSearchResultClick,
  searchRef,
  onToggleMobileSidebar,
  onLeaderboardClick,
  onToggleNotifications,
  onLogoutClick,
  showNotifications,
  notifications,
  notificationsRef,
  onMarkNotificationAsRead,
}: DashboardHeaderProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full flex flex-row items-center gap-3 sm:gap-4 mb-6 bg-card rounded-lg shadow-lg p-3 sm:p-4 border border-border relative z-20"
    >
      {/* Mobile Menu Button */}
      <div className="md:hidden flex-shrink-0">
        <MenuIcon onClick={onToggleMobileSidebar} />
      </div>

      {/* Search Input & Results */}
      <div className="w-full flex-1 relative" ref={searchRef}>
        <motion.input
          type="text"
          className="w-full p-3 bg-muted dark:bg-background text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base placeholder-placeholder transition-colors shadow-sm"
          placeholder="Search projects, users..."
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.1 }}
          aria-label="Search"
        />
        <AnimatePresence>
          {(searchResults.projects.length > 0 || searchResults.users.length > 0) && (
            <SearchResultsDropdown
              projects={searchResults.projects}
              users={searchResults.users}
              onResultClick={onSearchResultClick}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onLeaderboardClick}
          className="text-golden hover:bg-golden/10 w-8 h-8 sm:w-10 sm:h-10"
          aria-label="Leaderboard"
          data-testid="leaderboard-button"
        >
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        {/* Notifications Button and Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleNotifications();
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
              <NotificationsDropdown
                notifications={notifications}
                onClose={onToggleNotifications}
                onMarkAsRead={onMarkNotificationAsRead}
              />
            )}
          </AnimatePresence>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onLogoutClick}
          className="text-destructive hover:bg-destructive/10 w-8 h-8 sm:w-10 sm:h-10"
          aria-label="Logout"
          data-testid="logout-button"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </motion.div>
  );
}