import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/dbConfig/dbConfig";
import Project from "@/models/projectModel";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = params.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user's projects
    const projects = await Project.find({
      $or: [
        { createdBy: userId },
        { teamMembers: userId },
      ],
    }).populate([
      { path: "createdBy", select: "username email _id" },
      { path: "teamMembers", select: "username email _id" },
      { path: "likes", select: "username _id" },
      {
        path: "comments",
        populate: { path: "user", select: "username _id" },
      },
    ]);

    return NextResponse.json({
      message: "User projects fetched successfully",
      data: projects,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error fetching user projects";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}