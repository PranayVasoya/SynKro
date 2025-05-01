import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import Project from "@/models/projectModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    let userId: string;
    try {
      userId = await getDataFromToken(request);
    } catch (error) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    const projects = await Project.find({
      $or: [{ createdBy: userId }, { teamMembers: userId }],
    });
    return NextResponse.json({
      message: "Projects fetched successfully",
      success: true,
      data: projects,
    });
  } catch (error: unknown) {
    console.error("Fetch Projects: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}