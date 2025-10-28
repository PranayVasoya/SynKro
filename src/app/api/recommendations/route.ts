import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { neo4jService } from "@/services/neo4j.service";

export async function GET(request: NextRequest) {
  try {
    // Get current user ID from token
    const userId = await getDataFromToken(request);
    
    // Get limit from query params (default 10)
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") || "all"; // 'all', 'skills', 'connections'

    let recommendations;
    
    if (type === "skills") {
      // Get recommendations based on similar skills only
      recommendations = await neo4jService.getUsersBySimilarSkills(userId, limit);
    } else {
      // Get comprehensive recommendations (skills + mutual connections)
      recommendations = await neo4jService.getRecommendations(userId, limit);
    }

    return NextResponse.json({
      message: "Recommendations fetched successfully",
      success: true,
      data: recommendations,
    });
  } catch (error: unknown) {
    console.error("Fetch Recommendations: Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}