"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateTaskModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  projectId: string;
  fetchTasks: () => void;
}

export default function CreateTaskModal({
  showModal,
  setShowModal,
  projectId,
  fetchTasks,
}: CreateTaskModalProps) {
  const [newTask, setNewTask] = useState({
    type: "Task" as "Task" | "Story" | "Bug",
    summary: "",
    status: "To Do" as "To Do" | "In Progress" | "In Review" | "Done",
    priority: "Medium" as "Highest" | "High" | "Medium" | "Low" | "Lowest",
    createdAt: new Date().toISOString().split("T")[0],
    dueDate: "",
  });

  const handleCreateTask = async () => {
    if (!newTask.summary.trim() || !newTask.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await axios.post("/api/tasks", {
        projectId,
        ...newTask,
      });
      toast.success("Task created successfully");
      setShowModal(false);
      setNewTask({
        type: "Task",
        summary: "",
        status: "To Do",
        priority: "Medium",
        createdAt: new Date().toISOString().split("T")[0],
        dueDate: "",
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task");
    }
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-lg p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
            <div className="space-y-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newTask.type}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      type: e.target.value as "Task" | "Story" | "Bug",
                    })
                  }
                  className="w-full p-2 bg-background border border-border rounded-md"
                >
                  <option value="Task">Task</option>
                  <option value="Story">Story</option>
                  <option value="Bug">Bug</option>
                </select>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Summary
                </label>
                <input
                  type="text"
                  value={newTask.summary}
                  onChange={(e) =>
                    setNewTask({ ...newTask, summary: e.target.value })
                  }
                  className="w-full p-2 bg-background border border-border rounded-md"
                  placeholder="Task description"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      status: e.target.value as
                        | "To Do"
                        | "In Progress"
                        | "In Review"
                        | "Done",
                    })
                  }
                  className="w-full p-2 bg-background border border-border rounded-md"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      priority: e.target.value as
                        | "Highest"
                        | "High"
                        | "Medium"
                        | "Low"
                        | "Lowest",
                    })
                  }
                  className="w-full p-2 bg-background border border-border rounded-md"
                >
                  <option value="Highest">Highest</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Lowest">Lowest</option>
                </select>
              </div>

              {/* Date of Creation */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Creation
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={newTask.createdAt}
                    onChange={(e) =>
                      setNewTask({ ...newTask, createdAt: e.target.value })
                    }
                    className="w-full p-2 bg-background border border-border rounded-md"
                  />
                  <Calendar className="absolute right-2 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="w-full p-2 bg-background border border-border rounded-md"
                  />
                  <Calendar className="absolute right-2 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask}>Done</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
