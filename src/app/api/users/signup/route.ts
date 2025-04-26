import { connectToDatabase } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    // Ensure database connection
    await connectToDatabase();

    // Parse and validate request body
    const reqBody = await request.json();
    const { username, email, password, prn, batch, mobile } = reqBody;

    if (!username || !email || !password || !prn || !batch || !mobile) {
      return NextResponse.json(
        { error: "Username, email, password, prn, batch and mobile number are required" },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    console.log("Signup: Request body:", reqBody);

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      prn,
      batch,
      mobile,
    });

    const savedUser = await newUser.save();
    console.log("Signup: User saved:", savedUser);

    // Send verification email
    try {
      await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
      console.log("Signup: Verification email sent to:", email);
    } catch (emailError: any) {
      console.error("Signup: Failed to send verification email:", emailError);
      await User.deleteOne({ _id: savedUser._id });
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "User registered successfully. Please verify your email.",
      success: true,
      user: {
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error: any) {
    console.error("Signup: Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}