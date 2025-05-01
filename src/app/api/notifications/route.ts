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
    const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
    return NextResponse.json({
      message: "Notifications fetched successfully",
      success: true,
      data: notifications,
    });
  } catch (error: unknown) {
    console.error("Fetch Notifications: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}