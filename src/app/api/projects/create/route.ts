// src/app/api/projects/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/dbConfig/dbConfig";
import Project from "@/models/projectModel";
import Chatroom from "@/models/chatroomModel";
import Notification from "@/models/notificationModel";
import Post from "@/models/postModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

interface CreateProjectRequestBody {
  title: string;
  description: string;
  techStack: string[];
  repoLink?: string;
  liveLink?: string;
  teamMembers: string[]; // Array of user IDs as strings
  lookingForMembers: boolean;
  status: "active" | "completed";
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const reqBody = await request.json() as CreateProjectRequestBody;
    console.log("Create Project: Request body:", reqBody);

    const { title, description, techStack, repoLink, liveLink, teamMembers, lookingForMembers, status } = reqBody;

    // Validate required fields
    if (!title?.trim()) {
      console.log("Create Project: Missing title");
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!description?.trim()) {
      console.log("Create Project: Missing description");
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }
    if (!Array.isArray(techStack)) {
      console.log("Create Project: Invalid techStack");
      return NextResponse.json({ error: "Tech stack must be an array" }, { status: 400 });
    }
    if (!Array.isArray(teamMembers) || teamMembers.some((id) => typeof id !== "string")) {
      console.log("Create Project: Invalid teamMembers");
      return NextResponse.json({ error: "Team members must be an array of strings" }, { status: 400 });
    }
    if (!["active", "completed"].includes(status)) {
      console.log("Create Project: Invalid status");
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Authenticate user
    let userId: string;
    try {
      userId = await getDataFromToken(request);
      console.log("Create Project: Authenticated userId:", userId);
    } catch (error) {
      console.error("Create Project: Token error:", error);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Verify team members exist
    const validTeamMembers = await User.find({ _id: { $in: teamMembers } }).select("_id");
    if (validTeamMembers.length !== teamMembers.length) {
      console.log("Create Project: Some team members not found");
      return NextResponse.json({ error: "One or more team members not found" }, { status: 400 });
    }

    // Create project
    const project = new Project({
      title: title.trim(),
      description: description.trim(),
      techStack,
      repoLink: repoLink?.trim() || "",
      liveLink: liveLink?.trim() || "",
      createdBy: userId,
      teamMembers: [...new Set([userId, ...teamMembers])], // Ensure unique IDs
      lookingForMembers,
      status,
    });
    await project.save();
    console.log("Create Project: Project created:", project._id);

    // Create chatroom
    const chatroomTitle = `${title} Chatroom`;
    const chatroom = new Chatroom({
      title: chatroomTitle,
      project: project._id,
      members: [...new Set([userId, ...teamMembers])],
      messages: [],
    });
    await chatroom.save();
    console.log("Create Project: Chatroom created:", chatroom._id);

    // Create notification for creator
    const creatorNotification = new Notification({
      recipient: userId,
      message: `You created the project "${title}"`,
      link: `/projects/${project._id}`,
      read: false,
      type: "project_created",
    });
    await creatorNotification.save();

    // Create notifications for team members (except creator)
    const notificationPromises = teamMembers
      .filter((memberId) => memberId !== userId)
      .map((memberId) =>
        new Notification({
          recipient: memberId,
          message: `You have been added to the "${chatroomTitle}" for the project "${title}"`,
          link: "/chats",
          read: false,
          type: "team_member_added",
        }).save()
      );
    await Promise.all(notificationPromises);
    console.log("Create Project: Notifications created");

    // Award 200 points to the creator
    await User.findByIdAndUpdate(userId, { $inc: { points: 200 } });
    console.log("Create Project: Awarded 200 points to user:", userId);

    // Post to General Discussion if lookingForMembers and status is active
    if (lookingForMembers && status === "active") {
      const post = new Post({
        forumId: "1",
        title: `Looking for Members: ${title}`,
        content: `We are looking for team members for our project "${title}".\n\n**Description**: ${description}\n**Tech Stack**: ${techStack.join(", ")}\n**Status**: ${status}\nJoin us!`,
        createdBy: userId,
        project: project._id,
      });
      await post.save();
      console.log("Create Project: Posted to General Discussion:", post._id);
    }

    return NextResponse.json({
      message: "Project created successfully",
      success: true,
      data: project,
    });
  } catch (error: unknown) {
    console.error("Create Project: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}