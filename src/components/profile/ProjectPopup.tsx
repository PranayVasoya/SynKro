import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// Interfaces
import { Project } from "@/interfaces/project";
import { UserLookup } from "@/interfaces/user";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Icons
import { X } from "lucide-react";

const ProjectPopup = ({
  userId,
  onClose,
  onAddProject,
}: {
  userId: string | undefined;
  onClose: () => void;
  onAddProject: (project: Omit<Project, "_id" | "createdBy">) => Promise<void>;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [lookingForMembers, setLookingForMembers] = useState(false);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserLookup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUsers = async () => {
      try {
        const response = await axios.get<{ data: UserLookup[] }>("/api/users", {
          signal,
        });
        setAvailableUsers(response.data.data);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching users for popup:", error);
          toast.error("Failed to load users for team selection");
        }
      }
    };
    fetchUsers();
    return () => controller.abort();
  }, []);

  const filteredUsers = availableUsers.filter(
    (user) =>
      user._id !== userId &&
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    setIsSubmitting(true);
    const projectData: Omit<Project, "_id" | "createdBy"> = {
      title,
      description,
      techStack: techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      repoLink: repoLink || undefined,
      liveLink: liveLink || undefined,
      lookingForMembers,
      teamMembers,
      status: "active",
    };
    try {
      await onAddProject(projectData);
      onClose();
    } catch (error) {
      console.error("Error submitting project from popup:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTeamMember = (userId: string) => {
    setTeamMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      {/* New Project Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="bg-card p-6 rounded-lg shadow-xl w-full max-w-lg border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Create New Project
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground h-7 w-7"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 pl-1"
        >
          <div>
            <label
              htmlFor="popup-proj-title"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Project Title
            </label>
            <Input
              id="popup-proj-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              required
              className="w-full min-h-fit p-2 border rounded-md focus:ring-2 focus:ring-ring focus:outline-none bg-background text-foreground border-border transition-colors resize-y"
            />
          </div>
          <div>
            <label
              htmlFor="popup-proj-desc"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Description
            </label>
            <textarea
              id="popup-proj-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              required
              className="w-full min-h-[80px] p-2 border rounded-md focus:ring-2 focus:ring-ring focus:outline-none bg-background text-foreground border-border transition-colors resize-y"
            />
          </div>
          <div>
            <label
              htmlFor="popup-proj-stack"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Tech Stack (comma separated)
            </label>
            <Input
              id="popup-proj-stack"
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="e.g., React, Node.js, MongoDB"
              className="w-full min-h-fit p-2 border rounded-md focus:ring-2 focus:ring-ring focus:outline-none bg-background text-foreground border-border transition-colors resize-y"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label
                htmlFor="popup-proj-repo"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Repo Link
              </label>
              <Input
                id="popup-proj-repo"
                type="url"
                value={repoLink}
                onChange={(e) => setRepoLink(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full min-h-fit p-2 border rounded-md focus:ring-2 focus:ring-ring focus:outline-none bg-background text-foreground border-border transition-colors resize-y"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="popup-proj-live"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Live Link
              </label>
              <Input
                id="popup-proj-live"
                type="url"
                value={liveLink}
                onChange={(e) => setLiveLink(e.target.value)}
                placeholder="https://your-project.com"
                className="w-full min-h-fit p-2 border rounded-md focus:ring-2 focus:ring-ring focus:outline-none bg-background text-foreground border-border transition-colors resize-y"
              />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <label className="flex items-center text-sm font-medium text-foreground gap-2 cursor-pointer mb-4 w-fit">
              <input
                id="popup-proj-members-check"
                type="checkbox"
                checked={lookingForMembers}
                onChange={(e) => setLookingForMembers(e.target.checked)}
                className="accent-primary w-4 h-4 rounded"
              />
              Looking for Members
            </label>
            <div>
              <label
                htmlFor="popup-proj-team-search"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Add Team Members (Optional)
              </label>
              <Input
                id="popup-proj-team-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by username..."
                className="w-full min-h-fit p-2 border rounded-md focus:ring-2 focus:ring-ring focus:outline-none bg-background text-foreground border-border transition-colors resize-y"
              />
              <div className="max-h-32 overflow-y-auto mt-2 border border-border rounded-md p-2 space-y-1 bg-background">
                {searchQuery && filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <label
                      key={user._id}
                      className="flex items-center space-x-2 p-1 cursor-pointer hover:bg-muted rounded"
                    >
                      <input
                        type="checkbox"
                        checked={teamMembers.includes(user._id)}
                        onChange={() => toggleTeamMember(user._id)}
                        className="accent-primary rounded w-4 h-4"
                      />
                      <span className="text-sm text-foreground">
                        {user.username}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-muted-foreground text-xs text-center py-2">
                    {searchQuery
                      ? "No matching users found"
                      : "Start typing to search users"}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProjectPopup;
