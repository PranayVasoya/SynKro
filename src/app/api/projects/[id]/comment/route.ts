import connectToDatabase from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import Notification from "@/models/notificationModel";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const segments = request.nextUrl.pathname.split("/");
    const projectId = segments[3]; // Adjust index as needed

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const userId = await getDataFromToken(request);
    const { text } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "Comment text is required" }, { status: 400 });
    }

    const project = await Project.findById(projectId).populate("createdBy", "username");
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    project.comments.push({
      userId,
      text: text.trim(),
      createdAt: new Date(),
    });

    await project.save();

    await User.findByIdAndUpdate(userId, { $inc: { points: 10 } });

    if (project.createdBy._id.toString() !== userId) {
      const commenter = await User.findById(userId);
      const notification = new Notification({
        recipient: project.createdBy._id,
        message: `${commenter?.username} commented on your project "${project.title}"`,
        link: `/projects/${projectId}`,
        read: false,
        type: "comment",
      });
      await notification.save();
    }

    return NextResponse.json({
      message: "Comment added successfully",
      success: true,
      data: project.comments,
    });
  } catch (error: unknown) {
    console.error("Comment Project: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
