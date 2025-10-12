import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/dbConfig/dbConfig";
import Task from "@/models/taskModel";
import Notification from "@/models/notificationModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// POST assign/unassign user to task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { assigneeId, action } = body; // action: "assign" or "unassign"

    const task = await Task.findById(id)
      .populate("createdBy", "username email")
      .populate("assignees", "username email");

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const targetUserId = assigneeId || userId; // If no assigneeId, user assigns themselves

    if (action === "assign") {
      // Check if already assigned
      if (!task.assignees.some((a: any) => a._id.toString() === targetUserId)) {
        task.assignees.push(targetUserId);
        
        // Create notification
        const isSelfAssignment = targetUserId === userId;
        const notificationMessage = isSelfAssignment
          ? `You have assigned yourself to task: ${task.summary}`
          : `You have been assigned to task: ${task.summary}`;

        await Notification.create({
          recipient: targetUserId,
          type: "task_assignment",
          message: notificationMessage,
          link: `/projects/${task.projectId}`,
          read: false,
        });

        // If someone else assigned the task, notify them too
        if (!isSelfAssignment && assigneeId) {
          await Notification.create({
            recipient: userId,
            type: "task_assignment",
            message: `You assigned a task "${task.summary}" to a team member`,
            link: `/projects/${task.projectId}`,
            read: false,
          });
        }
      }
    } else if (action === "unassign") {
      task.assignees = task.assignees.filter(
        (a: any) => a._id.toString() !== targetUserId
      );
    }

    task.updatedAt = new Date();
    await task.save();
    await task.populate("createdBy", "username email");
    await task.populate("assignees", "username email");

    return NextResponse.json({
      message: `Task ${action === "assign" ? "assigned" : "unassigned"} successfully`,
      data: task,
    });
  } catch (error: unknown) {
    console.error("Error assigning task:", error);
    return NextResponse.json(
      { error: "Failed to assign task" },
      { status: 500 }
    );
  }
}
