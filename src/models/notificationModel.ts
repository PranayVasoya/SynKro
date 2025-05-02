import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  message: string;
  link?: string;
  read: boolean;
  relatedJoinRequest?: mongoose.Types.ObjectId;
  type?: string;
  createdAt: Date;
}

const notificationSchema: Schema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: "",
  },
  read: {
    type: Boolean,
    default: false,
  },
  relatedJoinRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JoinRequest",
  },
  type: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", notificationSchema);