"use client";

import { useState, useEffect, useCallback, RefObject } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Components
import { Card } from "@/components/ui/card";
import ProjectCard from "@/components/profile/ProjectCard";

import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

// Interfaces
import { UserData } from "@/interfaces/user";
import { Project } from "@/interfaces/project";

import {
  INITIAL_SKILLS_CATEGORIES,
  type SkillsCategories,
} from "@/constants/skills";

// --- Profile Page Component ---
export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [user, setUser] = useState<UserData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skillsCategories, setSkillsCategories] = useState<SkillsCategories>(
    () => JSON.parse(JSON.stringify(INITIAL_SKILLS_CATEGORIES))
  );
  const [isLoading, setIsLoading] = useState(true);

  const handleLike = async (projectId: string) => {
    try {
      const response = await axios.post(`/api/projects/${projectId}/like`);
      if (response.data.success) {
        toast.success(response.data.message);
        setProjects((prevProjects) =>
          prevProjects.map((p) =>
            p._id === projectId ? response.data.data : p
          )
        );
      } else {
        toast.error(response.data.error || "Failed to like project.");
      }
    } catch (error) {
      console.error("Error liking project:", error);
      toast.error("An error occurred while liking the project.");
    }
  };

  const handleComment = async (
    _projectId: string,
    _text: string,
    inputRef: RefObject<HTMLInputElement | null>
  ) => {
    // Note: Full implementation would involve an API call and state update
    if (inputRef?.current) {
      inputRef.current.value = "";
    }
    toast.success("Comment added (simulation).");
  };

  const emailToDisplay = user?.email || "";

  // --- Data Fetching Function ---
  const fetchProfileData = useCallback(
    async (signal: AbortSignal) => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [userRes, projectsRes] = await Promise.all([
          axios.get<{ data: UserData }>(`/api/users/user/${id}`, { signal }),
          axios.get<{ data: Project[] }>(`/api/projects/user/${id}`, { signal }),
        ]);

        const fetchedUser = userRes.data.data;
        if (!fetchedUser || !fetchedUser._id) {
          throw new Error("User data or ID missing.");
        }

        setUser(fetchedUser);
        updateSkillChecks(fetchedUser.skills || []);

        setProjects(projectsRes.data.data || []);
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
    [router, id]
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: 50, height: 50, border: "4px solid #3498db", borderTopColor: "transparent", borderRadius: "50%" }}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        User not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <Toaster position="bottom-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* --- Profile Header -- */}
        <Card className="p-6 mb-8 bg-card shadow-lg rounded-xl flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Image
              src={"/user.png"} // Fallback to a default image
              alt="Profile"
              width={150}
              height={150}
              className="rounded-full border-4 border-primary shadow-md"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-primary">{user.username}</h1>
            <p className="text-muted-foreground mt-1">{emailToDisplay}</p>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              {user.github && (
                <a
                  href={user.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              )}
              {user.linkedin && (
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </Card>

        {/* --- Main Content Grid -- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Left Column: Details & Skills -- */}
          <div className="lg:col-span-1 space-y-8">
            {/* --- User Details -- */}
            <Card className="p-6 bg-card shadow-lg rounded-xl">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Details</h2>
              <div className="space-y-3">
                <p><strong>PRN:</strong> {user.prn}</p>
                <p><strong>Batch:</strong> {user.batch}</p>
                <p><strong>Mobile:</strong> {user.mobile}</p>
              </div>
            </Card>

            {/* --- Skills Section -- */}
            <Card className="p-6 bg-card shadow-lg rounded-xl">
              <h2 className="text-2xl font-semibold mb-4 text-primary">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {Object.values(skillsCategories)
                  .flat()
                  .filter((skill) => skill.checked)
                  .map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center p-2 rounded-md bg-primary/20"
                    >
                      <span className="text-sm text-foreground">{skill.name}</span>
                    </div>
                  ))}
              </div>
            </Card>
          </div>

          {/* --- Right Column: Projects -- */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-card shadow-lg rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-primary">Projects</h2>
              </div>
              <AnimatePresence>
                {projects.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {projects.map((project, index) => (
                      <motion.div
                        key={project._id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="h-full"
                      >
                        <ProjectCard
                          project={project}
                          user={user}
                          handleLike={handleLike}
                          handleComment={handleComment}
                          router={router}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    This user hasn&apos;t added any projects yet.
                  </p>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}