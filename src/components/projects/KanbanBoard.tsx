"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckSquare, Bookmark, Bug, Plus, User } from "lucide-react";
import type { Task } from "@/interfaces/task";

const TaskTypeIcon = ({ type }: { type: "Task" | "Story" | "Bug" }) => {
  switch (type) {
    case "Task":
      return <CheckSquare className="w-4 h-4 text-blue-500" />;
    case "Story":
      return <Bookmark className="w-4 h-4 text-green-500" />;
    case "Bug":
      return <Bug className="w-4 h-4 text-red-500" />;
  }
};

interface KanbanBoardProps {
  tasks: Task[];
  fetchTasks: () => void;
  onCreateTask: () => void;
  currentUserId: string;
}

export default function KanbanBoard({
  tasks,
  fetchTasks,
  onCreateTask,
  currentUserId,
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns: Array<"To Do" | "In Progress" | "In Review" | "Done"> = [
    "To Do",
    "In Progress",
    "In Review",
    "Done",
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (status: string) => {
    if (!draggedTask) return;

    try {
      await axios.put(`/api/tasks/${draggedTask._id}`, { status });
      toast.success("Task status updated");
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    }
    setDraggedTask(null);
  };

  const handleAssignSelf = async (taskId: string) => {
    try {
      await axios.post(`/api/tasks/${taskId}/assign`, {
        action: "assign",
      });
      toast.success("You have been assigned to this task");
      fetchTasks();
    } catch (error) {
      console.error("Failed to assign task:", error);
      toast.error("Failed to assign task");
    }
  };

  const handleUnassignSelf = async (taskId: string) => {
    try {
      await axios.post(`/api/tasks/${taskId}/assign`, {
        assigneeId: currentUserId,
        action: "unassign",
      });
      toast.success("You have been unassigned from this task");
      fetchTasks();
    } catch (error) {
      console.error("Failed to unassign task:", error);
      toast.error("Failed to unassign task");
    }
  };

  const isAssignedToMe = (task: Task) => {
    return task.assignees.some((a) => a._id === currentUserId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Highest":
        return "border-l-4 border-l-red-500";
      case "High":
        return "border-l-4 border-l-red-400";
      case "Medium":
        return "border-l-4 border-l-orange-500";
      case "Low":
        return "border-l-4 border-l-blue-500";
      case "Lowest":
        return "border-l-4 border-l-blue-400";
      default:
        return "border-l-4 border-l-gray-400";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column);
        const columnColors = {
          "To Do": "bg-purple-50 dark:bg-purple-900/30",
          "In Progress": "bg-blue-50 dark:bg-blue-900/30",
          "In Review": "bg-yellow-50 dark:bg-yellow-900/30",
          Done: "bg-green-50 dark:bg-green-900/30",
        };

        return (
          <div
            key={column}
            className={`${columnColors[column]} rounded-lg p-4 min-h-[500px]`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm uppercase tracking-wide">
                {column}
              </h3>
              <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded-full">
                {columnTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {columnTasks.map((task) => (
                <motion.div
                  key={task._id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-card border border-border rounded-lg p-3 cursor-move shadow-sm hover:shadow-md transition-shadow ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {/* Task Type and Priority */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TaskTypeIcon type={task.type} />
                      <span className="text-xs text-muted-foreground">
                        {task.type}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      {task.priority}
                    </span>
                  </div>

                  {/* Task Summary */}
                  <h4 className="font-medium text-sm mb-2 line-clamp-2">
                    {task.summary}
                  </h4>

                  {/* Assignees */}
                  <div className="flex items-center gap-2 mb-2">
                    {task.assignees.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {task.assignees.map((a) => a.username).join(", ")}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Unassigned
                      </span>
                    )}
                  </div>

                  {/* Due Date */}
                  <div className="text-xs text-muted-foreground mb-3">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>

                  {/* Assign/Unassign Button */}
                  <div className="flex gap-2">
                    {isAssignedToMe(task) ? (
                      <button
                        onClick={() => handleUnassignSelf(task._id)}
                        className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                      >
                        Unassign Me
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAssignSelf(task._id)}
                        className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 transition-colors"
                      >
                        Assign Me
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Add Task Button */}
              {column === "To Do" && (
                <button
                  onClick={onCreateTask}
                  className="w-full border-2 border-dashed border-border rounded-lg p-3 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Add Task</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
