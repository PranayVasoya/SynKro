import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import Notification from "@/models/notificationModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const userId = await getDataFromToken(request);
    const projectId = params.id;
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

    // Award 10 points to commenter
    await User.findByIdAndUpdate(userId, { $inc: { points: 10 } });

    // Notify project creator (if not the commenter)
    if (project.createdBy._id.toString() !== userId) {
      const notification = new Notification({
        recipient: project.createdBy._id,
        message: `${(await User.findById(userId)).username} commented on your project "${project.title}"`,
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