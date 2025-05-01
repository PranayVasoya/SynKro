import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import Project from "@/models/projectModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    let userId: string;
    try {
      userId = await getDataFromToken(request);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const projects = await Project.find()
      .populate("createdBy", "username")
      .populate("teamMembers", "username");

    const formattedProjects = projects.map((project) => ({
      _id: project._id.toString(),
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      repoLink: project.repoLink,
      liveLink: project.liveLink,
      createdBy: {
        username: project.createdBy.username,
      },
      teamMembers: project.teamMembers.map((member: any) => ({
        _id: member._id.toString(),
        username: member.username,
      })),
      lookingForMembers: project.lookingForMembers,
      status: project.status,
      createdAt: project.createdAt,
    }));

    return NextResponse.json({
      message: "Projects fetched successfully",
      success: true,
      data: formattedProjects,
    });
  } catch (error: unknown) {
    console.error("Fetch Projects: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}