// src/components/ProjectCard.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

// Components
import { Button } from "@/components/ui/button";
import { cn } from "@/app/lib/utils";

// Interfaces
import type { Project, CommentData } from "@/interfaces/project";
import type { UserLookup } from "@/interfaces/user";

// Icons
import { Info, Heart, Send, Trash2 } from "lucide-react";

// --- ProjectCard Component ---
const ProjectCard = ({
  project,
  user,
  handleLike,
  handleComment,
  handleDelete,
  router,
}: {
  project: Project;
  user: Partial<UserLookup>;
  handleLike: (projectId: string) => void;
  handleComment: (
    projectId: string,
    text: string,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => void;
  handleDelete?: (projectId: string) => void;
  router: AppRouterInstance;
}) => {
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const isLiked = user?._id && project.likes?.includes(user._id as never);

  const [commentPlaceholder, setCommentPlaceholder] = useState("Add a comment...");
  const [isHovered, setIsHovered] = useState(false); // Client-side state
  const [isDeleteHovered, setIsDeleteHovered] = useState(false); // Delete icon hover state
  
  // Check if current user is the creator
  const isCreator = user?._id && project.createdBy?._id === user._id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "bg-card rounded-lg border-2 border-border p-4 flex flex-col justify-between shadow-md transition-all duration-200 h-full relative",
        isHovered && "border-primary"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      suppressHydrationWarning // Prevents hydration warning for client-side state
    >
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="absolute inset-0 bg-neutral-200 dark:bg-slate-800/[0.8] rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8, transition: { duration: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
          />
        )}
      </AnimatePresence>
      {/* Clickable Area */}
      <div
        onClick={() => router.push(`/projects/${project._id}`)}
        className="flex flex-col flex-grow mb-3 h-full cursor-pointer relative z-10"
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            router.push(`/projects/${project._id}`);
        }}
      >
        <div className="flex items-start justify-between">
          <motion.h3
            initial={false} // Prevents SSR mismatch
            className="font-semibold text-card-foreground hover:underline w-fit"
            animate={{
              fontWeight: isHovered ? 700 : 400,
              textShadow: isHovered ? "0 0 2px rgba(255, 255, 255, 0.8)" : "0 0 0px rgba(0, 0, 0, 0)",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {project.title}
          </motion.h3>
          {isCreator && handleDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(project._id);
              }}
              onMouseEnter={() => setIsDeleteHovered(true)}
              onMouseLeave={() => setIsDeleteHovered(false)}
              className="flex-shrink-0 p-1 rounded transition-colors"
              aria-label="Delete project"
            >
              <Trash2
                className={`w-4 h-4 transition-colors ${
                  isDeleteHovered ? "text-red-500" : "text-black dark:text-white"
                }`}
              />
            </button>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {project.description}
        </p>
        <div
          className="mt-1 text-muted-foreground hover:text-primary w-fit"
          title={project.description}
          onClick={(e) => e.stopPropagation()}
        >
          <Info className="w-3 h-3 mt-1" />
        </div>
        {project.techStack && project.techStack.length > 0 && (
          <div className="text-xs text-muted-foreground line-clamp-1 mt-4 mb-1">
            <span className="font-semibold text-foreground/80">
              Tech Stack:
            </span>
            {project.techStack.map((tech, index) => (
              <span
                key={index}
                className="inline-block bg-muted rounded-full px-3 py-1 font-semibold mx-1"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="text-xs text-muted-foreground mt-1">
          <span className="font-semibold text-foreground/80">Created By:</span>{" "}
          <span
            className="hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              if (project.createdBy?._id) {
                router.push(`/profile/${project.createdBy._id}`);
              } else {
                console.warn(
                  "Creator ID not available for profile navigation."
                );
              }
            }}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation();
                if (project.createdBy?._id)
                  router.push(`/profile/${project.createdBy._id}`);
              }
            }}
          >
            {project.createdBy?.username || "Unknown User"}
          </span>
        </div>
      </div>
      {/* --- End of Clickable Area --- */}

      {/* Interaction Area */}
      <div className="mt-auto space-y-3 border-t border-border pt-3 relative z-10">
        {/* Likes Section */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (!user?._id) {
                toast.error("Please log in to like projects.");
                return;
              }
              handleLike(project._id);
            }}
            disabled={!user?._id}
            className={`flex items-center px-2 py-1 rounded-md text-sm ${
              isLiked && user?._id
                ? "text-destructive hover:bg-destructive/10"
                : "text-muted-foreground hover:bg-muted"
            } ${!user?._id ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <Heart
              className={`w-5 h-5 mr-1 ${
                isLiked && user?._id ? "fill-current" : ""
              }`}
            />
            {project.likes?.length || 0} Like{project.likes?.length !== 1 ? "s" : ""}
          </Button>
        </div>
        {/* --- End of Likes Section --- */}

        {/* Comments Section */}
        <div className="space-y-2">
          {/* Add Comment Input */}
          <div className="flex items-center space-x-2">
            <input
              ref={commentInputRef}
              type="text"
              placeholder={commentPlaceholder}
              className="flex-1 p-2 border-2 border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-sm h-9"
              onFocus={() => setCommentPlaceholder("")}
              onBlur={(e) =>
                !e.target.value && setCommentPlaceholder("Add a comment...")
              }
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  commentInputRef.current?.value.trim()
                ) {
                  e.preventDefault();
                  if (!user?._id) {
                    toast.error("Please log in to comment.");
                    return;
                  }
                  handleComment(
                    project._id,
                    commentInputRef.current.value,
                    commentInputRef
                  );
                }
              }}
              disabled={!user?._id}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                if (!user?._id) {
                  toast.error("Please log in to comment.");
                  return;
                }
                if (commentInputRef.current?.value.trim()) {
                  handleComment(
                    project._id,
                    commentInputRef.current.value,
                    commentInputRef
                  );
                }
              }}
              disabled={!user?._id}
              className={`text-primary hover:bg-primary/10 h-9 w-9 flex-shrink-0 ${
                !user?._id ? "cursor-not-allowed opacity-70" : ""
              }`}
              aria-label="Send comment"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {project.comments?.slice(-2).map((comment: CommentData) => (
            <div
              key={comment._id}
              className="text-sm text-muted-foreground pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-semibold text-foreground/80">
                {comment.userId?.username || "User"}:{" "}
              </span>
              {comment.text}
            </div>
          ))}
          {project.comments && project.comments.length > 2 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/projects/${project._id}`);
              }}
              className="text-xs text-primary hover:underline pt-2"
            >
              View all comments...
            </button>
          )}
        </div>
        {/* --- End of Comments Section --- */}
      </div>
      {/* --- End of Interaction Area --- */}
    </motion.div>
  );
};

export default ProjectCard;