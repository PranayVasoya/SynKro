import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();

    type Query = {
      username?: {
        $regex: string;
        $options: string;
      }
    }

    const query: Query = {};
    
    if (search) {
      query.username = { $regex: search, $options: "i" };
    }

    const users = await User.find(query).select("_id username").limit(5);

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