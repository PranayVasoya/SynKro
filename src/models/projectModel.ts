import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  techStack: string[];
  repoLink: string;
  liveLink: string;
  createdBy: mongoose.Types.ObjectId;
  teamMembers: mongoose.Types.ObjectId[];
  lookingForMembers: boolean;
  status: "active" | "completed";
  createdAt: Date;
  likes: mongoose.Types.ObjectId[];
  comments: { userId: mongoose.Types.ObjectId; text: string; createdAt: Date }[];
}

const projectSchema: Schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a project title"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
    trim: true,
  },
  techStack: {
    type: [String],
    default: [],
  },
  repoLink: {
    type: String,
    default: "",
    trim: true,
  },
  liveLink: {
    type: String,
    default: "",
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teamMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lookingForMembers: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
        trim: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);