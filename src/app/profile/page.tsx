"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Plus, UserCircle, X, Bell } from "lucide-react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import userImage from "@/public/user.png";

interface Project {
  _id?: string;
  title: string;
  description: string;
  techStack: string[];
  repoLink: string;
  liveLink: string;
  createdBy: string;
  teamMembers: string[];
  lookingForMembers: boolean;
  status: "active" | "completed";
}

interface Skill {
  id: string;
  name: string;
  checked: boolean;
}

interface SkillsCategories {
  [key: string]: Skill[];
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

interface Badge {
  name: string;
  description: string;
  icon: string;
}

interface User {
  _id: string;
  username: string;
}

interface Notification {
  _id: string;
  message: string;
  link: string;
  read: boolean;
}

const ProjectPopup = ({
  onClose,
  onAddProject,
}: {
  onClose: () => void;
  onAddProject: (project: Project) => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [lookingForMembers, setLookingForMembers] = useState(false);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setAvailableUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = availableUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }
    const projectData: Project = {
      title,
      description,
      techStack: techStack.split(",").map((item) => item.trim()).filter(Boolean),
      repoLink,
      liveLink,
      createdBy: "authenticatedUser", // Replaced by API
      lookingForMembers,
      teamMembers,
      status: "active",
    };
    try {
      await onAddProject(projectData);
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    }
  };

