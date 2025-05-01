import mongoose, { Schema, Document } from "mongoose";

export interface IJoinRequest extends Document {
  project: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

const joinRequestSchema: Schema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure unique join request per user and project
joinRequestSchema.index({ project: 1, user: 1 }, { unique: true });

export default mongoose.models.JoinRequest || mongoose.model<IJoinRequest>("JoinRequest", joinRequestSchema);