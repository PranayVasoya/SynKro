import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const users = await User.find().select("_id username");
    return NextResponse.json({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error: unknown) {
    console.error("Fetch Users: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}