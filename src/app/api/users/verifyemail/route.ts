import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import crypto from "crypto";
import { connectToDatabase } from "@/dbConfig/dbConfig";

await connectToDatabase();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    console.log("VerifyEmail: Received request body:", reqBody);
    const { token } = reqBody;

    if (!token || typeof token !== "string") {
      console.log("VerifyEmail: Token validation failed, token:", token);
      return NextResponse.json(
        { error: "Token is required and must be a string" },
        { status: 400 }
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("VerifyEmail: Hashed token:", hashedToken);

    const user = await User.findOne({
      verifyToken: hashedToken,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      console.log("VerifyEmail: No user found for hashed token:", hashedToken);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();
    console.log("VerifyEmail: User verified successfully, email:", user.email);

    return NextResponse.json(
      {
        message: "Email verified successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("VerifyEmail: Error verifying email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}