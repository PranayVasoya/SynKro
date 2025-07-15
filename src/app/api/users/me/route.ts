import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const userId = await getDataFromToken(request);
    const user = await User.findById(userId).select(
      "-password -forgotPasswordToken -forgotPasswordTokenExpiry"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "User Found",
      data: user,
    });
  } catch (error: unknown) {
    console.error("Me: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}