"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Components
import { Button } from "../ui/button";

// Interfaces
import type { NotificationData } from "@/interfaces/notification";

interface NotificationsDropdownProps {
  notifications: NotificationData[];
  onClose: () => void;
  onMarkAsRead: (notificationId: string) => Promise<void>;
}

export default function NotificationsDropdown({
  notifications,
  onClose,
  onMarkAsRead,
}: NotificationsDropdownProps) {
  const router = useRouter();

  const handleNotificationClick = async (notification: NotificationData) => {
    if (!notification.read) {
      await onMarkAsRead(notification._id);
    }
    if (notification.link) {
      try {
        router.push(notification.link);
      } catch (err) {
        console.error("Navigation failed for notification link:", err);
        toast.error("Invalid notification link.");
      }
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-popover shadow-xl rounded-md border border-border z-50 overflow-hidden max-h-[70vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
      data-testid="notifications-dropdown"
    >
      <div className="p-3 border-b border-border flex-shrink-0">
        <h4 className="text-sm font-semibold text-popover-foreground">
          Notifications
        </h4>
      </div>

      {notifications.length === 0 ? (
        <div className="flex-grow flex items-center justify-center px-3 py-8 text-sm text-center text-muted-foreground">
          No new notifications
        </div>
      ) : (
        <div className="divide-y divide-border overflow-y-auto flex-grow">
          {" "}
          {notifications.map((notification) => (
            <button
              type="button"
              key={notification._id}
              className={`w-full text-left px-3 py-2.5 text-sm text-popover-foreground hover:bg-muted focus-visible:bg-muted focus-visible:outline-none transition-colors block ${
                !notification.read
                  ? "font-semibold bg-primary/20"
                  : "font-normal opacity-80"
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <p className="line-clamp-2 leading-snug">
                {notification.message}
              </p>
              <span className="text-xs text-muted-foreground mt-1 block">
                {new Date(notification.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </button>
          ))}
        </div>
      )}

      {notifications.length > 0 && (
        <div className="p-2 border-t border-border text-center flex-shrink-0">
          <Button variant="link" size="sm" className="text-xs text-primary">
            View All (Not implemented)
          </Button>
          {/* TODO: Add "Mark all as Read" and "Clear All" buttons here */}
        </div>
      )}
    </motion.div>
  );
}