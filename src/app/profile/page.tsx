"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Plus, UserCircle } from "lucide-react";

// ProjectPopup Component
const ProjectPopup = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [lookingForMembers, setLookingForMembers] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = {
      title,
      description,
      techStack: techStack.split(",").map(item => item.trim()),
      repoLink,
      liveLink,
      createdBy: "userIdHere",
      lookingForMembers,
    };
    console.log("Project Data:", projectData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-2xl w-96 transform transition-all duration-300 hover:shadow-3xl border border-blue-200">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-800">Create New Project</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-50 h-16"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-50"
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Repo Link</label>
              <input
                type="url"
                value={repoLink}
                onChange={(e) => setRepoLink(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Live Link</label>
              <input
                type="url"
                value={liveLink}
                onChange={(e) => setLiveLink(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="checkbox"
                checked={lookingForMembers}
                onChange={(e) => setLookingForMembers(e.target.checked)}
                className="mr-2 accent-blue-500"
              />
              Looking for Members
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    prn: "",
    batch: "",
    email: "",
    mobile: "",
    github: "",
    linkedin: "",
    others: "",
    skills: [] as string[],
  });
  const [showProjectPopup, setShowProjectPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, ""] });
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const onLogout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      console.log("Logout success", response.data);
      router.push("/signin");
    } catch (error: any) {
      console.log("Logout Failed", error);
      toast.error(error.response?.data?.message || error.message || "Logout failed");
    }
  };

  const handleNewProject = () => {
    setShowProjectPopup(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Navbar */}
      <nav className="w-full bg-gray-200 shadow-md p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-black">SynKro</h1>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              ← Back
            </Button>
            <Button variant="outline" onClick={onLogout}>
              Logout ↩
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 transform transition-all hover:scale-105">
          <CardContent className="flex flex-col items-center space-y-8">
            {/* Profile Picture */}
            <div className="relative w-40 h-40 border-4 border-gray-300 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center animate-pulse-slow">
              <Image src="/profile-placeholder.png" alt="Profile" width={160} height={160} className="rounded-full" />
              <Button
                size="sm"
                className="mt-2 bg-gray-800 text-white hover:bg-gray-700 transition-colors absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 rounded-full p-2 shadow-md"
              >
                <UserCircle className="w-5 h-5" />
              </Button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
              {["name", "prn", "batch", "email", "mobile", "github", "linkedin", "others"].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="text-gray-600 text-sm font-medium">{field.toUpperCase()}</label>
                  <Input
                    type="text"
                    name={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder={`Enter ${field}`}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400 transition-all hover:border-blue-300"
                  />
                </div>
              ))}
            </div>

            {/* Skills Section */}
            <div className="w-full mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
                <Button
                  size="sm"
                  onClick={handleAddSkill}
                  className="bg-gray-800 text-white hover:bg-gray-700 transition-colors rounded-full p-2 shadow-md"
                >
                  + Add Skill
                </Button>
              </div>
              <div className="mt-4 space-y-3">
                {formData.skills.map((skill, index) => (
                  <Input
                    key={index}
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    placeholder="Enter skill"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400 transition-all hover:border-blue-300"
                  />
                ))}
              </div>
            </div>

            {/* New Project Button */}
            <div className="w-full mt-8 flex justify-center">
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-600 text-white py-3 px-8 rounded-xl text-lg hover:from-gray-700 hover:to-gray-500 transition-all shadow-lg transform hover:scale-105"
                onClick={handleNewProject}
              >
                <Plus className="w-6 h-6" />
                New
              </Button>
            </div>
          </CardContent>
        </Card>

        {showProjectPopup && <ProjectPopup onClose={() => setShowProjectPopup(false)} />}
      </main>
    </div>
  );
}
