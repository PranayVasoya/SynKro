import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/dbConfig/dbConfig";
import Project from "@/models/projectModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    let userId: string;
    try {
      userId = await getDataFromToken(request);
      console.log("User ID from token:", userId);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token: " + error },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();

    type RegexCondition = {
      $regex: string;
      $options: string;
    };

    type Query = {
      $or?: {
        title?: RegexCondition;
        description?: RegexCondition;
        techStack?: RegexCondition;
      }[];
    };

    const query: Query = {};

    if (search) {
      const condition: RegexCondition = { $regex: search, $options: "i" };
      query.$or = [
        { title: condition },
        { description: condition },
        { techStack: condition },
      ];
    }

    const projects = await Project.find(query)
      .populate("createdBy", "username")
      .populate("comments.userId", "username")
      .sort({ createdAt: -1 })
      .limit(50);

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
