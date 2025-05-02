import mongoose, { Schema, Document } from "mongoose";

export interface IJoinRequest extends Document {
  user: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

const joinRequestSchema: Schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
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

export default mongoose.models.JoinRequest || mongoose.model<IJoinRequest>("JoinRequest", joinRequestSchema);