import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import Project from "@/models/projectModel";
import JoinRequest from "@/models/joinRequestModel";
import Notification from "@/models/notificationModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";

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
      return NextResponse.json({ error: "Only the project owner can reject join requests" }, { status: 403 });
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

    // Reject the join request
    joinRequest.status = "rejected";
    await joinRequest.save();

    // Update notification
    await Notification.findOneAndUpdate(
      { relatedJoinRequest: joinRequest._id, type: "join_request" },
      { message: `Your join request for "${project.title}" was rejected.`, read: false }
    );

    return NextResponse.json({
      message: "Join request rejected successfully",
      success: true,
      data: { joinRequestId: joinRequest._id.toString() },
    });
  } catch (error: unknown) {
    console.error("Reject Join Request: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}