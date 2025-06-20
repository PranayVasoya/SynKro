"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { Project } from "@/interfaces/project";
import type { UserData } from "@/interfaces/user";

interface SearchResultsDropdownProps {
  projects: Project[];
  users: UserData[];
  onResultClick: () => void;
}

export default function SearchResultsDropdown({
  projects,
  users,
  onResultClick,
}: SearchResultsDropdownProps) {
  const router = useRouter();

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
    onResultClick();
  };

  const handleUserClick = (userId: string) => {
    router.push(`/profile/${userId}`);
    onResultClick();
  };

  if (projects.length === 0 && users.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute top-full mt-2 w-full bg-popover rounded-md shadow-xl border border-border z-50 max-h-80 overflow-y-auto"
      data-testid="search-results-dropdown"
    >
      {projects.length > 0 && (
        <div className="p-2">
          <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-1 uppercase tracking-wider">
            Projects
          </h3>
          {projects.map((project) => (
            <Button
              variant="ghost"
              key={project._id}
              className="w-full text-left justify-start px-3 py-1.5 h-auto text-sm text-popover-foreground hover:bg-accent transition-colors rounded"
              onClick={() => handleProjectClick(project._id)}
            >
              {project.title}
            </Button>
          ))}
        </div>
      )}
      {users.length > 0 && (
        <div className={`p-2 ${projects.length > 0 ? 'border-t border-border' : ''}`}>
          <h3 className="text-xs font-semibold text-muted-foreground px-2 mb-1 uppercase tracking-wider">
            Users
          </h3>
          {users.map((user) => (
            <Button
              variant="ghost"
              key={user._id}
              className="w-full text-left justify-start px-3 py-1.5 h-auto text-sm text-popover-foreground hover:bg-accent transition-colors rounded"
              onClick={() => handleUserClick(user._id)}
            >
              {user.username}
            </Button>
          ))}
        </div>
      )}
    </motion.div>
  );
}