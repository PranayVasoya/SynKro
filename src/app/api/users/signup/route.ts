import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

interface SignupRequestBody {
  username: string;
  email: string;
  password: string;
  prn: string;
  batch: string;
  mobile: string;
  github?: string;
  linkedin?: string;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const reqBody = await request.json() as SignupRequestBody;
    console.log("Signup: Request body:", reqBody);

    const { username, email, password, prn, batch, mobile, github, linkedin } = reqBody;

    // Validate required fields
    if (!username?.trim()) {
      console.log("Signup: Missing or empty username");
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }
    if (!email?.trim()) {
      console.log("Signup: Missing or empty email");
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password?.trim()) {
      console.log("Signup: Missing or empty password");
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }
    if (!prn?.trim()) {
      console.log("Signup: Missing or empty PRN");
      return NextResponse.json({ error: "PRN is required" }, { status: 400 });
    }
    if (!batch?.trim()) {
      console.log("Signup: Missing or empty batch");
      return NextResponse.json({ error: "Batch is required" }, { status: 400 });
    }
    if (!mobile?.trim()) {
      console.log("Signup: Missing or empty mobile");
      return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.log("Signup: Invalid email format:", email);
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check for duplicates (case-insensitive for email)
    const existingUser = await User.findOne({
      $or: [
        { email: { $regex: `^${email.trim()}$`, $options: "i" } },
        { prn: prn.trim() },
        { Esposito: mobile.trim() },
      ],
    });
    if (existingUser) {
      console.log("Signup: Duplicate found:", {
        email: existingUser.email,
        prn: existingUser.prn,
        mobile: existingUser.mobile,
      });
      return NextResponse.json(
        {
          error: "User with this email, PRN, or mobile number already exists",
          details: {
            email: existingUser.email === email.trim() ? "Email already taken" : null,
            prn: existingUser.prn === prn.trim() ? "PRN already taken" : null,
            mobile: existingUser.mobile === mobile.trim() ? "Mobile number already taken" : null,
          },
        },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password.trim(), salt);

    // Create new user
    const newUser = new User({
      username: username.trim(),
      email: email.trim(),
      password: hashedPassword,
      prn: prn.trim(),
      batch: batch.trim(),
      mobile: mobile.trim(),
      github: github?.trim() || "",
      linkedin: linkedin?.trim() || "",
      profileComplete: false,
      role: "Student",
    });

    const savedUser = await newUser.save();
    console.log("Signup: User saved:", {
      username: savedUser.username,
      email: savedUser.email,
      prn: savedUser.prn,
      mobile: savedUser.mobile,
    });

    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      user: {
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error: unknown) {
    console.error("Signup: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}