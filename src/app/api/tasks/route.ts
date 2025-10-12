import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/dbConfig/dbConfig";
import Task from "@/models/taskModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// GET all tasks for a project
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const tasks = await Task.find({ projectId })
      .populate("createdBy", "username email")
      .populate("assignees", "username email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      message: "Tasks fetched successfully",
      data: tasks,
    });
  } catch (error: unknown) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST create a new task
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, type, summary, status, priority, dueDate, assignees } = body;

    if (!projectId || !type || !summary || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTask = new Task({
      projectId,
      type,
      summary,
      status: status || "To Do",
      priority: priority || "Medium",
      createdBy: userId,
      assignees: assignees || [],
      dueDate: new Date(dueDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newTask.save();
    await newTask.populate("createdBy", "username email");
    await newTask.populate("assignees", "username email");

    return NextResponse.json({
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error: unknown) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
