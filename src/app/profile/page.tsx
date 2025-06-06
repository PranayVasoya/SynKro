"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Plus, X, Edit3, Check, Link as LinkIcon } from "lucide-react";

import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import {
  INITIAL_SKILLS_CATEGORIES,
  type SkillsCategories,
} from "@/constants/skills";

import Navbar from "@/components/Navbar";

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

interface Project {
  _id?: string;
  title: string;
  description: string;
  techStack: string[];
  repoLink?: string;
  liveLink?: string;
  createdBy: string;
  teamMembers: string[];
  lookingForMembers: boolean;
  status: "active" | "completed";
}

interface FormData {
  username: string;
  prn: string;
  batch: string;
  email: string;
  mobile: string;
  github: string;
  linkedin: string;
  skills: string[];
}

interface UserData extends FormData {
  _id: string;
}

interface Badge {
  name: string;
  description: string;
  icon: string;
}

interface UserLookup {
  _id: string;
  username: string;
}

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
// --- End New Project Modal Component ---

// --- Profile Page Component ---
export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    prn: "",
    batch: "",
    email: "",
    mobile: "",
    github: "",
    linkedin: "",
    skills: [],
  });
  const [originalData, setOriginalData] = useState<UserData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<UserLookup[]>([]);
  const [skillsCategories, setSkillsCategories] = useState<SkillsCategories>(
    () => JSON.parse(JSON.stringify(INITIAL_SKILLS_CATEGORIES))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const badges: Badge[] = [
    {
      name: "Top Contributor",
      description: "Top 10 on leaderboard.",
      icon: "🏆",
    },
  ];

  // --- Data Fetching Function ---
  const fetchProfileData = useCallback(
    async (signal: AbortSignal) => {
      setIsLoading(true);
      try {
        const [userRes, projectsRes, allUsersRes] = await Promise.all([
          axios.get<{ data: UserData }>("/api/users/me", { signal }),
          axios.get<{ data: Project[] }>("/api/projects", { signal }),
          axios.get<{ data: UserLookup[] }>("/api/users", { signal }),
        ]);

        const user = userRes.data.data;
        if (!user || !user._id) {
          throw new Error("User data or ID missing.");
        }

        setUserId(user._id);
        const currentFormData = {
          username: user.username || "",
          prn: user.prn || "",
          batch: user.batch || "",
          email: user.email || "",
          mobile: user.mobile || "",
          github: user.github || "",
          linkedin: user.linkedin || "",
          skills: user.skills || [],
        };
        setFormData(currentFormData);
        setOriginalData({ ...user, ...currentFormData });
        updateSkillChecks(user.skills || []);

        // Assuming /api/projects returns *all* projects, filter for user's projects here
        // If /api/projects is meant to *only* return user's projects, this filter isn't needed
        const userProjects = (projectsRes.data.data || []).filter(
          (p) => p.createdBy === user._id || p.teamMembers.includes(user._id)
        );
        setProjects(userProjects);
        setAvailableUsers(allUsersRes.data.data || []);
      } catch (error: unknown) {
        if (axios.isCancel(error)) {
          console.log("Data fetching cancelled.");
        } else {
          console.error("Error fetching profile data:", error);
          toast.error("Failed to load profile data. Please refresh.");
          if (
            axios.isAxiosError(error) &&
            (error.response?.status === 401 || error.response?.status === 403)
          ) {
            router.push("/signin");
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  // --- Initial Data Fetch UseEffect ---
  useEffect(() => {
    const controller = new AbortController();
    fetchProfileData(controller.signal);
    return () => {
      controller.abort();
    };
  }, [fetchProfileData]);

  // --- Helper & Handler Functions ---
  const updateSkillChecks = (savedSkills: string[]) => {
    setSkillsCategories((prevCategories) => {
      const updated: SkillsCategories = {};
      Object.keys(prevCategories).forEach((category) => {
        updated[category] = prevCategories[category].map((skill) => ({
          ...skill,
          checked: savedSkills.includes(skill.name),
        }));
      });
      return updated;
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillToggle = (category: string, skillId: string) => {
    if (!editProfileMode) return;

    let toggledSkillName: string | undefined;
    setSkillsCategories((prevCategories) => {
      const updatedCategory = prevCategories[category]?.map((skill) => {
        if (skill.id === skillId) {
          toggledSkillName = skill.name;
          return { ...skill, checked: !skill.checked };
        }
        return skill;
      });
      return updatedCategory
        ? { ...prevCategories, [category]: updatedCategory }
        : prevCategories;
    });

    if (toggledSkillName) {
      // Read the *intended next* state directly after setting it for accurate update
      const isChecked = !skillsCategories[category]?.find(
        (s) => s.id === skillId
      )?.checked;
      setFormData((prevFormData) => {
        const skillsSet = new Set(prevFormData.skills);
        if (isChecked) {
          skillsSet.add(toggledSkillName!);
        } else {
          skillsSet.delete(toggledSkillName!);
        }
        return { ...prevFormData, skills: Array.from(skillsSet) };
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (
        !formData.username ||
        !formData.prn ||
        !formData.batch ||
        !formData.mobile
      ) {
        toast.error("Username, PRN, Batch, and Mobile are required fields.");
        return;
      }
      const currentSelectedSkills: string[] = [];
      Object.values(skillsCategories).forEach((cat) =>
        cat.forEach((skill) => {
          if (skill.checked && skill.name) {
            currentSelectedSkills.push(skill.name);
          }
        })
      );

      const updatePayload = {
        username: formData.username,
        prn: formData.prn,
        batch: formData.batch,
        mobile: formData.mobile,
        github: formData.github || "",
        linkedin: formData.linkedin || "",
        skills: currentSelectedSkills,
        profileComplete: true,
      };

      await axios.put("/api/users/update", updatePayload);

      if (userId && originalData) {
        const newOriginalData: UserData = {
          username: updatePayload.username,
          prn: updatePayload.prn,
          batch: updatePayload.batch,
          mobile: updatePayload.mobile,
          github: updatePayload.github,
          linkedin: updatePayload.linkedin,
          skills: updatePayload.skills,
          _id: userId,
          email: originalData.email,
        };
        setOriginalData(newOriginalData);
      } else {
        console.warn("Could not update originalData state after save.");
      }

      setFormData((prev) => ({ ...prev, skills: currentSelectedSkills }));
      setEditProfileMode(false);
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      let errorMessage = "Failed to save profile.";
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as {
          message?: string;
          error?: string;
        };
        errorMessage =
          serverError?.message ||
          serverError?.error ||
          error.message ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error saving profile:", error);
      toast.error(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    if (originalData) {
      setFormData({
        username: originalData.username,
        prn: originalData.prn,
        batch: originalData.batch,
        email: originalData.email,
        mobile: originalData.mobile,
        github: originalData.github,
        linkedin: originalData.linkedin,
        skills: originalData.skills,
      });
      updateSkillChecks(originalData.skills);
    } else {
      console.warn("Cannot cancel edit: Original data not available.");
    }
    setEditProfileMode(false);
  };

  const onLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful!");
      router.push("/signin");
    } catch (error: unknown) {
      console.error("Logout Failed:", error);

      let errorMessage = "Logout failed. Please try again.";

      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as
          | ApiErrorResponse
          | undefined;
        errorMessage =
          serverError?.message ||
          serverError?.error ||
          error.message ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  const handleNewProject = () => {
    setShowProjectPopup(true);
  };

  const addProject = async (
    projectData: Omit<Project, "_id" | "createdBy">
  ) => {
    try {
      const response = await axios.post<{ data: Project }>(
        "/api/projects/create",
        projectData
      );
      setProjects((prevProjects) => [response.data.data, ...prevProjects]);
      toast.success("Project created successfully!");
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to create project.");
      throw error; // Re-throw for popup
    }
  };

  {
    /* --- Project Card Sub-component --- */
  }
  const ProjectCard = ({
    project,
    availableUsers,
  }: {
    project: Project;
    availableUsers: UserLookup[];
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-card rounded-lg shadow-sm border border-border"
    >
      <h4 className="text-lg font-semibold text-foreground mb-2">
        {project.title}
      </h4>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {project.description}
      </p>
      {/* Tech Stack */}
      <div className="mb-3">
        <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Tech Stack
        </h5>
        <div className="flex flex-wrap gap-1.5">
          {project.techStack?.length > 0 ? (
            project.techStack.map((skill, index) => (
              <span
                key={index}
                className="inline-block bg-muted rounded-full px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">
              Not specified
            </span>
          )}
        </div>
      </div>
      {/* Team Members */}
      <div className="mb-3">
        <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Team Members
        </h5>
        <div className="flex flex-wrap gap-1.5">
          {project.teamMembers?.length > 0 ? (
            project.teamMembers.map((memberId, index) => {
              const member = availableUsers.find(
                (user) => user._id === memberId
              );
              return (
                <span
                  key={index}
                  className="inline-block bg-muted rounded-full px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {member ? member.username : "..."}
                </span>
              );
            })
          ) : formData.username ? (
            <span className="inline-block bg-muted rounded-full px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {formData.username} (Creator)
            </span>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              Just you
            </span>
          )}
        </div>
      </div>

      {/* Links Section */}
      <div className="mb-3">
        {" "}
        <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
          Links
        </h5>{" "}
        <div className="flex items-center space-x-4">
          {" "}
          {project.repoLink ? (
            <a
              href={
                project.repoLink.startsWith("http")
                  ? project.repoLink
                  : `https://${project.repoLink}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-muted-foreground hover:text-primary transition-colors"
              title="Repository"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 opacity-50"
              >
                <polyline points="10 8 4 12 10 16"></polyline>
                <polyline points="14 8 20 12 14 16"></polyline>
              </svg>
              <span className="text-xs">Repo</span>
            </a>
          ) : (
            <span className="text-xs text-muted-foreground italic flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 opacity-50"
              >
                <polyline points="10 8 4 12 10 16"></polyline>
                <polyline points="14 8 20 12 14 16"></polyline>
              </svg>{" "}
              No Repo
            </span>
          )}
          {project.liveLink ? (
            <a
              href={
                project.liveLink.startsWith("http")
                  ? project.liveLink
                  : `https://${project.liveLink}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-muted-foreground hover:text-primary transition-colors"
              title="Live Demo"
            >
              <LinkIcon size={16} className="mr-1 flex-shrink-0" />
              <span className="text-xs">Live</span>
            </a>
          ) : (
            <span className="text-xs text-muted-foreground italic flex items-center">
              <LinkIcon size={16} className="mr-1 opacity-50" /> No Live Demo
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="text-xs text-muted-foreground border-t border-border pt-2 mt-2 flex justify-between items-center">
        <span>
          Status:{" "}
          <span
            className={`font-medium ${
              project.status === "active"
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500"
            }`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </span>
        {project.lookingForMembers && (
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            Recruiting
          </span>
        )}
      </div>
    </motion.div>
  );
  // --- End Project Card ---

  // --- Main Render ---
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 pt-6 sm:pt-8 bg-background">
        <Card className="w-full bg-card rounded-xl shadow-lg border border-border p-6 md:p-8 space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 pb-6 border-b border-border">
            {/* Editable Profile Picture */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
              <Image /*  Default picture for now  */
                src="/user.png"
                alt={`${formData.username || "User"}'s Profile`}
                width={128}
                height={128}
                priority
                className="rounded-full border-4 border-border object-cover aspect-square bg-muted"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 border-2 border-card"
                title="Change Picture (Not Implemented)"
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>
            {/* --- End of Editable Profile Picture --- */}

            {/* Basic User Details */}
            <div className="text-center sm:text-left flex-grow">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                {formData.username || "Username"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {formData.email || "email@example.com"}
              </p>
              <div className="flex justify-center sm:justify-start space-x-3 mt-2">
                {formData.github && (
                  <a
                    href={
                      formData.github.startsWith("http")
                        ? formData.github
                        : `https://${formData.github}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                    title="GitHub"
                  >
                    {/* TODO: change GitHib icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-1.5 6-6.5.08-1.3-.32-2.7-.94-4-.27-.8-.71-1.48-1.3-2.12-.28-.15-.56-.27-.84-.35-.42-.12-.85-.18-1.28-.18-1.1 0-2.1.48-3.1 1.32-.6.48-1 1.17-1.2 1.8-.15.3-.24.6-.3.9-.07.3-.1.6-.1.9-.1.6-.1 1.2 0 1.8.1.6.25 1.1.45 1.6.4.9.9 1.7 1.5 2.4.7.7 1.5 1.3 2.4 1.7.9.4 1.8.7 2.7.8.4.1.8.1 1.2.1H21m-6-6v4m-6 0v4m-6-4v4m6-12v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4m-6 0h6" />
                    </svg>
                  </a>
                )}
                {formData.linkedin && (
                  <a
                    href={
                      formData.linkedin.startsWith("http")
                        ? formData.linkedin
                        : `https://${formData.linkedin}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                    title="LinkedIn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
            {/* --- End of Basic User Details --- */}

            {/* Edit Profile Button */}
            <div className="mt-4 sm:mt-0 flex-shrink-0 self-center sm:self-start">
              {editProfileMode ? (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={handleSaveProfile}
                    className="bg-primary hover:bg-primary/70 text-primary-foreground"
                  >
                    <Check className="w-4 h-4 mr-1" /> Save Changes
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleCancelEdit}
                    className="bg-secondary hover:bg-secondary/70 text-secondary-foreground border border-border"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditProfileMode(true)}
                  className="bg-secondary hover:bg-secondary/70 text-secondary-foreground border border-border"
                >
                  <Edit3 className="w-4 h-4 mr-1" /> Edit Profile
                </Button>
              )}
            </div>
            {/* --- End of Edit Profile Button --- */}
          </div>
          {/* --- End of Profile Header --- */}

          {/* Profile Details Section */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Profile Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {[
                "username",
                "prn",
                "batch",
                "email",
                "mobile",
                "github",
                "linkedin",
              ].map((field) => (
                <div key={field} className="space-y-1.5">
                  <label
                    htmlFor={`profile-${field}`}
                    className="text-sm font-medium text-foreground"
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {["username", "prn", "batch", "mobile"].includes(field) && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </label>
                  <Input
                    id={`profile-${field}`}
                    type={
                      field === "email"
                        ? "email"
                        : field === "mobile"
                        ? "tel"
                        : field.includes("Link") ||
                          field === "github" ||
                          field === "linkedin"
                        ? "url"
                        : "text"
                    }
                    name={field}
                    value={formData[field as keyof FormData] || ""}
                    onChange={handleChange}
                    disabled={field === "email" || !editProfileMode}
                    placeholder={`Enter your ${field}`}
                    required={["username", "prn", "batch", "mobile"].includes(
                      field
                    )}
                    className={"h-auto font-medium bg-background text-foreground border border-border focus:ring-2 focus:ring-ring focus:outline-none p-2 disabled:opacity-80 disabled:cursor-default disabled:bg-transparent disabled:shadow-none disabled:text-muted-foreground focus-visible:ring-0".concat(
                      field !== "email" && !editProfileMode
                        ? " disabled:border-none disabled:p-0"
                        : " disabled:border-muted"
                    )}
                  />
                  {field === "email" && editProfileMode && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      Email cannot be changed.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* End of Profile Details Section */}

          {/* Skills and Badges Section */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Skills</h3>
              {!editProfileMode && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditProfileMode(true)}
                  className="bg-secondary hover:bg-secondary/70 text-secondary-foreground border border-border"
                >
                  {" "}
                  <Edit3 className="w-4 h-4 mr-1" /> Edit Skills
                </Button>
              )}
            </div>

            <div className="mb-4 border border-border rounded-md p-4 bg-muted">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Selected Skills:
              </h4>
              <div className="flex flex-wrap gap-2">
                {formData.skills?.length > 0 ? (
                  formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block bg-primary/20 text-primary rounded-full px-3 py-1 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    No skills selected.{" "}
                    {editProfileMode
                      ? "Select skills below."
                      : "Click 'Edit Profile' or 'Edit Skills' to add."}
                  </span>
                )}
              </div>
            </div>

            {editProfileMode && (
              <div className="space-y-2 max-h-96 overflow-y-auto rounded-md border border-border p-4 bg-background">
                <p className="text-sm text-muted-foreground mb-3">
                  Select the skills you possess:
                </p>
                {Object.entries(skillsCategories).map(([category, skills]) => (
                  <Accordion
                    key={category}
                    defaultExpanded={false}
                    className="!bg-card !text-foreground !shadow-none !border !border-border !rounded-md !before:hidden expanded:!my-2"
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon className="!text-muted-foreground" />
                      }
                      className="!min-h-[40px] [&.Mui-expanded]:!min-h-[40px]"
                    >
                      <Typography className="!text-sm !font-medium">
                        {category
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails className="!pt-0 !pb-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
                        {skills.map((skill) => (
                          <label
                            key={skill.id}
                            className="flex items-center space-x-2 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={!!skill.checked}
                              onChange={() =>
                                handleSkillToggle(category, skill.id)
                              }
                              className="form-checkbox h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary bg-background cursor-pointer"
                            />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground">
                              {skill.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </div>
            )}
          </div>

          <div className="w-full">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Badges
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {badges?.length > 0 ? (
                badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-3 bg-muted rounded-lg border border-border"
                    title={badge.description}
                  >
                    <span className="text-3xl mb-1">{badge.icon}</span>
                    <h4 className="text-xs font-semibold text-foreground">
                      {badge.name}
                    </h4>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm col-span-full text-center py-4">
                  No badges earned yet.
                </p>
              )}
            </div>
          </div>

          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                My Projects
              </h3>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/70 text-primary-foreground"
                onClick={handleNewProject}
              >
                {" "}
                <Plus className="w-4 h-4 mr-1" /> New Project{" "}
              </Button>
            </div>
            <div className="space-y-4">
              {projects?.length > 0 ? (
                projects.map((project) => (
                  <ProjectCard
                    key={project._id || project.title}
                    project={project}
                    availableUsers={availableUsers}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">
                  You haven&apos;t created or joined any projects yet.
                </p>
              )}
            </div>
          </div>
        </Card>
      </main>

      <AnimatePresence>
        {showProjectPopup && (
          <ProjectPopup
            userId={userId}
            onClose={() => setShowProjectPopup(false)}
            onAddProject={addProject}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
