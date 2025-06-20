import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { email, password } = await request.json();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      {
        expiresIn: "1d",
      }
    );
    const response = NextResponse.json({
      message: "Logged In Success",
      success: true,
      data: { profileComplete: user.profileComplete },
    });

    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const expiryDate = new Date(Date.now() + oneDayInMilliseconds);

    response.cookies.set("token", token, { httpOnly: true, path: "/", expires: expiryDate, });
    return response;
  } catch (error: unknown) {
    console.error("Signin: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
