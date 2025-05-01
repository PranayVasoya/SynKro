import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import Notification from "@/models/notificationModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

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
    const notification = await Notification.findById(id);
    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    // Verify the user is the recipient
    if (notification.recipient.toString() !== userId) {
      return NextResponse.json({ error: "You are not authorized to mark this notification as read" }, { status: 403 });
    }

    notification.read = true;
    await notification.save();

    return NextResponse.json({
      message: "Notification marked as read successfully",
      success: true,
      data: {
        _id: notification._id.toString(),
        read: notification.read,
      },
    });
  } catch (error: unknown) {
    console.error("Mark Notification Read: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}