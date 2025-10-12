"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FolderKanban, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Project } from "@/interfaces/project";

interface ProjectsSidebarProps {
  projects: Project[];
  userId: string;
}

export default function ProjectsSidebar({
  projects,
  userId,
}: ProjectsSidebarProps) {
  const router = useRouter();
  const [showProjectsPopup, setShowProjectsPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  // Get user's projects (owned or team member)
  const userProjects = projects.filter(
    (p) =>
      (p.createdBy && p.createdBy._id === userId) ||
      p.teamMembers.some((m) => m._id === userId)
  );

  // Get most recent project
  const mostRecentProject = userProjects.length > 0 ? userProjects[0] : null;

  // Filter projects based on search
  const filteredProjects = userProjects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowProjectsPopup(false);
      }
    };

    if (showProjectsPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProjectsPopup]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
    setShowProjectsPopup(false);
  };

  return (
    <div className="relative">
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
          Projects
        </h3>

        {/* Most Recent Project */}
        {mostRecentProject ? (
          <motion.div
            whileHover={{ x: 3 }}
            className="px-3 py-2 hover:bg-muted rounded-md cursor-pointer transition-colors mb-2"
            onClick={() => handleProjectClick(mostRecentProject._id)}
          >
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium truncate">
                {mostRecentProject.title}
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            No projects yet
          </div>
        )}

        {/* More Projects Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowProjectsPopup(!showProjectsPopup)}
          className="w-full justify-start px-3 text-sm text-muted-foreground hover:text-foreground"
        >
          More Projects
        </Button>
      </div>

      {/* Projects Popup */}
      <AnimatePresence>
        {showProjectsPopup && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-sm">All Projects</h3>
              <button
                onClick={() => setShowProjectsPopup(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Projects List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredProjects.length > 0 ? (
                <div className="p-2">
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project._id}
                      whileHover={{ x: 3 }}
                      className="px-3 py-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
                      onClick={() => handleProjectClick(project._id)}
                    >
                      <div className="flex items-center gap-2">
                        <FolderKanban className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {project.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {project.createdBy && project.createdBy._id === userId
                              ? "Owner"
                              : "Team Member"}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  {searchQuery ? "No projects found" : "No projects available"}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
