"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ProjectPopup from "@/components/profile/ProjectPopup";
import ProjectCard from "@/components/profile/ProjectCard";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

// Interfaces
import { FormData, UserData, UserLookup } from "@/interfaces/user";
import { Project } from "@/interfaces/project";
import { ApiErrorResponse } from "@/interfaces/api";

// Icons
import { Plus, Edit3, Check } from "lucide-react";

import {
  INITIAL_SKILLS_CATEGORIES,
  type SkillsCategories,
} from "@/constants/skills";
import { INITIAL_BADGES } from "@/constants/badges";

import Navbar from "@/components/Navbar";

// --- Profile Page Component ---
export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    prn: "",
    batch: "",
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

  const emailToDisplay = originalData?.email || "";

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
        const currentFormData: FormData = {
          username: user.username || "",
          prn: user.prn || "",
          batch: user.batch || "",
          mobile: user.mobile || "",
          github: user.github || "",
          linkedin: user.linkedin || "",
          skills: user.skills || [],
        };
        setFormData(currentFormData);
        setOriginalData(user);
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
          ...updatePayload,
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
      const formDataToRestore: FormData = {
        username: originalData.username,
        prn: originalData.prn,
        batch: originalData.batch,
        mobile: originalData.mobile,
        github: originalData.github,
        linkedin: originalData.linkedin,
        skills: originalData.skills,
      };
      setFormData(formDataToRestore);
      updateSkillChecks(originalData.skills);
    } else {
      console.warn("Cannot cancel edit: Original data not available.");
    }
    setEditProfileMode(false);
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
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 bg-secondary rounded-full p-1 border border-button-border hover:bg-muted transition-colors"
              >
                <Edit3 className="w-5 h-5" />
              </motion.button>
            </div>
            {/* --- End of Editable Profile Picture --- */}

            {/* Basic User Details */}
            <div className="text-center sm:text-left flex-grow">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                {formData.username || "Username"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {originalData?.email || "email@example.com"}
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 50 50"
                      width="20"
                      height="20"
                      fill="currentColor"
                    >
                      <path d="M 25 2 C 12.311335 2 2 12.311335 2 25 C 2 37.688665 12.311335 48 25 48 C 37.688665 48 48 37.688665 48 25 C 48 12.311335 37.688665 2 25 2 z M 25 4 C 36.607335 4 46 13.392665 46 25 C 46 25.071371 45.994849 25.141688 45.994141 25.212891 C 45.354527 25.153853 44.615508 25.097776 43.675781 25.064453 C 42.347063 25.017336 40.672259 25.030987 38.773438 25.125 C 38.843852 24.634651 38.893205 24.137377 38.894531 23.626953 C 38.991361 21.754332 38.362521 20.002464 37.339844 18.455078 C 37.586913 17.601352 37.876747 16.515218 37.949219 15.283203 C 38.031819 13.878925 37.910599 12.321765 36.783203 11.269531 L 36.494141 11 L 36.099609 11 C 33.416539 11 31.580023 12.12321 30.457031 13.013672 C 28.835529 12.386022 27.01222 12 25 12 C 22.976367 12 21.135525 12.391416 19.447266 13.017578 C 18.324911 12.126691 16.486785 11 13.800781 11 L 13.408203 11 L 13.119141 11.267578 C 12.020956 12.287321 11.919778 13.801759 11.988281 15.199219 C 12.048691 16.431506 12.321732 17.552142 12.564453 18.447266 C 11.524489 20.02486 10.900391 21.822018 10.900391 23.599609 C 10.900391 24.111237 10.947969 24.610071 11.017578 25.101562 C 9.2118173 25.017808 7.6020996 25.001668 6.3242188 25.046875 C 5.3845143 25.080118 4.6454422 25.135713 4.0058594 25.195312 C 4.0052628 25.129972 4 25.065482 4 25 C 4 13.392665 13.392665 4 25 4 z M 14.396484 13.130859 C 16.414067 13.322043 17.931995 14.222972 18.634766 14.847656 L 19.103516 15.261719 L 19.681641 15.025391 C 21.263092 14.374205 23.026984 14 25 14 C 26.973016 14 28.737393 14.376076 30.199219 15.015625 L 30.785156 15.273438 L 31.263672 14.847656 C 31.966683 14.222758 33.487184 13.321554 35.505859 13.130859 C 35.774256 13.575841 36.007486 14.208668 35.951172 15.166016 C 35.883772 16.311737 35.577304 17.559658 35.345703 18.300781 L 35.195312 18.783203 L 35.494141 19.191406 C 36.483616 20.540691 36.988121 22.000937 36.902344 23.544922 L 36.900391 23.572266 L 36.900391 23.599609 C 36.900391 26.095064 36.00178 28.092339 34.087891 29.572266 C 32.174048 31.052199 29.152663 32 24.900391 32 C 20.648118 32 17.624827 31.052192 15.710938 29.572266 C 13.797047 28.092339 12.900391 26.095064 12.900391 23.599609 C 12.900391 22.134903 13.429308 20.523599 14.40625 19.191406 L 14.699219 18.792969 L 14.558594 18.318359 C 14.326866 17.530484 14.042825 16.254103 13.986328 15.101562 C 13.939338 14.14294 14.166221 13.537027 14.396484 13.130859 z M 8.8847656 26.021484 C 9.5914575 26.03051 10.40146 26.068656 11.212891 26.109375 C 11.290419 26.421172 11.378822 26.727898 11.486328 27.027344 C 8.178972 27.097092 5.7047309 27.429674 4.1796875 27.714844 C 4.1152068 27.214494 4.0638483 26.710021 4.0351562 26.199219 C 5.1622058 26.092262 6.7509972 25.994233 8.8847656 26.021484 z M 41.115234 26.037109 C 43.247527 26.010033 44.835728 26.108156 45.962891 26.214844 C 45.934234 26.718328 45.883749 27.215664 45.820312 27.708984 C 44.24077 27.41921 41.699674 27.086688 38.306641 27.033203 C 38.411945 26.739677 38.499627 26.438219 38.576172 26.132812 C 39.471291 26.084833 40.344564 26.046896 41.115234 26.037109 z M 11.912109 28.019531 C 12.508849 29.215327 13.361516 30.283019 14.488281 31.154297 C 16.028825 32.345531 18.031623 33.177838 20.476562 33.623047 C 20.156699 33.951698 19.86578 34.312595 19.607422 34.693359 L 19.546875 34.640625 C 19.552375 34.634325 19.04975 34.885878 18.298828 34.953125 C 17.547906 35.020374 16.621615 35 15.800781 35 C 14.575781 35 14.03621 34.42121 13.173828 33.367188 C 12.696283 32.72356 12.114101 32.202331 11.548828 31.806641 C 10.970021 31.401475 10.476259 31.115509 9.8652344 31.013672 L 9.7832031 31 L 9.6992188 31 C 9.2325521 31 8.7809835 31.03379 8.359375 31.515625 C 8.1485707 31.756544 8.003277 32.202561 8.0976562 32.580078 C 8.1920352 32.957595 8.4308563 33.189581 8.6445312 33.332031 C 10.011254 34.24318 10.252795 36.046511 11.109375 37.650391 C 11.909298 39.244315 13.635662 40 15.400391 40 L 18 40 L 18 44.802734 C 10.967811 42.320535 5.6646795 36.204613 4.3320312 28.703125 C 5.8629338 28.414776 8.4265387 28.068108 11.912109 28.019531 z M 37.882812 28.027344 C 41.445538 28.05784 44.08105 28.404061 45.669922 28.697266 C 44.339047 36.201504 39.034072 42.31987 32 44.802734 L 32 39.599609 C 32 38.015041 31.479642 36.267712 30.574219 34.810547 C 30.299322 34.368135 29.975945 33.949736 29.615234 33.574219 C 31.930453 33.11684 33.832364 32.298821 35.3125 31.154297 C 36.436824 30.284907 37.287588 29.220424 37.882812 28.027344 z M 23.699219 34.099609 L 26.5 34.099609 C 27.312821 34.099609 28.180423 34.7474 28.875 35.865234 C 29.569577 36.983069 30 38.484177 30 39.599609 L 30 45.398438 C 28.397408 45.789234 26.72379 46 25 46 C 23.27621 46 21.602592 45.789234 20 45.398438 L 20 39.599609 C 20 38.508869 20.467828 37.011307 21.208984 35.888672 C 21.950141 34.766037 22.886398 34.099609 23.699219 34.099609 z M 12.308594 35.28125 C 13.174368 36.179258 14.222525 37 15.800781 37 C 16.579948 37 17.552484 37.028073 18.476562 36.945312 C 18.479848 36.945018 18.483042 36.943654 18.486328 36.943359 C 18.36458 37.293361 18.273744 37.645529 18.197266 38 L 15.400391 38 C 14.167057 38 13.29577 37.55443 12.894531 36.751953 L 12.886719 36.738281 L 12.880859 36.726562 C 12.716457 36.421191 12.500645 35.81059 12.308594 35.28125 z" />
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
                      strokeWidth="1"
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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Check className="w-4 h-4 mr-1" /> Save Changes
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleCancelEdit}
                    className="bg-secondary hover:bg-destructive text-secondary-foreground hover:text-white border border-button-border"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditProfileMode(true)}
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-button-border"
                >
                  <Edit3 className="w-4 h-4 mr-1" /> Edit Profile
                </Button>
              )}
            </div>
            {/* --- End of Edit Profile Button --- */}
          </div>
          {/* --- End of Profile Header --- */}

          {/* Profile Details Form Section */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Profile Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {["username", "prn", "batch", "mobile", "github", "linkedin"].map(
                (field) => (
                  <div key={field} className="space-y-1.5">
                    <label
                      htmlFor={`profile-${field}`}
                      className="text-sm font-medium text-foreground"
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      {["username", "prn", "batch", "mobile"].includes(
                        field
                      ) && <span className="text-destructive ml-1">*</span>}
                    </label>
                    <Input
                      id={`profile-${field}`}
                      type={
                        field === "mobile"
                          ? "tel"
                          : field.includes("Link") ||
                            field === "github" ||
                            field === "linkedin"
                          ? "url"
                          : "text"
                      }
                      name={field}
                      value={
                        formData[
                          field as keyof Omit<FormData, "skills" | "email">
                        ] || ""
                      }
                      onChange={handleChange}
                      disabled={!editProfileMode}
                      placeholder={`Enter your ${field}`}
                      required={["username", "prn", "batch", "mobile"].includes(
                        field
                      )}
                      className={"h-auto font-medium bg-input text-foreground border border-border focus:ring-2 focus:ring-ring focus:outline-none p-2 disabled:opacity-80 disabled:cursor-default disabled:bg-transparent disabled:shadow-none disabled:text-muted-foreground focus-visible:ring-0".concat(
                        field !== "email" && !editProfileMode
                          ? " disabled:border-none disabled:p-0"
                          : " disabled:border-muted"
                      )}
                    />
                  </div>
                )
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="profile-email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <Input
                  id="profile-email"
                  type="email"
                  name="email"
                  value={emailToDisplay}
                  disabled
                  placeholder="Email address"
                  className="h-auto font-medium bg-transparent text-muted-foreground border-none p-0 disabled:opacity-80 disabled:cursor-default disabled:shadow-none"
                />
                <p className="text-xs text-muted-foreground/80 mt-1 italic">
                  Email cannot be changed.
                </p>
              </div>
            </div>
          </div>
          {/* End of Profile Details Form Section */}

          {/* Skills Section */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Skills</h3>
              {!editProfileMode ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditProfileMode(true)}
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-button-border"
                >
                  {" "}
                  <Edit3 className="w-4 h-4 mr-1" /> Edit Skills
                </Button>
              ) : (
                <p className="italic text-muted-foreground text-xs ">
                  Scroll up to save or cancel changes.
                </p>
              )}
            </div>

            <div className="mb-4 border border-border rounded-md p-4 bg-input">
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
                      : "Click 'Edit Skills' to add."}
                  </span>
                )}
              </div>
            </div>

            {editProfileMode && (
              <div className="space-y-2 max-h-96 overflow-y-auto rounded-md border border-border p-4 pt-0 bg-input">
                <p className="text-sm text-muted-foreground sticky top-0 bg-input z-10 pt-4 pb-2 border-b-2 border-border">
                  Select the skills you possess:
                </p>
                {Object.entries(skillsCategories).map(([category, skills]) => (
                  <Accordion
                    key={category}
                    defaultExpanded={false}
                    className="!bg-card  !text-foreground !shadow-none !border !border-border !rounded-md !before:hidden expanded:!my-2"
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
          {/* --- End of Skills Section --- */}

          {/* Badges Section */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Badges
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {INITIAL_BADGES?.length > 0 ? (
                INITIAL_BADGES.map((badge, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center text-center p-5 bg-muted rounded-lg border border-border"
                    transition={{ duration: 0.2 }}
                    whileHover={{
                      scale: 1.05,
                      cursor: "pointer",
                      border: "1px solid hsl(var(--primary))",
                    }}
                  >
                    <span className="text-3xl mb-1">{badge.icon}</span>
                    <motion.h4
                      className="text-xs font-semibold text-foreground mt-2"
                      whileHover={{ cursor: "text" }}
                    >
                      {badge.name}
                    </motion.h4>
                    <motion.h5
                      className="text-xs font-medium text-muted-foreground mt-2"
                      whileHover={{ cursor: "text" }}
                    >
                      {badge.description}
                    </motion.h5>
                  </motion.div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm col-span-full text-center py-4">
                  No badges earned yet.
                </p>
              )}
            </div>
          </div>
          {/* --- End of Badges Section --- */}

          {/* Projects Section */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                My Projects
              </h3>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleNewProject}
              >
                <Plus className="w-4 h-4 mr-1" /> New Project
              </Button>
            </div>

            <div className="space-y-4">
              {projects?.length > 0 ? (
                projects.map((project) => (
                  <ProjectCard
                    key={project._id || project.title}
                    project={project}
                    availableUsers={availableUsers}
                    creatorUsername="formData.username"
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">
                  You haven&apos;t created or joined any projects yet.
                </p>
              )}
            </div>
          </div>
          {/* --- End of Projects Section --- */}
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
