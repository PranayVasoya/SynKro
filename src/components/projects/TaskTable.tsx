"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckSquare, Bookmark, Bug } from "lucide-react";
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

interface TaskTableProps {
  tasks: Task[];
  selectedTasks: Set<string>;
  setSelectedTasks: (tasks: Set<string>) => void;
  fetchTasks: () => void;
}

export default function TaskTable({
  tasks,
  selectedTasks,
  setSelectedTasks,
  fetchTasks,
}: TaskTableProps) {
  const [editingCell, setEditingCell] = useState<{
    taskId: string;
    field: string;
  } | null>(null);

  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(tasks.map((t) => t._id)));
    }
  };

  const handleCellUpdate = async (
    taskId: string,
    field: string,
    value: string
  ) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { [field]: value });
      fetchTasks();
      setEditingCell(null);
      toast.success("Task updated");
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted border-b border-border">
          <tr>
            <th className="p-3 text-left w-12">
              <input
                type="checkbox"
                checked={tasks.length > 0 && selectedTasks.size === tasks.length}
                onChange={toggleSelectAll}
                className="w-4 h-4 cursor-pointer"
              />
            </th>
            <th className="p-3 text-left w-20">Type</th>
            <th className="p-3 text-left">Summary</th>
            <th className="p-3 text-left w-32">Status</th>
            <th className="p-3 text-left w-32">Assignee</th>
            <th className="p-3 text-left w-28">Priority</th>
            <th className="p-3 text-left w-32">Created</th>
            <th className="p-3 text-left w-32">Due Date</th>
            <th className="p-3 text-left w-32">Updated</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TaskRow
              key={task._id}
              task={task}
              isSelected={selectedTasks.has(task._id)}
              onToggleSelect={() => toggleTaskSelection(task._id)}
              editingCell={editingCell}
              onStartEdit={(field) =>
                setEditingCell({ taskId: task._id, field })
              }
              onCellUpdate={handleCellUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TaskRow({
  task,
  isSelected,
  onToggleSelect,
  editingCell,
  onStartEdit,
  onCellUpdate,
}: {
  task: Task;
  isSelected: boolean;
  onToggleSelect: () => void;
  editingCell: { taskId: string; field: string } | null;
  onStartEdit: (field: string) => void;
  onCellUpdate: (taskId: string, field: string, value: string) => void;
}) {
  const [editValue, setEditValue] = useState("");
  const isEditing = (field: string) =>
    editingCell?.taskId === task._id && editingCell?.field === field;

  const handleSave = (field: string) => {
    if (editValue.trim()) {
      onCellUpdate(task._id, field, editValue);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="p-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          className="w-4 h-4 cursor-pointer"
        />
      </td>
      <td className="p-3">
        {isEditing("type") ? (
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleSave("type")}
            autoFocus
            className="w-full p-1 bg-background border border-border rounded text-sm"
            style={{ minWidth: "80px", maxWidth: "120px" }}
          >
            <option value="Task">Task</option>
            <option value="Story">Story</option>
            <option value="Bug">Bug</option>
          </select>
        ) : (
          <div
            onClick={() => {
              setEditValue(task.type);
              onStartEdit("type");
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <TaskTypeIcon type={task.type} />
            <span className="text-sm">{task.type}</span>
          </div>
        )}
      </td>
      <td className="p-3">
        {isEditing("summary") ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleSave("summary")}
            onKeyDown={(e) => e.key === "Enter" && handleSave("summary")}
            autoFocus
            className="w-full p-1 bg-background border border-border rounded"
          />
        ) : (
          <div
            onClick={() => {
              setEditValue(task.summary);
              onStartEdit("summary");
            }}
            className="cursor-pointer"
          >
            {task.summary}
          </div>
        )}
      </td>
      <td className="p-3">
        {isEditing("status") ? (
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleSave("status")}
            autoFocus
            className="w-full p-1 bg-background border border-border rounded text-sm"
            style={{ minWidth: "100px", maxWidth: "140px" }}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Done">Done</option>
          </select>
        ) : (
          <div
            onClick={() => {
              setEditValue(task.status);
              onStartEdit("status");
            }}
            className="cursor-pointer"
          >
            <span
              className={`px-2 py-1 rounded text-xs font-medium inline-block ${
                task.status === "To Do"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                  : task.status === "In Progress"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : task.status === "In Review"
                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              }`}
              style={{ maxWidth: "120px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
              {task.status}
            </span>
          </div>
        )}
      </td>
      <td className="p-3 text-sm text-muted-foreground">
        {task.assignees.length > 0
          ? task.assignees.map((a) => a.username).join(", ")
          : task.createdBy.username}
      </td>
      <td className="p-3">
        {isEditing("priority") ? (
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleSave("priority")}
            autoFocus
            className="w-full p-1 bg-background border border-border rounded text-sm"
            style={{ minWidth: "80px", maxWidth: "120px" }}
          >
            <option value="Highest">Highest</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Lowest">Lowest</option>
          </select>
        ) : (
          <div
            onClick={() => {
              setEditValue(task.priority);
              onStartEdit("priority");
            }}
            className="cursor-pointer"
          >
            <span className="text-sm text-muted-foreground">{task.priority}</span>
          </div>
        )}
      </td>
      <td className="p-3 text-sm text-muted-foreground">
        {formatDate(task.createdAt)}
      </td>
      <td className="p-3">
        {isEditing("dueDate") ? (
          <input
            type="date"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleSave("dueDate")}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave("dueDate");
              }
            }}
            autoFocus
            className="w-full p-1 bg-background border border-border rounded text-sm"
            style={{ minWidth: "120px" }}
          />
        ) : (
          <div
            onClick={() => {
              // Ensure we have a valid date string to split
              const dateStr = task.dueDate || new Date().toISOString();
              // Extract just the date part (YYYY-MM-DD)
              setEditValue(dateStr.split("T")[0]);
              onStartEdit("dueDate");
            }}
            className="cursor-pointer text-sm text-muted-foreground hover:bg-muted/50 p-1 rounded transition-colors"
            style={{ border: "1px dashed transparent", display: "inline-block" }}
            onMouseOver={(e) => e.currentTarget.style.border = "1px dashed #ccc"}
            onMouseOut={(e) => e.currentTarget.style.border = "1px dashed transparent"}
          >
            {task.dueDate ? formatDate(task.dueDate) : "➕ Set due date"}
          </div>
        )}
      </td>
      <td className="p-3 text-sm text-muted-foreground">
        {formatDate(task.updatedAt)}
      </td>
    </tr>
  );
}
