import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

interface UpdateRequestBody {
  username?: string;
  prn?: string;
  batch?: string;
  mobile?: string;
  github?: string;
  linkedin?: string;
  skills?: string[];
  profileComplete?: boolean;
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const reqBody = await request.json() as UpdateRequestBody;
    console.log("Update Profile: Request body:", reqBody);

    const { username, prn, batch, mobile, github, linkedin, skills, profileComplete } = reqBody;

    // Validate required fields
    if (!username?.trim()) {
      console.log("Update Profile: Missing or empty username");
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }
    if (!prn?.trim()) {
      console.log("Update Profile: Missing or empty PRN");
      return NextResponse.json({ error: "PRN is required" }, { status: 400 });
    }
    if (!batch?.trim()) {
      console.log("Update Profile: Missing or empty batch");
      return NextResponse.json({ error: "Batch is required" }, { status: 400 });
    }
    if (!mobile?.trim()) {
      console.log("Update Profile: Missing or empty mobile");
      return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
    }

    // Validate skills (optional, but must be an array of strings if provided)
    if (skills && (!Array.isArray(skills) || skills.some((skill) => typeof skill !== "string"))) {
      console.log("Update Profile: Invalid skills format");
      return NextResponse.json({ error: "Skills must be an array of strings" }, { status: 400 });
    }

    // Authenticate user
    let userId: string;
    try {
      userId = await getDataFromToken(request);
      console.log("Update Profile: Authenticated userId:", userId);
    } catch (error) {
      console.error("Update Profile: Token error:", error);
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Check for duplicate PRN or mobile (excluding current user)
    const existingUser = await User.findOne({
      $or: [{ prn: prn?.trim() }, { mobile: mobile?.trim() }],
      _id: { $ne: userId },
    });
    if (existingUser) {
      console.log("Update Profile: Duplicate found:", {
        prn: existingUser.prn,
        mobile: existingUser.mobile,
      });
      return NextResponse.json(
        {
          error: "PRN or mobile number already exists",
          details: {
            prn: existingUser.prn === prn?.trim() ? "PRN already taken" : null,
            mobile: existingUser.mobile === mobile?.trim() ? "Mobile number already taken" : null,
          },
        },
        { status: 400 }
      );
    }

    // Prepare update object
    const updateData: UpdateRequestBody = {
      username: username?.trim(),
      prn: prn?.trim(),
      batch: batch?.trim(),
      mobile: mobile?.trim(),
      github: github?.trim() || "",
      linkedin: linkedin?.trim() || "",
      skills: skills || [],
    };
    if (profileComplete !== undefined) {
      updateData.profileComplete = profileComplete;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password -forgotPasswordToken -forgotPasswordTokenExpiry");

    if (!updatedUser) {
      console.log("Update Profile: User not found for userId:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Update Profile: User updated:", {
      username: updatedUser.username,
      prn: updatedUser.prn,
      mobile: updatedUser.mobile,
      skills: updatedUser.skills,
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error: unknown) {
    console.error("Update Profile: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}