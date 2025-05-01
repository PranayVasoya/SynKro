import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import Notification from "@/models/notificationModel";
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

    const notifications = await Notification.find({ recipient: userId })
      .populate("relatedProject", "title")
      .populate("relatedUser", "username")
      .sort({ createdAt: -1 });

    const formattedNotifications = notifications.map((notification) => ({
      _id: notification._id.toString(),
      message: notification.message,
      relatedProject: {
        _id: notification.relatedProject._id.toString(),
        title: notification.relatedProject.title,
      },
      relatedUser: {
        _id: notification.relatedUser._id.toString(),
        username: notification.relatedUser.username,
      },
      relatedJoinRequest: notification.relatedJoinRequest.toString(),
      read: notification.read,
      createdAt: notification.createdAt,
    }));

    return NextResponse.json({
      message: "Notifications fetched successfully",
      success: true,
      data: formattedNotifications,
    });
  } catch (error: unknown) {
    console.error("Fetch Notifications: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}