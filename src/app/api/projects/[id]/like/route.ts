import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import Notification from "@/models/notificationModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const userId = await getDataFromToken(request);

    // Extract projectId from URL path: /api/projects/[id]/like
    const segments = request.nextUrl.pathname.split("/");
    // Example: ['', 'api', 'projects', 'projectId', 'like']
    const projectId = segments[3];
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const project = await Project.findById(projectId).populate("createdBy", "username");
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isLiked = project.likes.some((id: mongoose.Types.ObjectId) => id.equals(userObjectId));

    if (isLiked) {
      project.likes = project.likes.filter((id: mongoose.Types.ObjectId) => !id.equals(userObjectId));
    } else {
      project.likes.push(userObjectId);
      // Award 10 points to liker
      await User.findByIdAndUpdate(userId, { $inc: { points: 10 } });

      // Notify project creator (if not the liker)
      if (project.createdBy._id.toString() !== userId) {
        const liker = await User.findById(userId);
        if (liker) {
          const notification = new Notification({
            recipient: project.createdBy._id,
            message: `${liker.username} liked your project "${project.title}"`,
            link: `/projects/${projectId}`,
            read: false,
            type: "like",
          });
          await notification.save();
        }
      }
    }

    await project.save();

    return NextResponse.json({
      message: isLiked ? "Project unliked" : "Project liked",
      success: true,
      data: { likes: project.likes.length },
    });
  } catch (error: unknown) {
    console.error("Like Project: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
