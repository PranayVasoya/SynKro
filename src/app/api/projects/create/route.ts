import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import Project from "@/models/projectModel";
import Post from "@/models/postModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

interface Project {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  techStack: string[];
  repoLink: string;
  liveLink: string;
  createdBy: mongoose.Types.ObjectId;
  teamMembers: mongoose.Types.ObjectId[];
  lookingForMembers: boolean;
  status: "active" | "completed";
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    let userId: string;
    try {
      userId = await getDataFromToken(request);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const {
      title,
      description,
      techStack,
      repoLink,
      liveLink,
      lookingForMembers,
      teamMembers,
      status,
    } = await request.json();

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const projectData: Partial<Project> = {
      title: title.trim(),
      description: description.trim(),
      techStack: techStack ? techStack.map((item: string) => item.trim()).filter(Boolean) : [],
      repoLink: repoLink?.trim() || "",
      liveLink: liveLink?.trim() || "",
      createdBy: new mongoose.Types.ObjectId(userId),
      teamMembers: teamMembers
        ? teamMembers.map((id: string) => new mongoose.Types.ObjectId(id))
        : [],
      lookingForMembers: !!lookingForMembers,
      status: status === "completed" ? "completed" : "active",
    };

    const project = new Project(projectData);
    await project.save();

    if (lookingForMembers && status !== "completed") {
      try {
        const post = new Post({
          forumId: "1", // General Discussion forum ID
          title: `Looking for Members: ${title}`,
          content: `We are looking for team members for our project "${title}".\n\n**Description**: ${description}\n**Tech Stack**: ${techStack.join(
            ", "
          )}\n**Status**: ${status}\nJoin us!`,
          createdBy: userId,
          project: project._id,
        });
        await post.save();
        console.log("Create Project: Posted to General Discussion:", post._id);
      } catch (postError: unknown) {
        console.error("Create Project: Failed to create community post:", postError);
        // Continue with project creation even if post creation fails
      }
    }

    const populatedProject = await Project.findById(project._id)
      .populate("createdBy", "username")
      .populate("teamMembers", "username");
    if (!populatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Project created successfully",
      success: true,
      data: {
        _id: populatedProject._id.toString(),
        title: populatedProject.title,
        description: populatedProject.description,
        techStack: project.techStack,
        repoLink: populatedProject.repoLink,
        liveLink: populatedProject.liveLink,
        createdBy: {
          username: populatedProject.createdBy.username,
        },
        teamMembers: populatedProject.teamMembers.map((member: any) => ({
          _id: member._id.toString(),
          username: member.username,
        })),
        lookingForMembers: populatedProject.lookingForMembers,
        status: populatedProject.status,
      },
    });
  } catch (error: unknown) {
    console.error("Create Project: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}