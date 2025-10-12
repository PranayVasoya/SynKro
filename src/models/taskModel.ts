import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  projectId: mongoose.Types.ObjectId;
  type: "Task" | "Story" | "Bug";
  summary: string;
  status: "To Do" | "In Progress" | "In Review" | "Done";
  priority: "Highest" | "High" | "Medium" | "Low" | "Lowest";
  createdBy: mongoose.Types.ObjectId;
  assignees: mongoose.Types.ObjectId[];
  createdAt: Date;
  dueDate: Date;
  updatedAt: Date;
}

const taskSchema: Schema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  type: {
    type: String,
    enum: ["Task", "Story", "Bug"],
    required: true,
  },
  summary: {
    type: String,
    required: [true, "Please provide a task summary"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "In Review", "Done"],
    default: "To Do",
  },
  priority: {
    type: String,
    enum: ["Highest", "High", "Medium", "Low", "Lowest"],
    default: "Medium",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
taskSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Drop old indexes if they exist and migrate old data
if (mongoose.models.Task) {
  mongoose.models.Task.collection.dropIndexes().catch(() => {
    // Ignore errors if indexes don't exist
  });
  
  // One-time migration: Update old tasks with assignee field to new schema
  mongoose.models.Task.collection.updateMany(
    { assignee: { $exists: true } },
    [
      {
        $set: {
          createdBy: "$assignee",
          assignees: [],
        },
      },
      {
        $unset: "assignee",
      },
    ]
  ).catch(() => {
    // Ignore errors
  });
}

export default mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);
