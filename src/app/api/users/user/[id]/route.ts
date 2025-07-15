import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

 

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = params.id;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch user data excluding sensitive info
    const user = await User.findById(userId).select(
      "-password -isVerified -forgotPasswordToken -forgotPasswordTokenExpiry -verifyToken -verifyTokenExpiry"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error fetching user profile";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}