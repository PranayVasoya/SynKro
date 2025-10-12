import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/dbConfig/dbConfig";
import Task from "@/models/taskModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// POST bulk delete tasks
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { taskIds } = body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json(
        { error: "Task IDs array is required" },
        { status: 400 }
      );
    }

    const result = await Task.deleteMany({ _id: { $in: taskIds } });

    return NextResponse.json({
      message: `${result.deletedCount} task(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    console.error("Error bulk deleting tasks:", error);
    return NextResponse.json(
      { error: "Failed to delete tasks" },
      { status: 500 }
    );
  }
}
