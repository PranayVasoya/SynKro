import mongoose, { Schema, Document } from "mongoose";

interface IPost extends Document {
  forumId: string;
  title: string;
  content: string;
  createdBy: mongoose.Types.ObjectId;
  project?: mongoose.Types.ObjectId | null;
  createdAt: Date;
}

const postSchema: Schema = new mongoose.Schema({
  forumId: {
    type: String,
    required: [true, "Please provide a forum ID"],
  },
  title: {
    type: String,
    required: [true, "Please provide a post title"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Please provide post content"],
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);