  const toggleTeamMember = (userId: string) => {
    setTeamMembers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
    >
      <motion.div
        className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-2xl shadow-2xl w-full max-w-md border border-blue-200 dark:border-gray-700"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-indigo-900 dark:text-white">Create a New Project</h2>
          <motion.button
            onClick={onClose}
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
              placeholder="Enter project title"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white h-20 resize-none"
              placeholder="Describe your project"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., React, Node.js, MongoDB"
            />
          </div>
          <div className="flex space-x-3">
            <div className="w-1/2 space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Repo Link</label>
              <input
                type="url"
                value={repoLink}
                onChange={(e) => setRepoLink(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="GitHub link"
              />
            </div>
            <div className="w-1/2 space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Live Link</label>
              <input
                type="url"
                value={liveLink}
                onChange={(e) => setLiveLink(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
                placeholder="Live demo link"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="flex items-center text-xs text-gray-700 dark:text-gray-200">
              <input
                type="checkbox"
                checked={lookingForMembers}
                onChange={(e) => setLookingForMembers(e.target.checked)}
                className="mr-2 accent-blue-500 dark:accent-blue-400 rounded"
              />
              Looking for Members
            </label>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-200">Add Team Members</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
              placeholder="Search users by username"
            />
            <div className="max-h-40 overflow-y-auto mt-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <label key={user._id} className="flex items-center space-x-2 p-1">
                    <input
                      type="checkbox"
                      checked={teamMembers.includes(user._id)}
                      onChange={() => toggleTeamMember(user._id)}
                      className="accent-blue-500 dark:accent-blue-400"
                    />
                    <span className="text-gray-700 dark:text-gray-200">{user.username}</span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No users found</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1.5 bg-gray-200 dark:bg-gray-600 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-400 to-cyan-700 dark:from-cyan-500 dark:to-cyan-800 text-white rounded-xl hover:bg-cyan-600 dark:hover:bg-cyan-700"
            >
              Create Project
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default function Page() {
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjectPopup, setShowProjectPopup] = useState(false);
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [skillsCategories, setSkillsCategories] = useState<SkillsCategories>({
    programmingLanguages: [
      { id: "c", name: "C", checked: false },
      { id: "cpp", name: "C++", checked: false },
      { id: "csharp", name: "C#", checked: false },
      { id: "go", name: "Go", checked: false },
      { id: "java", name: "Java", checked: false },
      { id: "js", name: "JS", checked: false },
      { id: "ts", name: "TS", checked: false },
      { id: "php", name: "PHP", checked: false },
      { id: "python", name: "Python", checked: false },
      { id: "ruby", name: "Ruby", checked: false },
      { id: "rust", name: "Rust", checked: false },
      { id: "scala", name: "Scala", checked: false },
      { id: "kotlin", name: "Kotlin", checked: false },
      { id: "erlang", name: "Erlang", checked: false },
      { id: "coffeescript", name: "CoffeeScript", checked: false },
      { id: "elixir", name: "Elixir", checked: false },
      { id: "dart", name: "Dart", checked: false },
      { id: "r", name: "R", checked: false },
      { id: "swift", name: "Swift", checked: false },
      { id: "objectivec", name: "Objective-C", checked: false },
      { id: "perl", name: "Perl", checked: false },
    ],
    frontendDevelopment: [
      { id: "vue", name: "Vue.js", checked: false },
      { id: "react", name: "React", checked: false },
      { id: "svelte", name: "Svelte", checked: false },
      { id: "angular", name: "Angular", checked: false },
      { id: "ember", name: "Ember", checked: false },
      { id: "backbone", name: "Backbone", checked: false },
      { id: "bootstrap", name: "Bootstrap", checked: false },
      { id: "css", name: "CSS", checked: false },
      { id: "html", name: "HTML", checked: false },
      { id: "pug", name: "Pug", checked: false },
      { id: "sass", name: "Sass", checked: false },
      { id: "less", name: "Less", checked: false },
      { id: "webcomponents", name: "Web Components", checked: false },
      { id: "babel", name: "Babel", checked: false },
      { id: "qt", name: "Qt", checked: false },
      { id: "d3", name: "D3.js", checked: false },
      { id: "lit", name: "Lit", checked: false },
      { id: "preact", name: "Preact", checked: false },
      { id: "stencil", name: "Stencil", checked: false },
      { id: "materialui", name: "Material-UI", checked: false },
      { id: "tailwindcss", name: "Tailwind CSS", checked: false },
      { id: "bulma", name: "Bulma", checked: false },
      { id: "foundation", name: "Foundation", checked: false },
    ],
    backendDevelopment: [
      { id: "node", name: "Node.js", checked: false },
      { id: "express", name: "Express", checked: false },
      { id: "nestjs", name: "NestJS", checked: false },
      { id: "django", name: "Django", checked: false },
      { id: "flask", name: "Flask", checked: false },
      { id: "laravel", name: "Laravel", checked: false },
      { id: "rails", name: "Ruby on Rails", checked: false },
      { id: "spring", name: "Spring Boot", checked: false },
      { id: "fastapi", name: "FastAPI", checked: false },
      { id: "asp", name: "ASP.NET", checked: false },
      { id: "grails", name: "Grails", checked: false },
    ],
    mobileAppDevelopment: [
      { id: "android", name: "Android", checked: false },
      { id: "ios", name: "iOS", checked: false },
      { id: "flutter", name: "Flutter", checked: false },
      { id: "reactnative", name: "React Native", checked: false },
      { id: "xamarin", name: "Xamarin", checked: false },
      { id: "ionic", name: "Ionic", checked: false },
      {
        id: "kotlinmultiplatform",
        name: "Kotlin Multiplatform",
        checked: false,
      },
      { id: "capacitor", name: "Capacitor", checked: false },
      { id: "cordova", name: "Cordova", checked: false },
    ],
    aiml: [
      { id: "tensorflow", name: "TensorFlow", checked: false },
      { id: "pytorch", name: "PyTorch", checked: false },
      { id: "scikitlearn", name: "Scikit-learn", checked: false },
      { id: "keras", name: "Keras", checked: false },
      { id: "opencv", name: "OpenCV", checked: false },
      { id: "huggingface", name: "Hugging Face", checked: false },
    ],
    database: [
      { id: "mongodb", name: "MongoDB", checked: false },
      { id: "postgresql", name: "PostgreSQL", checked: false },
      { id: "mysql", name: "MySQL", checked: false },
      { id: "sqlite", name: "SQLite", checked: false },
      { id: "redis", name: "Redis", checked: false },
      { id: "cassandra", name: "Cassandra", checked: false },
      { id: "dynamodb", name: "DynamoDB", checked: false },
      { id: "firebase", name: "Firebase", checked: false },
      { id: "elasticsearch", name: "Elasticsearch", checked: false },
      { id: "mariadb", name: "MariaDB", checked: false },
      { id: "couchdb", name: "CouchDB", checked: false },
      { id: "cockroachdb", name: "CockroachDB", checked: false },
      { id: "neo4j", name: "Neo4j", checked: false },
      { id: "oracle", name: "Oracle", checked: false },
    ],
    dataVisualization: [
      { id: "chartjs", name: "Chart.js", checked: false },
      { id: "d3viz", name: "D3.js", checked: false },
      { id: "tableau", name: "Tableau", checked: false },
      { id: "powerbi", name: "Power BI", checked: false },
      { id: "apacheairflow", name: "Apache Airflow", checked: false },
    ],
    devops: [
      { id: "kubernetes", name: "Kubernetes", checked: false },
      { id: "docker", name: "Docker", checked: false },
      { id: "jenkins", name: "Jenkins", checked: false },
      { id: "ansible", name: "Ansible", checked: false },
      { id: "terraform", name: "Terraform", checked: false },
      { id: "aws", name: "AWS", checked: false },
      { id: "gcp", name: "Google Cloud", checked: false },
      { id: "azure", name: "Azure", checked: false },
      { id: "heroku", name: "Heroku", checked: false },
      { id: "netlify", name: "Netlify", checked: false },
    ],
    baas: [
      { id: "firebasebaas", name: "Firebase", checked: false },
      { id: "supabase", name: "Supabase", checked: false },
      { id: "hasura", name: "Hasura", checked: false },
      { id: "parse", name: "Parse", checked: false },
    ],
    framework: [
      { id: "adonisjs", name: "AdonisJS", checked: false },
      { id: "codeigniter", name: "CodeIgniter", checked: false },
      { id: "cakephp", name: "CakePHP", checked: false },
      { id: "phalcon", name: "Phalcon", checked: false },
      { id: "dotnet", name: ".NET", checked: false },
      { id: "spring", name: "Spring", checked: false },
      { id: "play", name: "Play Framework", checked: false },
      { id: "sails", name: "Sails.js", checked: false },
      { id: "hapi", name: "Hapi.js", checked: false },
    ],
    testing: [
      { id: "cypress", name: "Cypress", checked: false },
      { id: "selenium", name: "Selenium", checked: false },
      { id: "jest", name: "Jest", checked: false },
      { id: "mocha", name: "Mocha", checked: false },
      { id: "jasmine", name: "Jasmine", checked: false },
      { id: "playwright", name: "Playwright", checked: false },
    ],
    software: [
      { id: "photoshop", name: "Photoshop", checked: false },
      { id: "illustrator", name: "Illustrator", checked: false },
      { id: "xd", name: "Adobe XD", checked: false },
      { id: "figma", name: "Figma", checked: false },
      { id: "blender", name: "Blender", checked: false },
      { id: "unity", name: "Unity", checked: false },
      { id: "unreal", name: "Unreal Engine", checked: false },
      { id: "maya", name: "Maya", checked: false },
      { id: "3dsmax", name: "3ds Max", checked: false },
      { id: "aftereffects", name: "After Effects", checked: false },
    ],
    staticSiteGenerators: [
      { id: "gatsby", name: "Gatsby", checked: false },
      { id: "gridsome", name: "Gridsome", checked: false },
      { id: "hugo", name: "Hugo", checked: false },
      { id: "nextjs", name: "Next.js", checked: false },
      { id: "nuxtjs", name: "Nuxt.js", checked: false },
      { id: "eleventy", name: "Eleventy", checked: false },
      { id: "jekyll", name: "Jekyll", checked: false },
      { id: "hexo", name: "Hexo", checked: false },
      { id: "middleman", name: "Middleman", checked: false },
      { id: "scully", name: "Scully", checked: false },
      { id: "vuepress", name: "VuePress", checked: false },
      { id: "docusaurus", name: "Docusaurus", checked: false },
      { id: "zola", name: "Zola", checked: false },
    ],
    gameEngines: [
      { id: "unity", name: "Unity", checked: false },
      { id: "unreal", name: "Unreal Engine", checked: false },
    ],
    automation: [
      { id: "ifttt", name: "IFTTT", checked: false },
      { id: "zapier", name: "Zapier", checked: false },
    ],
    other: [
      { id: "linux", name: "Linux", checked: false },
      { id: "git", name: "Git", checked: false },
      { id: "npm", name: "NPM", checked: false },
    ],
  });

  const badges: Badge[] = [
    { name: "Top Contributor", description: "Awarded for being in the top 10 on the leaderboard.", icon: "🏆" },
    // ... other badges ...
  ];

  useEffect(() => {
    fetchUserData();
    fetchProjects();
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/users/me");
      const user = response.data.data;
      setFormData({
        username: user.username || "",
        prn: user.prn || "",
        batch: user.batch || "",
        email: user.email || "",
        mobile: user.mobile || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        skills: user.skills || [],
      });
      updateSkillChecks(user.skills || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data.");
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("/api/projects");
      setProjects(response.data.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects.");
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications");
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to fetch notifications.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setAvailableUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notif) => (notif._id === notificationId ? { ...notif, read: true } : notif))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to update notification.");
    }
  };

  const updateSkillChecks = (savedSkills: string[]) => {
    const updatedSkills: SkillsCategories = { ...skillsCategories };
    Object.keys(updatedSkills).forEach((category) => {
      updatedSkills[category] = updatedSkills[category].map((skill) => ({
        ...skill,
        checked: savedSkills.includes(skill.name),
      }));
    });
    setSkillsCategories(updatedSkills);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillToggle = (category: string, skillId: string) => {
    const updatedSkills = { ...skillsCategories };
    updatedSkills[category] = updatedSkills[category].map((skill) =>
      skill.id === skillId ? { ...skill, checked: !skill.checked } : skill
    );
    setSkillsCategories(updatedSkills);

    const selectedSkills: string[] = [];
    Object.values(updatedSkills).forEach((categorySkills) =>
      categorySkills.forEach((skill) => skill.checked && skill.name && selectedSkills.push(skill.name))
    );
    setFormData((prev) => ({ ...prev, skills: selectedSkills }));
  };

  const handleSaveProfile = async () => {
    try {
      if (!formData.username || !formData.prn || !formData.batch || !formData.mobile) {
        toast.error("Please fill all required fields");
        return;
      }
      const response = await axios.put("/api/users/update", {
        username: formData.username,
        prn: formData.prn,
        batch: formData.batch,
        mobile: formData.mobile,
        github: formData.github,
        linkedin: formData.linkedin,
        skills: formData.skills,
        profileComplete: true,
      });
      setEditProfileMode(false);
      toast.success("Profile and skills updated successfully!");
    } catch (error: any) {
      console.error("Error saving profile:", error.response?.data);
      toast.error(error.response?.data?.error || "Failed to save profile and skills");
    }
  };

  const onLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful!");
      router.push("/signin");
    } catch (error) {
      console.error("Logout Failed:", error);
      toast.error("Logout failed.");
    }
  };

  const handleNewProject = () => {
    setShowProjectPopup(true);
  };

  const addProject = async (projectData: Project) => {
    try {
      const response = await axios.post("/api/projects/create", projectData);
      setProjects((prevProjects) => [...prevProjects, response.data.data]);
      toast.success("Project created successfully!");
    } catch (error) {
      console.error("Error adding project:", error);
      throw error;
    }
  };

  const ProjectCard = ({ project, availableUsers }: { project: Project; availableUsers: User[] }) => (
    <motion.div
      className="p-6 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-700 dark:to-blue-900 rounded-lg shadow-md border border-blue-200 dark:border-blue-800"
    >
      <h4 className="text-xl font-semibold text-indigo-900 dark:text-white mb-2">{project.title}</h4>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
      <div className="mb-4">
        <h5 className="text-md font-medium text-indigo-800 dark:text-blue-200 mb-2">Tech Stack:</h5>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((skill, index) => (
            <span
              key={index}
              className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-800 dark:text-gray-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h5 className="text-md font-medium text-indigo-800 dark:text-blue-200 mb-2">Team Members:</h5>
        <div className="flex flex-wrap gap-2">
          {project.teamMembers.map((memberId, index) => {
            const member = availableUsers.find((user: User) => user._id === memberId);
            return (
              <span
                key={index}
                className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-800 dark:text-gray-200"
              >
                {member ? member.username : "Unknown"}
              </span>
            );
          })}
        </div>
      </div>
      <div className="mb-4">
        <h5 className="text-md font-medium text-indigo-800 dark:text-blue-200 mb-2">Links:</h5>
        <a
          href={project.repoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 dark:text-blue-400 hover:underline mr-4"
        >
          Repo
        </a>
        <a
          href={project.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 dark:text-blue-400 hover:underline"
        >
          Live
        </a>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Status: {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-card dark:to-muted">
      <nav className="w-full bg-gradient-to-r from-blue-50 via-blue-200 to-blue-50 dark:from-card dark:via-muted dark:to-card shadow-lg p-4 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-900 dark:text-white">SynKro</h1>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700"
            >
              ← Back
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700"
            >
              Logout ↩
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 pt-20">
        <Card className="w-full max-w-4xl p-8 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl border border-blue-200 dark:border-gray-700">
          <CardContent className="flex flex-col items-center space-y-8">
            <div className="relative w-40 h-40 border-4 border-gradient-to-r from-cyan-400 to-blue-500 dark:from-cyan-500 dark:to-blue-700 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
              <Image
                src="/"
                alt="Profile"
                width={160}
                height={160}
                className="rounded-full"
              />
              <Button
                size="sm"
                className="absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 bg-gradient-to-r from-cyan-400 to-cyan-700 dark:from-cyan-500 dark:to-cyan-800 text-white rounded-full p-2 shadow-md"
              >
                <UserCircle className="w-5 h-5" />
              </Button>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-indigo-900 dark:text-white">Notifications</h3>
              </div>
              <div className="space-y-2">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <motion.div
                      key={notif._id}
                      className={`p-3 rounded-lg flex justify-between items-center ${
                        notif.read ? "bg-gray-100 dark:bg-gray-700" : "bg-blue-100 dark:bg-blue-800"
                      }`}
                      onClick={() => markNotificationAsRead(notif._id)}
                    >
                      <div>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{notif.message}</p>
                        {notif.link && (
                          <a
                            href={notif.link}
                            className="text-xs text-blue-500 dark:text-blue-400 hover:underline"
                          >
                            View
                          </a>
                        )}
                      </div>
                      {!notif.read && (
                        <span className="text-xs text-blue-500 dark:text-blue-400">New</span>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No notifications</p>
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-indigo-900 dark:text-white">Profile Details</h3>
                <div>
                  {editProfileMode ? (
                    <>
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        className="bg-gradient-to-r from-cyan-400 to-cyan-700 dark:from-cyan-500 dark:to-cyan-800 text-white rounded-full p-2 shadow-md mr-2"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setEditProfileMode(false)}
                        className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full p-2 shadow-md"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => setEditProfileMode(true)}
                      className="bg-gradient-to-r from-cyan-400 to-cyan-700 dark:from-cyan-500 dark:to-cyan-800 text-white rounded-full p-2 shadow-md"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["username", "prn", "batch", "email", "mobile", "github", "linkedin"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                      {field.toUpperCase()}
                    </label>
                    <Input
                      type={field === "email" ? "email" : field === "mobile" ? "tel" : "text"}
                      name={field}
                      value={formData[field as keyof FormData]}
                      onChange={handleChange}
                      disabled={field === "email" || !editProfileMode}
                      placeholder={`Enter ${field}`}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-indigo-900 dark:text-white">Skills</h3>
                <Button
                  size="sm"
                  onClick={() => setEditProfileMode(true)}
                  className="bg-gradient-to-r from-cyan-400 to-cyan-700 dark:from-cyan-500 dark:to-cyan-800 text-white rounded-full p-2 shadow-md"
                >
                  Edit Skills
                </Button>
              </div>
              {editProfileMode && (
                <div className="mt-4 space-y-3">
                  {Object.keys(skillsCategories).map((category, index) => (
                    <Accordion key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md">
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{category.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                          {skillsCategories[category].map((skill) => (
                            <label key={skill.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={skill.checked}
                                onChange={() => handleSkillToggle(category, skill.id)}
                                className="form-checkbox accent-blue-500 dark:accent-blue-400"
                              />
                              <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                            </label>
                          ))}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <h4 className="text-lg font-medium text-indigo-900 dark:text-white">Selected Skills:</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.length > 0 ? (
                    formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gradient-to-r from-blue-200 to-blue-300 dark:from-blue-600 dark:to-blue-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-800 dark:text-gray-200"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-600 dark:text-gray-400">No skills selected</span>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full">
              <h3 className="text-xl font-semibold text-indigo-900 dark:text-white mb-4">Badges</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-700 dark:to-blue-900 rounded-lg shadow-md border border-blue-200 dark:border-blue-800"
                  >
                    <span className="text-3xl mr-3">{badge.icon}</span>
                    <div>
                      <h4 className="text-md font-semibold text-indigo-900 dark:text-white">{badge.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full">
              <h3 className="text-xl font-semibold text-indigo-900 dark:text-white mb-4">Projects</h3>
              <div className="space-y-6">
                {projects.map((project, index) => (
                  <ProjectCard key={index} project={project} availableUsers={availableUsers} />
                ))}
              </div>
            </div>

            <div className="w-full flex justify-center">
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-cyan-700 dark:from-cyan-500 dark:to-cyan-800 text-white py-3 px-8 rounded-xl text-lg"
                onClick={handleNewProject}
              >
                <Plus className="w-6 h-6" />
                New
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {showProjectPopup && <ProjectPopup onClose={() => setShowProjectPopup(false)} onAddProject={addProject} />}
    </div>
  );
}