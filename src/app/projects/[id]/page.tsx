"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task } from "@/interfaces/task";
import type { Project } from "@/interfaces/project";
import TaskTable from "@/components/projects/TaskTable";
import CreateTaskModal from "@/components/projects/CreateTaskModal";
import DeleteConfirmModal from "@/components/projects/DeleteConfirmModal";
import SummaryView from "@/components/projects/SummaryView";
import KanbanBoard from "@/components/projects/KanbanBoard";

export default function ProjectTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"Summary" | "List" | "Kanban">("Kanban");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setCurrentUserId(res.data.data._id);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${projectId}`);
        setProject(res.data.data);
      } catch (error) {
        console.error("Failed to fetch project:", error);
        toast.error("Failed to load project");
      }
    };
    fetchProject();
  }, [projectId]);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/tasks?projectId=${projectId}`);
      setTasks(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (deleteConfirmText !== "Delete") {
      toast.error('Please type "Delete" to confirm');
      return;
    }

    try {
      await axios.post("/api/tasks/bulk-delete", {
        taskIds: Array.from(selectedTasks),
      });
      toast.success(`${selectedTasks.size} task(s) deleted`);
      setSelectedTasks(new Set());
      setShowDeleteConfirm(false);
      setDeleteConfirmText("");
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete tasks:", error);
      toast.error("Failed to delete tasks");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {project?.title || "Project"}
          </h1>
          <div className="flex gap-4 border-b border-border">
            <button
              onClick={() => setActiveTab("Kanban")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "Kanban"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setActiveTab("List")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "List"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setActiveTab("Summary")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "Summary"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Summary
            </button>
          </div>
        </div>

        {/* Kanban View */}
        {activeTab === "Kanban" && (
          <KanbanBoard
            tasks={tasks}
            fetchTasks={fetchTasks}
            onCreateTask={() => setShowCreateModal(true)}
            currentUserId={currentUserId}
          />
        )}

        {/* Summary View */}
        {activeTab === "Summary" && <SummaryView tasks={tasks} />}

        {/* List View */}
        {activeTab === "List" && (
          <div className="bg-card border border-border rounded-lg shadow-md overflow-hidden">
            <TaskTable
              tasks={tasks}
              selectedTasks={selectedTasks}
              setSelectedTasks={setSelectedTasks}
              fetchTasks={fetchTasks}
            />

            {/* Create Button */}
            <div className="p-4 border-t border-border">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Selected Tasks Action Bar */}
      <AnimatePresence>
        {selectedTasks.size > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4"
          >
            <span className="font-medium">
              {selectedTasks.size} task(s) selected
            </span>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Task Modal */}
      <CreateTaskModal
        showModal={showCreateModal}
        setShowModal={setShowCreateModal}
        projectId={projectId}
        fetchTasks={fetchTasks}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        showModal={showDeleteConfirm}
        setShowModal={setShowDeleteConfirm}
        deleteConfirmText={deleteConfirmText}
        setDeleteConfirmText={setDeleteConfirmText}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
