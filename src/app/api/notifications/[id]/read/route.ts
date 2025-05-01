import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import Notification from "@/models/notificationModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    let userId: string;
    try {
      userId = await getDataFromToken(request);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    const notification = await Notification.findOneAndUpdate(
      { _id: params.id, recipient: userId },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Notification marked as read",
      success: true,
      data: notification,
    });
  } catch (error: unknown) {
    console.error("Mark Notification Read: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}