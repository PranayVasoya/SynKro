import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Project from "@/models/projectModel";

// Connect to database
connectToDatabase();

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.pathname.split("/").pop();
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch user data excluding sensitive info
    const user = await User.findById(userId).select(
      "-password -isVerified -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
      message: "User profile fetched successfully",
      data: {
        user,
        projects,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error fetching user profile";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}