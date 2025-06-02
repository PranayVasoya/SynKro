import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

interface LeaderboardEntry {
  _id: string;
  username: string;
  skills: string[];
  points: number;
  projects: { _id: string; title: string; status: "active" | "completed" }[];
}

export async function GET(request: NextRequest) {
  console.log("Request URL:", request.url);
  try {
    await connectToDatabase();

    const leaderboard = await User.aggregate<LeaderboardEntry>([
      {
        $lookup: {
          from: "projects",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$createdBy", "$$userId"] },
                    { $in: ["$$userId", "$teamMembers"] },
                  ],
                },
                status: "active",
              },
            },
            {
              $project: {
                _id: 1,
                title: 1,
                status: 1,
              },
            },
          ],
          as: "projects",
        },
      },
      {
        $match: {
          points: { $gt: 0 },
        },
      },
      {
        $project: {
          _id: "$_id",
          username: "$username",
          skills: "$skills",
          points: "$points",
          projects: 1,
        },
      },
      {
        $sort: { points: -1 },
      },
      {
        $limit: 50,
      },
    ]);

    const formattedLeaderboard = leaderboard.map((entry, index) => ({
      _id: entry._id.toString(),
      username: entry.username,
      skills: entry.skills || [],
      points: entry.points,
      details: `Contributed to ${entry.projects.length} active project${entry.projects.length !== 1 ? "s" : ""}`,
      projects: entry.projects.map((project) => ({
        _id: project._id.toString(),
        title: project.title,
        status: project.status,
      })),
      rank: index + 1,
    }));

    return NextResponse.json({
      message: "Leaderboard fetched successfully",
      success: true,
      data: formattedLeaderboard,
    });
  } catch (error: unknown) {
    console.error("Fetch Leaderboard: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}