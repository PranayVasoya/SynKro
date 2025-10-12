export interface Task {
  _id: string;
  projectId: string;
  type: "Task" | "Story" | "Bug";
  summary: string;
  status: "To Do" | "In Progress" | "In Review" | "Done";
  priority: "Highest" | "High" | "Medium" | "Low" | "Lowest";
  createdBy: {
    _id: string;
    username: string;
    email: string;
  };
  assignees: {
    _id: string;
    username: string;
    email: string;
  }[];
  createdAt: string;
  dueDate: string;
  updatedAt: string;
}
