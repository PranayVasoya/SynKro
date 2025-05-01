import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import Project, { IProject } from "@/models/projectModel";
import JoinRequest from "@/models/joinRequestModel";
import Notification from "@/models/notificationModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

// Interface for populated user in teamMembers
interface PopulatedUser {
  _id: mongoose.Types.ObjectId;
  username: string;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    let userId: string;
    try {
      userId = await getDataFromToken(request);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const { id } = await params; // Await params to access id
    const { joinRequestId } = await request.json();

    if (!joinRequestId) {
      return NextResponse.json({ error: "Join request ID is required" }, { status: 400 });
    }

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify the user is the project owner
    if (project.createdBy.toString() !== userId) {
      return NextResponse.json({ error: "Only the project owner can accept join requests" }, { status: 403 });
    }

    const joinRequest = await JoinRequest.findById(joinRequestId);
    if (!joinRequest) {
      return NextResponse.json({ error: "Join request not found" }, { status: 404 });
    }

    if (joinRequest.project.toString() !== id) {
      return NextResponse.json({ error: "Join request does not belong to this project" }, { status: 400 });
    }

    if (joinRequest.status !== "pending") {
      return NextResponse.json({ error: "Join request is not pending" }, { status: 400 });
    }

    // Accept the join request
    joinRequest.status = "accepted";
    await joinRequest.save();

    // Add user to project teamMembers
    project.teamMembers.push(joinRequest.user);
    await project.save();

    // Update notification
    await Notification.findOneAndUpdate(
      { relatedJoinRequest: joinRequest._id, type: "join_request" },
      { message: `Your join request for "${project.title}" was accepted.`, read: false }
    );

    const populatedProject = await Project.findById(id).populate<{ teamMembers: PopulatedUser[] }>("teamMembers", "username");
    if (!populatedProject) {
      return NextResponse.json({ error: "Project not found after update" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Join request accepted successfully",
      success: true,
      data: {
        _id: populatedProject._id.toString(),
        teamMembers: populatedProject.teamMembers.map((member: PopulatedUser) => ({
          _id: member._id.toString(),
          username: member.username,
        })),
      },
    });
  } catch (error: unknown) {
    console.error("Accept Join Request: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}