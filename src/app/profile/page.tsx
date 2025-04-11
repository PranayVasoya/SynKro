"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@components/Navbar";


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

    const handleLogout = () => {
        router.push("/signin");
    };

    return (
        <div className="flex flex-col items-center w-full min-h-screen  bg-gray-100">
            <Navbar />
            {/* Top Bar */}
            <div className="flex justify-between w-full p-3 max-w-4xl mb-4">
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    ← Back
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                    Logout ↩
                </Button>
            </div>

            {/* Profile Section */}
            <Card className="w-full max-w-4xl p-6 shadow-md">
                <CardContent className="flex flex-col items-center">
                    {/* Profile Picture */}
                    <div className="relative w-24 h-24 border-2 border-gray-300 rounded-full overflow-hidden">
                        <Image src="/profile-placeholder.png" alt="Profile" width={96} height={96} className="rounded-full" />
                    </div>
                    <Button size="sm" className="mt-2">
                        Upload Photo
                    </Button>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-6">
                        {["name", "prn", "batch", "email", "mobile", "github", "linkedin", "others"].map((field) => (
                            <div key={field}>
                                <label className="text-gray-600 text-sm">{field.toUpperCase()}</label>
                                <Input
                                    type="text"
                                    name={field}
                                    value={formData[field as keyof typeof formData]}
                                    onChange={handleChange}
                                    placeholder={`Enter ${field}`}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Skills Section */}
                    <div className="w-full mt-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Skills</h3>
                            <Button size="sm" onClick={handleAddSkill}>
                                + Add Skill
                            </Button>
                        </div>
                        <div className="mt-2 space-y-2">
                            {formData.skills.map((skill, index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    value={skill}
                                    onChange={(e) => handleSkillChange(index, e.target.value)}
                                    placeholder="Enter skill"
                                />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
