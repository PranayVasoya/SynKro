import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: "join_request";
  message: string;
  link: string;
  relatedProject: mongoose.Types.ObjectId;
  relatedUser: mongoose.Types.ObjectId;
  relatedJoinRequest: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const notificationSchema: Schema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Recipient is required"],
  },
  type: {
    type: String,
    enum: ["join_request"],
    required: [true, "Notification type is required"],
  },
  message: {
    type: String,
    required: [true, "Please provide a notification message"],
    trim: true,
  },
  link: {
    type: String,
    default: "/notifications",
    trim: true,
  },
  relatedProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: [true, "Related project is required"],
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Related user is required"],
  },
  relatedJoinRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JoinRequest",
    required: [true, "Related join request is required"],
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", notificationSchema);