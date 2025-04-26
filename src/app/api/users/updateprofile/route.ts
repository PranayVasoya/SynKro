import { connectToDatabase } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectToDatabase();

export async function PUT(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const body = await request.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✨ Step 1: Only update fields that changed
    let hasChanges = false;
    for (const key in body) {
      if (
        body.hasOwnProperty(key) &&
        typeof body[key] !== "undefined" &&
        body[key] !== user[key]
      ) {
        user[key] = body[key];
        hasChanges = true;
      }
    }

    // ✨ Step 2: Check if all required fields are filled
    const isProfileComplete =
      user.username &&
      user.prn &&
      user.batch &&
      user.email &&
      user.mobile;

    if (isProfileComplete && !user.profileComplete) {
      user.profileComplete = true;
      hasChanges = true;
    }

    // ✨ Step 3: Save only if something changed
    if (hasChanges) {
      await user.save();
    }

    return NextResponse.json({
      success: true,
      user,
      profileComplete: user.profileComplete,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
